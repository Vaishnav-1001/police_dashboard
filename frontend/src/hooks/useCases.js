import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { fetchCases } from "../api/cases";


export function useCases({
    pollingMs = 5000,
    enabled = true,
} = {}) {

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const loadCases = useCallback(async () => {

        if (!enabled) {
            return;
        }


        setLoading(true);


        try {

            const data = await fetchCases();

            setCases(data);
            setError(null);

        } catch (error) {

            console.error(
                "Failed to load cases:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }, [enabled]);


    const prependCase = useCallback((newCase) => {

        setCases((currentCases) => {

            const alreadyExists =
                currentCases.some(
                    (caseItem) =>
                        caseItem.case_number ===
                        newCase.case_number
                );


            if (alreadyExists) {
                return currentCases;
            }


            return [
                newCase,
                ...currentCases,
            ];

        });

    }, []);


    useEffect(() => {

        if (!enabled) {
            setCases([]);
            setLoading(false);
            setError(null);

            return;
        }


        loadCases();


        const interval = setInterval(
            () => {
                loadCases();
            },
            pollingMs
        );


        return () => {
            clearInterval(interval);
        };

    }, [
        enabled,
        loadCases,
        pollingMs,
    ]);


    return {
        cases,
        loading,
        error,
        refreshCases: loadCases,
        prependCase,
    };
}