import { useState, useCallback } from 'react';

const useProgressHandler = () => {
    // Progress map -> { itemId: number }
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});

    /** ======================================================
     *  HANDLE PROGRESS UPDATE FROM CHILD
     *  ====================================================== */
    const handleProgress = useCallback((itemId: string, value: number) => {
        setProgressMap(previous => {
            if (previous[itemId] === value) return previous;
            return { ...previous, [itemId]: value };
        });
    }, []);

    return { progressMap, handleProgress };
};

export default useProgressHandler;
