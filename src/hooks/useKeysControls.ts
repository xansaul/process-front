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
        fetchNewProcess
    } = useContext(ProcessesContext);

    useEffect(() => {

        const handleKey = (event: KeyboardEvent) => {

            switch (event.key) {
                case 'p': {
                    return pauseTimer();
                }
                case 'c': {
                    onClose();
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
                    return onOpen();
                }
                case 'n': {

                    return fetchNewProcess();
                }
            }


        };

        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("keydown", handleKey);
        };

    }, [globalCounter.timer, globalCounter.is_paused]);

}
