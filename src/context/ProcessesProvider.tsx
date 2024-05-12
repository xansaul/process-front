import {FC, ReactNode} from "react";
import {ProcessesContext} from "./";
import {useProcessProvider} from "../hooks";

interface Props {
    children: ReactNode;
}

export const ProcessesProvider: FC<Props> = ({children}) => {

    const {
        setProcesses,
        finishProcessWithError,
        state,
        playTimer,
        pauseTimer,
        globalCounter
        , blockProcess,
        toggleIsLoading,
        onOpen,
        isOpen,
        onOpenChange,
        onClose,
        fetchNewProcess,
        calcBcpTable,
        setQuantum,
        isOpenPagination, onOpenPagination, onOpenChangePagination, onClosePagination
    } = useProcessProvider();


    return (
        <ProcessesContext.Provider
            value={{
                ...state,
                globalCounter,
                setProcesses,
                pauseTimer,
                playTimer,
                finishProcessWithError,
                blockProcess,
                toggleIsLoading,
                onOpen,
                isOpen,
                onOpenChange,
                onClose,
                fetchNewProcess,
                calcBcpTable, 
                setQuantum,
                isOpenPagination, onOpenChangePagination, onClosePagination, onOpenPagination
            }}
        >
            {children}
        </ProcessesContext.Provider>
    );
};
