import {IProcess} from "../interfaces/ProcessRequest";
import {ProcessesState} from "../hooks/useProcessProvider.ts";
import { ProcessWithPages } from "../entities/Page.ts";


type ProcessesActionType = { type: "Processes - setProcesses", payload: IProcess[] }
    | { type: "Processes - setNewRunningProcess", payload: number }
    | { type: "Processes - ++timeELAPSEDTimeRunningProcess" }
    | { type: "Processes - moveRunningProcess2Finished", payload: { timeFinished: number, resultOperation: string } }
    | { type: "Processes - addNewReadyProcess", payload: number }
    | { type: "Processes - --time_remainingRunningProcess" }
    | { type: "Processes - onProcessBlock" }
    | { type: 'Processes - blocked2ReadyProcess', payload: string }
    | { type: 'Processes - ++blockedProcesses' }
    | { type: 'Processes - toggleIsLoadingProcesses' }
    | { type: 'Processes - calcWaitAndServiceTime', payload: number }
    | { type: 'Processes - onFetchNewProcess', payload: IProcess }
    | { type: 'Processes - setnextprocess' }
    | { type: 'Processes - rr' };

export const ProcessesReducer = (
    state: ProcessesState,
    action: ProcessesActionType
): ProcessesState => {

    switch (action.type) {

        case "Processes - setProcesses": {

            const buffer_with_os = [...state.buffer];
            buffer_with_os.fill({process: new ProcessWithPages("os"), size: 5 }, buffer_with_os.length - 5, buffer_with_os.length );
            const processesWithPages: ProcessWithPages[] = [];
            const readyProcesses = action.payload.map(process => {
                const numberOfEmpties = buffer_with_os.filter(element => element === undefined).length;
                const newProcessPaginated = new ProcessWithPages(process.id);

                if ( numberOfEmpties > newProcessPaginated.pagesNeeded ) {
                    
                    for(let i = 0; i < newProcessPaginated.pagesNeeded; i++){

                        const emptyIndex = buffer_with_os.indexOf(undefined);

                        if (emptyIndex !== -1) {
                            if ( i != newProcessPaginated.pagesNeeded-1) {

                                buffer_with_os[emptyIndex] = {process:newProcessPaginated, size: 5};
                            }else{ 
                                const sizeLastPage = newProcessPaginated.size % 5;
                                
                                buffer_with_os[emptyIndex] = {process:newProcessPaginated, size: sizeLastPage === 0 ? 5 : sizeLastPage};
                            }
                        }
                    }
                    
                    processesWithPages.push(newProcessPaginated);
                    process.state = 'ready';
                    return process;
                }
            
            });

            const filteredProcesses = readyProcesses.filter((process): process is IProcess => process !== undefined);

            const processes = action.payload.filter(process => {
                
                return !filteredProcesses.some(filteredProcess => filteredProcess.id === process.id);
            });

            const [nextProcess] = processes;
            let nextProcessWithNumberOfPages = undefined;
            if ( nextProcess ) {
                nextProcessWithNumberOfPages = new ProcessWithPages(nextProcess.id);
            }
            
            return {
                ...state,
                buffer: buffer_with_os,
                processes,
                readyProcesses: filteredProcesses,
                numberOfProcesses: action.payload.length,
                processesInMemory: filteredProcesses.length,
                nextProcess: nextProcessWithNumberOfPages,
                processesWithPages
            };
        }

        case 'Processes - setNewRunningProcess': {

            const [newRunningProcess, ...remainingProcesses] = state.readyProcesses;
            if (!newRunningProcess) return {...state};

            if (!newRunningProcess.addedToRunningProcessForFirstTime) {
                newRunningProcess.response_time = action.payload - newRunningProcess.initial_time;
                newRunningProcess.addedToRunningProcessForFirstTime = true;
            }

            newRunningProcess.state = 'running';

            return {
                ...state,
                runningProcess: newRunningProcess,
                readyProcesses: remainingProcesses,
            }
        }

        case 'Processes - ++timeELAPSEDTimeRunningProcess': {
            if (!state.runningProcess) return {...state};
            const {elapsdT, ...rest} = state.runningProcess!;
            return {
                ...state,
                runningProcess: {
                    ...rest,
                    elapsdT: elapsdT + 1
                }
            };

        }

        case 'Processes - moveRunningProcess2Finished': {
            const {runningProcess} = state;
            if (!runningProcess) return {...state};

            const processesWithPages = state.processesWithPages.filter(process => process.processUuid !== runningProcess.id);

            const processesInBuffer = state.buffer;

            processesInBuffer.forEach((processWithPages, index)=>{
                if(runningProcess.id === processWithPages?.process.processUuid){
                    processesInBuffer[index] = undefined;
                }
            });


            const newProcessFinished: IProcess = {
                ...runningProcess,
                time_finished: action.payload.timeFinished,
                return_time: action.payload.timeFinished - runningProcess.initial_time,
                wait_time: action.payload.timeFinished - runningProcess.elapsdT - runningProcess.initial_time,
                service_time: runningProcess.elapsdT,
                is_finished: true,
                operation: `${runningProcess.operation} = ${action.payload.resultOperation}`,
                state: 'finished'
            };

            

            return {
                ...state,
                runningProcess: undefined,
                finishedProcesses: [...state.finishedProcesses, newProcessFinished],
                processesWithPages
            };
        }

        case 'Processes - addNewReadyProcess': {
            const [newReadyProcess, ...processes] = state.processes

            if (!newReadyProcess) return {...state};
            if ( !state.nextProcess ) return {...state};

            const numberOfEmpties = state.buffer.filter(element => element === undefined).length;
            if ( numberOfEmpties < state.nextProcess.pagesNeeded ) return {...state};
            const newBuffer = [...state.buffer];
            for(let i = 0; i < state.nextProcess.pagesNeeded; i++){

                const emptyIndex = newBuffer.indexOf(undefined);
                if (emptyIndex !== -1) {
                    if (i!=state.nextProcess.pagesNeeded-1) {

                        newBuffer[emptyIndex] = {process:state.nextProcess, size: 5};
                    }else{
                        const sizeLastPage = state.nextProcess.size % 5;
                                

                        newBuffer[emptyIndex] = {process:state.nextProcess, size: sizeLastPage === 0 ? 5 : sizeLastPage};
                    }
                }
            }


            if (!newReadyProcess.addedToReadyForFirstTime) {
                newReadyProcess.initial_time = action.payload;
                newReadyProcess.addedToReadyForFirstTime = true;
            }
            newReadyProcess.state = 'ready';

            const readyProcesses = [...state.readyProcesses, newReadyProcess];

            const [nextProcess] = processes;
            let nextProcessWithNumberOfPages = undefined;
            if ( nextProcess ) {
                nextProcessWithNumberOfPages = new ProcessWithPages(nextProcess.id);
            }

            return {
                ...state,
                buffer:newBuffer,
                readyProcesses,
                processes,
                nextProcess: nextProcessWithNumberOfPages,
            }
        }

        case 'Processes - setnextprocess':{
            const [nextProcess] = state.processes;
            let nextProcessWithNumberOfPages = undefined;
            if ( nextProcess ) {
                nextProcessWithNumberOfPages = new ProcessWithPages(nextProcess.id);
            }
            return {
                ...state,
                nextProcess: nextProcessWithNumberOfPages
            }
        }

        case 'Processes - onProcessBlock': {
            if (!state.runningProcess) return {...state};
            const newBlockedProcess = {...state.runningProcess} as IProcess;
            newBlockedProcess.state = 'blocked';
            const blockedProcesses = [...state.blockedProcesses, newBlockedProcess];
            return {
                ...state,
                runningProcess: undefined,
                blockedProcesses
            }
        }
        case 'Processes - blocked2ReadyProcess': {
            const blockedProcess = state.blockedProcesses.find(
                process => process.id === action.payload
            );
            const updatedBlockedProcesses = state.blockedProcesses.filter(
                process => process.id !== action.payload
            );

            blockedProcess!.time_blocked = 0;
            blockedProcess!.elapsed_time_blocked = 0;
            blockedProcess!.state = 'ready';
            const updatedReadyProcesses = [...state.readyProcesses, blockedProcess as IProcess];

            return {
                ...state,
                blockedProcesses: updatedBlockedProcesses,
                readyProcesses: updatedReadyProcesses,
            };
        }

        case 'Processes - ++blockedProcesses': {
            const updatedBlockedProcesses = state.blockedProcesses.map(process => ({
                ...process,
                elapsed_time_blocked: process.elapsed_time_blocked + 1
            }));

            return {
                ...state,
                blockedProcesses: updatedBlockedProcesses
            };
        }

        case "Processes - toggleIsLoadingProcesses":
            return {
                ...state,
                isLoadingProcesses: !state.isLoadingProcesses
            }

        case "Processes - --time_remainingRunningProcess": {
            if (!state.runningProcess) return {...state};

            const {runningProcess} = state;
            const updatedRunningProcess = {...runningProcess};

            updatedRunningProcess.remaining_time_running = updatedRunningProcess.remaining_time_running - 1;

            return {
                ...state,
                runningProcess: updatedRunningProcess
            }
        }

        case "Processes - onFetchNewProcess": {

            const [nextProcess] = state.processes;
            let nextProcessWithNumberOfPages = undefined;
            if ( nextProcess ) {
                nextProcessWithNumberOfPages = new ProcessWithPages(nextProcess.id);
            }else {
                nextProcessWithNumberOfPages = new ProcessWithPages(action.payload.id);
            }
            
            return {
                ...state,
                processes: [...state.processes, action.payload],
                numberOfProcesses: state.numberOfProcesses + 1,
                nextProcess: nextProcessWithNumberOfPages
            }
        }

        case "Processes - calcWaitAndServiceTime": {

            const updatedProcesses = state.processes.map(process => {
                const service_time = process.elapsdT;

                return {
                    ...process,
                    service_time
                };
            });

            const updatedBlockedProcesses = state.blockedProcesses.map(process => {
                const wait_time = action.payload - process.elapsdT - process.initial_time;
                const service_time = process.elapsdT;

                return {
                    ...process,
                    wait_time,
                    service_time
                };
            });

            const updatedReadyProcesses = state.readyProcesses.map(process => {
                const wait_time = action.payload - process.elapsdT - process.initial_time;
                const service_time = process.elapsdT;

                return {
                    ...process,
                    wait_time,
                    service_time
                };
            });

            let runningProcessUpdated;


            if (state.runningProcess) {
                const {...runningProcess} = state.runningProcess;
                runningProcess.wait_time = action.payload - runningProcess.elapsdT - runningProcess.initial_time;
                runningProcess.service_time = runningProcess.elapsdT
                runningProcessUpdated = runningProcess;
            } else {
                runningProcessUpdated = state.runningProcess;
            }


            return {
                ...state,
                runningProcess: runningProcessUpdated,
                blockedProcesses: updatedBlockedProcesses,
                readyProcesses: updatedReadyProcesses,
                processes: updatedProcesses,
            }
        }

        case 'Processes - rr': {
            
            if (!state.runningProcess) return state;

            const runningProcess = {...state.runningProcess};

            runningProcess.elapsdT += 1; 
            runningProcess.remaining_time_running -= 1; 
            let processesWithPages = state.processesWithPages;
            runningProcess.state="ready"

            if (runningProcess.elapsdT === runningProcess.TEM) {
                const newFinishedsProcesses = [...state.finishedProcesses, runningProcess];
                runningProcess.state = 'finished'
                const processesInBuffer = state.buffer;
                processesInBuffer.forEach((processWithPages, index)=>{
                    if(runningProcess.id === processWithPages?.process.processUuid){
                        processesInBuffer[index] = undefined;
                    }
                });
               
                processesWithPages = state.processesWithPages.filter(process => process.processUuid !== runningProcess.id);
                

                return {
                    ...state,
                    finishedProcesses: newFinishedsProcesses,
                    runningProcess: undefined,
    
                }
            }
            
            const newQueueProcess = [...state.readyProcesses, runningProcess];
            
            return {
                ...state,
                readyProcesses: newQueueProcess,
                runningProcess: undefined,
                processesWithPages
            }
        }

        default:
            return state;
    }
};
