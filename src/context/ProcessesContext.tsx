import { createContext } from 'react';
import { BufferItem, IProcess } from '../interfaces/ProcessRequest';
import { TimerState } from '../interfaces/Timer';
import { ProcessWithPages } from '../entities/Page';

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
    processesInMemory: number;
    calcBcpTable: () => void;
    setQuantum: React.Dispatch<React.SetStateAction<number>>;
    processesInBuffer: ProcessWithPages[];
    buffer: (BufferItem|undefined)[];
    nextProcess: ProcessWithPages | undefined;
    isOpenPagination: boolean;
    onOpenChangePagination: () => void;
    onClosePagination: () => void;
    onOpenPagination: () => void;
    processesWithPages: ProcessWithPages[];
}

export const ProcessesContext = createContext({} as ContextProps);
