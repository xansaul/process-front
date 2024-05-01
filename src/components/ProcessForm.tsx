import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useProcesses } from "../hooks";
import {envs} from "../config";

interface Props {
  isDisable?: boolean;
}

export const ProcessForm: React.FC<Props> = ({ isDisable = false }) => {
    const { fetchProcesses,
        handleInputChange,
        noProcesses,
        quantum,
        isLoading,
    } = useProcesses();

  return (
    <div className="w-full">
      <form>
        <div className="flex flex-col w-full">
          <Input
            className="mb-2 md:w-4/12"
            placeholder="No. de procesos"
            label={<p className="font-semibold text-gray-600">No. process</p>}
            labelPlacement="outside"
            type="number"
            name="noProcesses"
            onChange={handleInputChange}
            value={noProcesses.toString()}
            description={`Max processes ${envs.MAX_NUMBER_OF_PROCESSES_TO_REQUEST}`}
          />
          <Input
            className="mb-2 md:w-4/12"
            placeholder="Quantum"
            label={<p className="font-semibold text-gray-600">Quantum</p>}
            labelPlacement="outside"
            type="number"
            name="quantum"
            onChange={handleInputChange}
            value={quantum.toString()}
          />
          <Button
            color="primary"
            className="w-20"
            onClick={(event) => fetchProcesses(event)}
            type="submit"
            isDisabled={isLoading || isDisable}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
