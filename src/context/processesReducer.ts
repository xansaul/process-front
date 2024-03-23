import { IProcess } from "../interfaces/ProcessRequest";
import {ProcessesState} from "../hooks/useProcessProvider.ts";


type ProcessesActionType = { type: "Processes - setProcesses", payload: IProcess[] }
    | { type: "Processes - setNewRunningProcess",payload: number }
    | { type: "Processes - ++timeELAPSEDTimeRunningProcess" }
    | { type: "Processes - moveRunningProcess2Finished", payload: { timeFinished:number, resultOperation: string } }
    | { type: "Processes - addNewReadyProcess", payload: number }
    | { type: "Processes - --time_remainingRunningProcess" }
    | { type: "Processes - onProcessBlock" }
    | { type: 'Processes - blocked2ReadyProcess', payload: number }
    | { type: 'Processes - ++blockedProcesses' }
    | { type: 'Processes - toggleIsLoadingProcesses' }
    | { type: 'Processes - calcWaitAndServiceTime', payload: number }
    | { type: 'Processes - onFetchNewProcess', payload: IProcess };

export const ProcessesReducer = (
  state: ProcessesState,
  action: ProcessesActionType
): ProcessesState => {

  switch (action.type) {

    case "Processes - setProcesses":{
      const readyProcesses = action.payload.slice(0, 4);
      const processes = action.payload.slice(4);

      return {
        ...state,
        readyProcesses,
        processes,
        numberOfProcesses: action.payload.length,
        processesInMemory: readyProcesses.length
      };
    }

    case 'Processes - setNewRunningProcess': {

      const [newRunningProcess, ...remainingProcesses] = state.readyProcesses;
      if ( !newRunningProcess ) return { ...state };

      if ( !newRunningProcess.addedToRunningProcessForFirstTime ){
        newRunningProcess.response_time = action.payload;
        newRunningProcess.addedToRunningProcessForFirstTime = true;
      }

      return {
        ...state,
        runningProcess: newRunningProcess,
        readyProcesses: remainingProcesses,
      }
    }

    case 'Processes - ++timeELAPSEDTimeRunningProcess':{
      if ( !state.runningProcess ) return { ...state };
      const { elapsdT, ...rest } = state.runningProcess!;
      return{
        ...state,
        runningProcess: {
          ...rest,
          elapsdT: elapsdT+1
        }
      };

    }

    case 'Processes - moveRunningProcess2Finished': {
      const { runningProcess } = state;
      if (!runningProcess) return { ...state };

      const newProcessFinished: IProcess = {
        ...runningProcess,
        time_finished: action.payload.timeFinished,
        return_time: action.payload.timeFinished - runningProcess.initial_time,
        wait_time: action.payload.timeFinished - runningProcess.elapsdT - runningProcess.initial_time,
        service_time: runningProcess.elapsdT,
        is_finished: true,
        operation: `${runningProcess.operation} = ${action.payload.resultOperation}`,
      };


      return {
        ...state,
        runningProcess: undefined,
        finishedProcesses: [...state.finishedProcesses, newProcessFinished],
        processesInMemory: state.processesInMemory - 1
      };
    }

    case 'Processes - addNewReadyProcess': {
      const [ newReadyProcess, ...processes ] = state.processes

      if (!newReadyProcess) return {...state};

      if(!newReadyProcess.addedToReadyForFirstTime) {
        newReadyProcess.initial_time = action.payload;
        newReadyProcess.addedToReadyForFirstTime = true;
      }

      const readyProcesses = [...state.readyProcesses, newReadyProcess ]
      return {
        ...state,
        readyProcesses,
        processes,
        processesInMemory: state.processesInMemory + 1
      }
    }

    case 'Processes - onProcessBlock': {
      if ( !state.runningProcess ) return {...state};
      const newBlockedProcess = { ...state.runningProcess } as  IProcess;
      const blockedProcesses = [...state.blockedProcesses, newBlockedProcess];
      return {
        ...state,
        runningProcess: undefined,
        blockedProcesses
      }
    }
    case 'Processes - blocked2ReadyProcess': {
      const blockedProcess = state.blockedProcesses.find(
          process => process.id ===  action.payload
      );
      const updatedBlockedProcesses = state.blockedProcesses.filter(
          process => process.id !==  action.payload
      );

      blockedProcess!.time_blocked = 0;
      blockedProcess!.remaining_time_blocked = 0;
      const updatedReadyProcesses = [...state.readyProcesses, blockedProcess as IProcess];

      return {
        ...state,
        blockedProcesses: updatedBlockedProcesses,
        readyProcesses: updatedReadyProcesses
      };
    }

    case 'Processes - ++blockedProcesses': {
      const updatedBlockedProcesses = state.blockedProcesses.map(process => ({
        ...process,
        remaining_time_blocked: process.remaining_time_blocked + 1
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

    case "Processes - --time_remainingRunningProcess":{
      if ( !state.runningProcess ) return {...state};

      const { runningProcess } = state;
      const updatedRunningProcess = {...runningProcess};

      updatedRunningProcess.remaining_time_running = updatedRunningProcess.remaining_time_running - 1;

      return  {
        ...state,
        runningProcess: updatedRunningProcess
      }
    }

    case "Processes - onFetchNewProcess":{
      return {
        ...state,
        processes: [...state.processes, action.payload],
        numberOfProcesses: state.numberOfProcesses + 1
      }
    }

    case "Processes - calcWaitAndServiceTime":{

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


      if ( state.runningProcess ){
        const {  ...runningProcess } = state.runningProcess;
        runningProcess.wait_time = action.payload - runningProcess.elapsdT - runningProcess.initial_time;
        runningProcess.service_time = runningProcess.elapsdT
        runningProcessUpdated = runningProcess;
      }else{
        runningProcessUpdated = state.runningProcess;
      }


      return  {
        ...state,
        runningProcess: runningProcessUpdated,
        blockedProcesses: updatedBlockedProcesses,
        readyProcesses:   updatedReadyProcesses,
        processes: updatedProcesses,
      }
    }

    default:
      return state;
  }
};
