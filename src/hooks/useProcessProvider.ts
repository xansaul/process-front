import { useEffect, useReducer } from "react";
import {ProcessesReducer} from "../context";
import {useTimer} from "./useTimer.ts";
import {evaluate} from "mathjs";
import {IProcess} from "../interfaces/ProcessRequest.ts";
import {envs} from "../config";


export interface ProcessesState {
    processes: IProcess[];
    blockedProcesses: IProcess[];
    readyProcesses: IProcess[];
    finishedProcesses: IProcess[];
    runningProcess: IProcess | undefined;
    numberOfProcesses: number;
}

const PROCESSES_INITIAL_STATE: ProcessesState = {
    processes: [],
    blockedProcesses: [],
    readyProcesses: [],
    finishedProcesses: [],
    runningProcess: undefined,
    numberOfProcesses: 0,
};


export const useProcessProvider = () =>{
    const [state, dispatch] = useReducer(
        ProcessesReducer,
        PROCESSES_INITIAL_STATE
    );


    const [globalCounter, initGlobalCounter, pauseTimer, playTimer] = useTimer();

    useEffect(() => {

        if (state.numberOfProcesses === state.finishedProcesses.length && !state.runningProcess ) {
            pauseTimer();
        }else {
            playTimer();
        }

    }, [state.finishedProcesses.length, state.runningProcess]);

    useEffect(()=>{

        dispatch({ type: 'Processes - ++timeELAPSEDTime' });

    },[ globalCounter.timer ]);


    useEffect(()=>{

        if(!state.runningProcess) return;

        if ( state.runningProcess.elapsdT === state.runningProcess.TEM ){
            const result = evaluate(state.runningProcess.operation);
            dispatch({
                type: 'Processes - moveRunningProcess2Finished',
                payload: {
                    timeFinished :globalCounter.timer,
                    resultOperation: result
                }
            });
            dispatch({ type: 'Processes - setNewRunningProcess', payload: globalCounter.timer});
            dispatch({ type: 'Processes - addNewReadyProcess', payload: globalCounter.timer });
        }

    },[state.runningProcess?.elapsdT]);


    useEffect(() => {
        dispatch({ type: 'Processes - ++blockedProcesses' });
        state.blockedProcesses.forEach(process => {
            if (process.remaining_time_blocked === envs.SECONDS_BLOCKED_PROCESS) {

                dispatch({ type: 'Processes - blocked2ReadyProcess', payload: process.id });
            }
        });
    }, [globalCounter.timer]);

    useEffect(() => {
        if ( !state.runningProcess ){
            dispatch({ type: 'Processes - setNewRunningProcess', payload: globalCounter.timer });
        }
    }, [globalCounter.timer, state.readyProcesses]);

    const finishProcessWithError = (timeFinished:number) => {

        dispatch({
            type: 'Processes - moveRunningProcess2Finished',
            payload: {
                timeFinished : timeFinished,
                resultOperation: "error"
            }
        });
        dispatch({ type: 'Processes - setNewRunningProcess', payload: globalCounter.timer});
        dispatch({ type: 'Processes - addNewReadyProcess', payload: globalCounter.timer });

    }

    const setProcesses = (processes: IProcess[]) => {

        dispatch({type:"Processes - setProcesses", payload: processes});
        dispatch({type:'Processes - setNewRunningProcess', payload: globalCounter.timer});

        initGlobalCounter();

        return;
    }

    const blockProcess = (timeBlocked:number) => {
        dispatch({ type:'Processes - onProcessBlock', payload: timeBlocked });
        dispatch({ type: 'Processes - setNewRunningProcess', payload: globalCounter.timer});
    }



    return {
        state,
        setProcesses,
        finishProcessWithError,
        globalCounter,
        pauseTimer,
        playTimer,
        blockProcess,

    }
}