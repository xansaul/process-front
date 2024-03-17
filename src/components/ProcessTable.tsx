import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue
} from "@nextui-org/react";
import { IProcess } from "../interfaces/ProcessRequest";

interface Column {
  key: string;
  label: string;
}

interface Props {
  processes?: IProcess[];
  title?: string;
  className?: string;
  columns: Column[];
}



export const ProcessTable: React.FC<Props> = ({ processes = [], title = '', className = '', columns}) => {


  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        </TableHeader>
        <TableBody items={processes} emptyContent="There are no processes">
          {(process) => (
            <TableRow key={process.id}>
              {(columnKey) => {
                if(columnKey === 'remaining_time') {
                  process.remaining_time = process.TEM - process.elapsdT;
                }

                if(columnKey === 'return_time') {
                  process.return_time = process.time_finished - process.initial_time;
                }

                if(columnKey === 'wait_time') {
                  process.wait_time = process.time_finished - process.elapsdT - process.initial_time;
                }

                if(columnKey === 'service_time') {
                  process.service_time = process.elapsdT;
                }
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
