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
      ,blockProcess
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
          blockProcess
      }}
    >
      {children}
    </ProcessesContext.Provider>
  );
};
