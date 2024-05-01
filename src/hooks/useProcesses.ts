import React, {useContext } from "react";
import { ProcessesContext } from "../context";
import {envs} from "../config";
import { IProcess } from "../interfaces/ProcessRequest";
import { useFetch, useForm } from "./";
import {isInteger, isNaN} from "mathjs";

const initialData = { noProcesses: '0', quantum: 0 }
export const useProcesses = () => {

    const { setProcesses, toggleIsLoading, setQuantum  } = useContext(ProcessesContext);
    const { isLoading, get } = useFetch<IProcess[]>();
    const { handleInputChange, dataForm } = useForm<{ noProcesses: string, quantum: number }>({
        initialData
    })
    const validateInput = (input: string): boolean => {

        const numberInput = Number(input);
        if (isNaN(numberInput)) return false;
        if (!isInteger(numberInput)) return false;
        if (numberInput === 0 || numberInput < 0) return false;
        if (numberInput > envs.MAX_NUMBER_OF_PROCESSES_TO_REQUEST) return false;

        return true;
    };

    const fetchProcesses = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (!validateInput(dataForm.noProcesses)) return;
        toggleIsLoading();
        const data = await get(`${envs.API_URL}?noProcesses=${ dataForm.noProcesses }`);

        if ( data === null ){
            setProcesses([]);
        }else{
            setProcesses(data);
            setQuantum(dataForm.quantum);
        }

        toggleIsLoading();

    }

    return {
        // functions
        fetchProcesses,
        handleInputChange,
        // variables
        noProcesses: dataForm.noProcesses,
        quantum: dataForm.quantum,
        isLoading
    }
}
