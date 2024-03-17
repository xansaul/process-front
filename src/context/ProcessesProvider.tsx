import { FC, ReactNode } from "react";
import { ProcessesContext } from "./";
import {useProcessProvider} from "../hooks";

interface Props {
  children: ReactNode;
}

export const ProcessesProvider: FC<Props> = ({ children }) => {

  const { setProcesses,
    finishProcessWithError,
    state,
    playTimer,
    pauseTimer,
    globalCounter
      ,blockProcess,
      toggleIsLoading
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
          toggleIsLoading
      }}
    >
      {children}
    </ProcessesContext.Provider>
  );
};
