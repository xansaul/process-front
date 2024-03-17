import { useState } from "react";

export const useFetch = <T>() => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const get = async (url: string ) => {
        try {
            setIsLoading(true);
            const response = await fetch(url);
            const data: T = await response.json();
            return data;

        } catch (error) {
            console.error(error);
            return null;
        }
        finally {
            setIsLoading(false)
        }
    }

    return {
        get,
        isLoading
    }
}

