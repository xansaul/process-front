import {useContext, useEffect} from "react";
import {ProcessesContext} from "../context";


export const useKeysControls = () => {

    const {
        pauseTimer,
        playTimer,
        finishProcessWithError,
        globalCounter,
        blockProcess,
        onOpen,
        onClose,
        fetchNewProcess,
        processesInMemory,
        calcBcpTable,
        onClosePagination,
        onOpenPagination
    } = useContext(ProcessesContext);

    useEffect(() => {

        const handleKey = (event: KeyboardEvent) => {

            switch (event.key) {
                case 'p': {
                    return pauseTimer();
                }
                case 'c': {
                    onClose();
                    onClosePagination();
                    if ( processesInMemory === 0 ) return;
                    return playTimer();
                }
                case 'w': {
                    if (globalCounter.is_paused) return;
                    return finishProcessWithError(globalCounter.timer);
                }
                case 'e': {
                    if (globalCounter.is_paused) return;
                    return blockProcess();
                }
                case 'b': {
                    pauseTimer();
                    calcBcpTable();
                    return onOpen();
                }
                case 'n': {
                    if (globalCounter.is_paused) return;
                    return fetchNewProcess();
                }
                case 't': {
                    pauseTimer();
                    return onOpenPagination();
                }
            }


        };

        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("keydown", handleKey);
        };

    }, [globalCounter.timer, globalCounter.is_paused]);

}
