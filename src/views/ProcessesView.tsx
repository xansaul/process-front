import {useContext } from "react";
import { ProcessForm, ProcessTable } from "../components";
import { ProcessesContext } from "../context";
import {columns, columnsFinalTable, columnsReady, columnsRunning, columnsWithBlocked} from "../config/config-table.ts";
import {useKeysControls} from "../hooks";

export const ProcessesView = () => {
  
  const { readyProcesses,
    globalCounter,
    runningProcess,
    processes,
    finishedProcesses,
    blockedProcesses,
      isLoadingProcesses
  } = useContext(ProcessesContext);

  useKeysControls();


    
  return (
    <div className="min-h-screen bg-slate-200 pb-10 text-gray-600" >
      
      <ProcessForm isDisable={globalCounter.initTimer} />
      <h2 className="text-center mb-4 font-medium text-2xl pt-1">Global Counter: {globalCounter.timer}</h2>
      <h2 className="text-center mb-4 font-medium text-xl">New Processes: {processes.length}</h2>

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 gap-3 w-11/12 m-auto" >

          <div className="md:col-span-4">
            <ProcessTable
                processes={readyProcesses}
                title="Ready Processes"
                columns={columnsReady}
                isLoading={isLoadingProcesses}
            />
          </div>

          <div className="md:col-span-8">
            <ProcessTable
                title="Running Process"
                processes={ runningProcess? [runningProcess]:[] }
                columns={columnsRunning}
            />
          </div>

          <div className="md:col-span-4">
            <ProcessTable
                title="Blocked Processes"
                processes={ blockedProcesses }
                columns={columnsWithBlocked}
            />
          </div>

          <div className="md:col-span-8">
            <ProcessTable
                title="Finished Processes"
                processes={ finishedProcesses }
                columns={columns}
                classNames={{
                    base: "max-h-[300px]",
                }}
                isHeaderSticky
            />
          </div>

      </div>
        <div className="w-11/12 m-auto mt-4">
            <ProcessTable
                title="Results"
                processes={ finishedProcesses }
                columns={columnsFinalTable}
            />
        </div>
    </div>
  );
};
