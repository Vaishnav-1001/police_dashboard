import { useCallback, useEffect, useState } from "react";
import { fetchCases } from "../api/cases";

export function useCases({ pollingMs = 5000 } = {}) {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCases = useCallback(async () => {
        try {
            const data = await fetchCases();

            setCases(data);
            setError(null);
        } catch (error) {
            console.error("Failed to load cases:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const prependCase = useCallback((newCase) => {
        setCases((currentCases) => {
            // Prevent duplicates.
            const alreadyExists = currentCases.some(
                (caseItem) =>
                    caseItem.case_number === newCase.case_number
            );

            if (alreadyExists) {
                return currentCases;
            }

            return [newCase, ...currentCases];
        });
    }, []);

    useEffect(() => {
        loadCases();

        const interval = setInterval(() => {
            loadCases();
        }, pollingMs);

        return () => {
            clearInterval(interval);
        };
    }, [loadCases, pollingMs]);

    return {
        cases,
        loading,
        error,
        refreshCases: loadCases,
        prependCase,
    };
}