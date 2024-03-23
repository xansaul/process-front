import { createContext } from 'react';
import { IProcess } from '../interfaces/ProcessRequest';
import { TimerState } from '../interfaces/Timer';

export interface ContextProps {
    processes: IProcess[];
    blockedProcesses: IProcess[];
    readyProcesses: IProcess[];
    finishedProcesses: IProcess[];
    runningProcess: IProcess | undefined;
    setProcesses: (processes: IProcess[]) => void;
    globalCounter: TimerState;
    pauseTimer: () => void;
    playTimer: () => void;
    finishProcessWithError: (timeFinished:number) => void;
    blockProcess: () => void;
    isLoadingProcesses: boolean;
    toggleIsLoading: () => void;
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    onClose: () => void;
    fetchNewProcess: () => Promise<void>;
}

export const ProcessesContext = createContext({} as ContextProps);
