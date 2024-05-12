import { ProcessWithPages } from '../entities/Page';
export interface IProcess {
    TEM: number;
    addedToReadyForFirstTime: boolean;
    addedToRunningProcessForFirstTime: boolean;
    elapsdT: number;
    id: string;
    initial_time: number;
    is_finished: boolean;
    operation: string;
    elapsed_time_blocked: number;
    remaining_time_running: number;
    response_time: number;
    return_time: number;
    service_time: number;
    time_blocked: number;
    time_finished: number;
    wait_time: number;
    state: string;
}

export interface BufferItem {
    process: ProcessWithPages;
    size: number;
}