import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {useContext} from "react";
import {ProcessesContext} from "../context";
import {ProcessTable} from "./ProcessTable.tsx";
import {BCPTable} from "../config/config-table.ts";


export const ModalBCP = () => {
    const { isOpen, onOpenChange, } = useContext(ProcessesContext);
    const {
        processes,
        finishedProcesses,
        blockedProcesses,
        readyProcesses,
        runningProcess,
     } = useContext(ProcessesContext);

    const allProcesses = [
        ...readyProcesses,
        ... blockedProcesses,
        ...finishedProcesses,
        ...processes,
    ];

    if (runningProcess) {
        allProcesses.unshift(runningProcess);
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            isDismissable={false}
            hideCloseButton
            className="p-4"
            placement="center"
        >
            <ModalContent className="md:max-w-screen-2xl max-w-sm">
                {() => (
                    <>
                        <ModalHeader
                            className="flex flex-col gap-1 font-bold text-2xl text-gray-600"
                        >
                            Table BCP
                        </ModalHeader>
                        <ModalBody>
                            <ProcessTable
                                columns={BCPTable}
                                classNames={{
                                base: "max-h-[500px]",
                                }}
                                processes={allProcesses}
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
