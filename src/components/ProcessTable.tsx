import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { IProcess } from "../interfaces/ProcessRequest";
import { columns as columnsTable } from "../config/config-table.ts";
import "animate.css";
import { SlotsToClasses, TableSlots } from "@nextui-org/theme";
import React, { useContext } from "react";
import { ProcessesContext } from "../context/ProcessesContext.tsx";

interface Column {
  key: string;
  label: string;
}

interface Props {
  processes?: IProcess[];
  title?: string;
  className?: string;
  columns?: Column[];
  isLoading?: boolean;
  classNames?: SlotsToClasses<TableSlots>;
  isHeaderSticky?: boolean;
  removeWrapper?: boolean;
}

export const ProcessTable: React.FC<Props> = ({
  processes = [],
  title = "",
  className = "",
  columns = columnsTable,
  isLoading = false,
  classNames,
  isHeaderSticky = false,
  removeWrapper = false,
}) => {
   const { buffer } = useContext(ProcessesContext);
  const renderCell = React.useCallback(
    (process: IProcess, columnKey: React.Key) => {
      const cellValue = process[columnKey as keyof IProcess];

      switch (columnKey) {
        case "id": {
          return (
            <div className="max-w-[60px] truncate text-nowrap">
              <span title={`${columnKey === "id" ? process.id : ""}`}>
                {process.id}
              </span>
            </div>
          );
        }
        case "remaining_time_blocked": {
          return (
            <>
              {process.state === "blocked"
                ? 8 - process.elapsed_time_blocked
                : "no blocked"}
            </>
          );
        }
        case "size": {
            const processInBuffer = buffer.find(item => item?.process.processUuid === process.id);
          return (
            <>
              {processInBuffer?.process.size}
            </>
          );
        }
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-slate-600">{title}</h2>
      <Table
        removeWrapper={removeWrapper}
        isHeaderSticky={isHeaderSticky}
        className={`table-scroll table-fixed ${className}`}
        radius={"sm"}
        aria-label="Example empty table"
        classNames={{
          wrapper: "min-h-[300px]",
          tr: "even:bg-gray-100 odd:bg-white",

          ...classNames,
        }}
      >
        <TableHeader>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
        </TableHeader>
        <TableBody
          items={processes}
          emptyContent={isLoading ? "" : "There are no processes"}
          isLoading={isLoading}
          loadingContent={
            <Spinner
              label="Loading Processes..."
              color="primary"
              labelColor="primary"
              className="font-medium"
            />
          }
        >
          {(process) => (
            <TableRow
              key={process.id}
              className="
                                animate__animated animate__fadeInUp animate__faster"
            >
              {(columnKey) => {
                return (
                  <TableCell className="first:rounded-l-lg last:rounded-r-lg">
                    {renderCell(process, columnKey)}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
