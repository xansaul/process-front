import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue, Spinner
} from "@nextui-org/react";
import { IProcess } from "../interfaces/ProcessRequest";
import {columns as columnsTable} from "../config/config-table.ts";

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
}



export const ProcessTable: React.FC<Props> = ({
                                                processes = [],
                                                title = '',
                                                className = '',
                                                columns = columnsTable,
                                                isLoading = false
}) => {


  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-xl font-semibold mb-2 text-slate-600">{title}</h2>
      <Table
          isStriped
          radius={"sm"}
          aria-label="Example empty table"
          classNames={{
              wrapper: className="min-h-[300px]"
          }}

      >
        <TableHeader>
          <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        </TableHeader>
        <TableBody
            items= {processes}
            emptyContent={isLoading ?"":"There are no processes"}
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
            <TableRow key={process.id}>
                  {(columnKey) => {
                    return (<TableCell>{getKeyValue(process, columnKey)}</TableCell>)
                  }
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
