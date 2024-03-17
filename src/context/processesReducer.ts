import { IProcess } from "../interfaces/ProcessRequest";
import {ProcessesState} from "../hooks/useProcessProvider.ts";


type ProcessesActionType = { type: "Processes - setProcesses", payload: IProcess[] }
    | { type: "Processes - setNewRunningProcess",payload: number }
    | { type: "Processes - ++timeELAPSEDTime" }
    | { type: "Processes - moveRunningProcess2Finished", payload: { timeFinished:number, resultOperation: string } }
    | { type: "Processes - addNewReadyProcess", payload: number }
    | { type: "Processes - onProcessError" }
    | { type: "Processes - onProcessBlock", payload: number }
    | { type: 'Processes - blocked2ReadyProcess', payload: number }
    | { type: 'Processes - ++blockedProcesses' };

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
        numberOfProcesses: action.payload.length
      };
    }

    case 'Processes - setNewRunningProcess': {

      const [newRunningProcess, ...remainingProcesses] = state.readyProcesses;

      if ( !newRunningProcess ) return { ...state };

      if ( !newRunningProcess.first_adding_in_running ){
        newRunningProcess.response_time = action.payload;
      }

      newRunningProcess.first_adding_in_running = true;

      return {
        ...state,
        runningProcess: newRunningProcess,
        readyProcesses: remainingProcesses,
      }
    }

    case 'Processes - ++timeELAPSEDTime':{
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
      if ( !state.runningProcess ) return {...state}
      const newProcessFinished = { ...state.runningProcess } as  IProcess;
      newProcessFinished.time_finished = action.payload.timeFinished;
      newProcessFinished.is_finished = true;
      newProcessFinished.operation = `${newProcessFinished.operation} = ${action.payload.resultOperation}`;

      return {
        ...state,
        runningProcess: undefined,
        finishedProcesses: [...state.finishedProcesses, newProcessFinished],
      };
    }

    case 'Processes - addNewReadyProcess': {
      if ( !state.runningProcess ) return {...state};
      if ( state.readyProcesses.length === 0 ) return {...state};

      const [ newReadyProcess, ...processes ] = state.processes

      if (!newReadyProcess) return {...state};

      if(!newReadyProcess.first_adding_in_ready) {
        newReadyProcess.initial_time = action.payload;
      }

      newReadyProcess.first_adding_in_ready = false;

      const readyProcesses = [...state.readyProcesses, newReadyProcess ]
      return {
        ...state,
        readyProcesses,
        processes
      }
    }

    case 'Processes - onProcessBlock': {
      if ( !state.runningProcess ) return {...state};
      const newBlockedProcess = { ...state.runningProcess } as  IProcess;
      const blockedProcesses = [...state.blockedProcesses, newBlockedProcess];
      newBlockedProcess.time_blocked = action.payload;
      return {
        ...state,
        runningProcess: undefined,
        blockedProcesses
      }
    }
    case 'Processes - blocked2ReadyProcess': {
      const blockedProcess = state.blockedProcesses.find(process => process.id ===  action.payload);
      const updatedBlockedProcesses = state.blockedProcesses.filter(process => process.id !==  action.payload);

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

    default:
      return state;
  }
};
