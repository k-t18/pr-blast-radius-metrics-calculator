import { useState, useEffect } from 'react';
import { usePeriodFilterData } from './usePeriodFilterData';

export function usePeriodSelectionLogic() {
    const { periodFilterData: periodData } = usePeriodFilterData();

    const [selectedDateFormat, setSelectedDateFormat] = useState<number | undefined>(() => periodData?.[0]?.numeric_days);

    useEffect(() => {
        if (selectedDateFormat === undefined && periodData.length > 0) {
            setSelectedDateFormat(periodData[0].numeric_days);
        }
    }, [periodData, selectedDateFormat]);

    const isPeriodReady = typeof selectedDateFormat === 'number';

    return {
        selectedDateFormat,
        handlePeriodChange: setSelectedDateFormat,
        periodData,
        isPeriodReady,
    };
}
