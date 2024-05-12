import { Modal, ModalContent, ModalHeader, ModalBody, SlotsToClasses, TableSlots } from "@nextui-org/react";

import { useContext } from "react";

import { ProcessesContext } from '../context/ProcessesContext';

export const PaginationTableModal = () => {
  const { isOpenPagination, onOpenChangePagination } =
    useContext(ProcessesContext);
  return (
    <Modal
      isOpen={isOpenPagination}
      onOpenChange={onOpenChangePagination}
      size="5xl"
      isDismissable={false}
      hideCloseButton
      className="p-4"
      placement="center"
    >
      <ModalContent className="md:max-w-screen-2xl max-w-sm">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-bold text-2xl text-gray-600">
              Pagination Table
            </ModalHeader>
            <ModalBody>
              <PaginationTable
                classNames={{
                  base: "max-h-[500px]",
                }}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

interface Column {
  key: string;
  label: string;
}


interface Props {
  title?: string;
  className?: string;
  columns?: Column[];
  isLoading?: boolean;
  classNames?: SlotsToClasses<TableSlots>;
  isHeaderSticky?: boolean;
  removeWrapper?: boolean;
}



const PaginationTable = ({ title }:Props) => {

  const { processesWithPages, buffer } = useContext(ProcessesContext);


  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-slate-600">{title}</h2>
      <div className="overflow-auto h-[400px]">

        {
          buffer.map((item, index)=>{

            return (
              <div key={index} className="flex gap-5">
                <span className="w-5">
                  {index}
                </span>
                <span>
                  5/{
                    processesWithPages.map(process=>{
                      process.processUuid===item? process.size%5 : 0
                      return 0;
                    })
                  }
                </span>
                <span className="w-auto">
                  {item===""?"libre":item}
                </span>
              </div>
            );
          })
        }

      </div>
    </div>
  );
};
