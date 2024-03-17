import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useProcesses } from "../hooks";

interface Props {
  isDisable?: boolean;
}

export const ProcessForm: React.FC<Props> = ({ isDisable = false }) => {
    const { fetchProcesses,
        handleInputChange,
        noProcesses,
        isLoading,
    } = useProcesses();
    
  return (
    <div className="w-full">
      <form>
        <div className="flex flex-col md:pl-6 md:pt-8 p-4 w-full">
          <Input
            className="mb-2 lg:w-2/12 md:w-3/12"
            placeholder="No. de procesos"
            label={<p className="font-semibold">No. process</p>}
            labelPlacement="outside"
            type="number"
            name="noProcesses"
            onChange={handleInputChange}
            value={noProcesses.toString()}
          />
          <Button
            color="primary"
            className="w-20"
            onClick={(event) => fetchProcesses(event)}
            type="submit"
            isDisabled={isLoading || isDisable}
          >
            Crear
          </Button>
        </div>
      </form>
    </div>
  );
};
