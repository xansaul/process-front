import {useContext, useEffect} from "react";
import {ProcessesContext} from "../context";


export const useKeysControls = () => {

    const { pauseTimer, playTimer, finishProcessWithError, globalCounter, blockProcess } = useContext(ProcessesContext);

    useEffect(() => {

        const handleKey = (event: KeyboardEvent) => {

            switch(event.key){
                case 'p':{
                    return pauseTimer();
                }
                case 'c':{
                    return playTimer();
                }
                case 'w': {
                    return finishProcessWithError(globalCounter.timer);
                }
                case 'e':{
                    return blockProcess(globalCounter.timer);
                }
            }



        };

        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("keydown", handleKey);
        };

    }, [globalCounter.timer]);

}