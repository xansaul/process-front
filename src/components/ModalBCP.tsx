import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {useContext} from "react";
import {ProcessesContext} from "../context";
import {ProcessTable} from "./ProcessTable.tsx";


export const ModalBCP = () => {
    const { isOpen, onOpenChange, } = useContext(ProcessesContext);
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Table BCP</ModalHeader>
                        <ModalBody>
                            <ProcessTable
                                classNames={{
                                base: "max-h-[500px]",
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
