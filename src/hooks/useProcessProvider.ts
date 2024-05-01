import { useEffect, useReducer, useState } from "react";
import {ProcessesReducer} from "../context";
import {useTimer} from "./useTimer.ts";
import {evaluate} from "mathjs";
import {IProcess} from "../interfaces/ProcessRequest.ts";
import {envs} from "../config";
import {useDisclosure} from "@nextui-org/react";
import {useFetch} from "./useFetch.ts";

export interface ProcessesState {
    processes: IProcess[];
    blockedProcesses: IProcess[];
    readyProcesses: IProcess[];
    finishedProcesses: IProcess[];
    runningProcess: IProcess | undefined;
    numberOfProcesses: number;
    isLoadingProcesses: boolean;
    processesInMemory: number;
}

const PROCESSES_INITIAL_STATE: ProcessesState = {
    processes: [],
    blockedProcesses: [],
    readyProcesses: [],
    finishedProcesses: [],
    runningProcess: undefined,
    numberOfProcesses: 0,
    isLoadingProcesses: false,
    processesInMemory: 0
};

export const useProcessProvider = () =>{
    const [state, dispatch] = useReducer(
        ProcessesReducer,
        PROCESSES_INITIAL_STATE
    );
    
    const [quantum, setQuantum] = useState(3);
    const [rrTimeCounter, setRrTimeCounter] = useState<number>(0);
    
    const [globalCounter, initGlobalCounter, pauseTimer, playTimer] = useTimer(envs.TIMER_VELOCITY);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const { get } = useFetch<IProcess[]>();
    
    useEffect(() => {
        
        if ( state.processesInMemory === 0 ) {
            pauseTimer();
        }else {
            playTimer();
        }
        
    }, [state.processesInMemory]);
    
    useEffect(()=>{
        if (!state.runningProcess) return;
        setRrTimeCounter(prev => prev+1);

        if ( rrTimeCounter === Number(quantum)-1 ){
            dispatch({type: 'Processes - rr'});
            setRrTimeCounter(0);

            return;
        }
        dispatch({ type: 'Processes - ++timeELAPSEDTimeRunningProcess' });
        dispatch({type: 'Processes - --time_remainingRunningProcess'});
        
        

    },[ globalCounter.timer ]);

    useEffect(()=>{

        if(!state.runningProcess) return;

        if ( state.runningProcess.elapsdT === state.runningProcess.TEM ){
            const result = evaluate(state.runningProcess.operation);
            dispatch({
                type: 'Processes - moveRunningProcess2Finished',
                payload: {
                    timeFinished :globalCounter.timer,
                    resultOperation: result.toFixed(2)
                }
            });
        }

    },[state.runningProcess?.elapsdT]);

    useEffect(()=>{

        if(!state.runningProcess) return;

        if ( state.runningProcess.elapsdT === state.runningProcess.TEM ){
            const result = evaluate(state.runningProcess.operation);
            dispatch({
                type: 'Processes - moveRunningProcess2Finished',
                payload: {
                    timeFinished :globalCounter.timer,
                    resultOperation: result.toFixed(2)
                }
            });
            setRrTimeCounter(0);
        }
    },[state.runningProcess?.elapsdT]);


    useEffect(() => {
        dispatch({ type: 'Processes - ++blockedProcesses' });
        state.blockedProcesses.forEach(process => {
            if (process.elapsed_time_blocked === envs.SECONDS_BLOCKED_PROCESS) {
                dispatch({ type: 'Processes - blocked2ReadyProcess', payload: process.id });
            }
        });
    }, [globalCounter.timer]);

    useEffect(() => {
        if ( state.processesInMemory >= 4 ) return;

        dispatch({ type: 'Processes - addNewReadyProcess', payload: globalCounter.timer })

    }, [state.processesInMemory, state.processes]);

    useEffect(() => {
        if ( !state.runningProcess ){
            dispatch({ type: 'Processes - setNewRunningProcess', payload: globalCounter.timer });
        }
    }, [state.readyProcesses.length, state.runningProcess ]);

    const finishProcessWithError = (timeFinished:number) => {
        if ( !state.runningProcess ) return;

        dispatch({
            type: 'Processes - moveRunningProcess2Finished',
            payload: {
                timeFinished : timeFinished,
                resultOperation: "error"
            }
        });
        setRrTimeCounter(0);
    }

    const setProcesses = (processes: IProcess[]) => {

        dispatch({type:"Processes - setProcesses", payload: processes});
        initGlobalCounter();

        return;
    }
    const blockProcess = () => {
        dispatch({ type:'Processes - onProcessBlock' });
    }

    const toggleIsLoading = () =>{
        dispatch({ type: 'Processes - toggleIsLoadingProcesses' });
    }

    const fetchNewProcess = async() =>{

        const newProcess = await get(`${ envs.API_URL}?noProcesses=1`);
        if ( !newProcess ) throw 'Error fetching process';
        dispatch({ type:'Processes - onFetchNewProcess', payload: newProcess[0] });
    }

    const calcBcpTable = () => {
        dispatch({ type: 'Processes - calcWaitAndServiceTime', payload: globalCounter.timer });
    }

    return {
        state,
        setProcesses,
        finishProcessWithError,
        globalCounter,
        pauseTimer,
        playTimer,
        blockProcess,
        toggleIsLoading,
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
        fetchNewProcess,
        calcBcpTable,
        setQuantum
    }
}
