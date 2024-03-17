import React, {useContext, useEffect} from "react";
import { ProcessesContext } from "../context";
import {envs} from "../config";
import { IProcess } from "../interfaces/ProcessRequest";
import { useFetch, useForm } from "./";

const initialData = { noProcesses:0 }
export const useProcesses = () => {

    const { setProcesses, toggleIsLoading } = useContext(ProcessesContext);
    const { isLoading, get } = useFetch<IProcess[]>();
    const { handleInputChange, dataForm } = useForm<{ noProcesses: number }>({
        initialData
    })

    const fetchProcesses = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if ( dataForm.noProcesses === 0 || dataForm.noProcesses < 0) return;

        if ( dataForm.noProcesses > 20 ) return;

        const data = await get(`${envs.API_URL}?noProcesses=${ dataForm.noProcesses }`);

        if ( data === null ){
            setProcesses([]);
        }else{
            setProcesses(data);
        }


    }

    useEffect(() => {
        toggleIsLoading();
    }, [isLoading]);



    return {
        // functions
        fetchProcesses,
        handleInputChange,
        // variables
        noProcesses: dataForm.noProcesses,
        isLoading
    }
}