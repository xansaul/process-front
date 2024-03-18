
export interface IProcess {
    TEM:         number;
    elapsdT:     number;
    id:          number;
    is_finished: boolean;
    operation:   string;
    time_finished: number;
    remaining_time_running: number;
    time_blocked: number;
    remaining_time_blocked: number;
    initial_time: number;
    addedToReadyForFirstTime: boolean;
    response_time: number;
    addedToRunningProcessForFirstTime: boolean;
    return_time: number;
    wait_time: number;
    service_time: number;
}
