import { useState } from 'react';

const useValidationHandler = () => {
    // Validation map -> { itemId: boolean }
    const [validationMap, setValidationMap] = useState<Record<string, boolean>>({});

    /** ======================================================
     *  HANDLE VALIDATION UPDATE FROM CHILD
     *  ====================================================== */
    const handleValidation = (itemId: string, isValid: boolean) => {
        setValidationMap(previous => ({ ...previous, [itemId]: isValid }));
    };

    return { validationMap, handleValidation };
};

export default useValidationHandler;
