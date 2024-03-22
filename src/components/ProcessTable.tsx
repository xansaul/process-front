import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue, Spinner
} from "@nextui-org/react";
import {IProcess} from "../interfaces/ProcessRequest";
import {columns as columnsTable} from "../config/config-table.ts";
import 'animate.css';
import {SlotsToClasses, TableSlots} from "@nextui-org/theme";

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
}


export const ProcessTable: React.FC<Props> = ({
                                                  processes = [],
                                                  title = '',
                                                  className = '',
                                                  columns = columnsTable,
                                                  isLoading = false,
                                                  classNames,
                                                  isHeaderSticky = false
                                              }) => {


    return (
        <div>
            <h2 className="text-xl font-semibold mb-2 text-slate-600">{title}</h2>
            <Table
                isHeaderSticky={isHeaderSticky}
                className={`table-scroll ${className}`}
                isStriped
                radius={"sm"}
                aria-label="Example empty table"
                classNames={{
                    wrapper: className = "min-h-[300px]",
                    ...classNames,
                }}

            >
                <TableHeader>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
                        <TableRow key={process.id} className="animate__animated animate__fadeInUp animate__faster">
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
