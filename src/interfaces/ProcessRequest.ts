export interface IProcess {
    TEM: number;
    addedToReadyForFirstTime: boolean;
    addedToRunningProcessForFirstTime: boolean;
    elapsdT: number;
    id: number;
    initial_time: number;
    is_finished: boolean;
    operation: string;
    remaining_time_blocked: number;
    remaining_time_running: number;
    response_time: number;
    return_time: number;
    service_time: number;
    time_blocked: number;
    time_finished: number;
    wait_time: number;
    state: string;
}
