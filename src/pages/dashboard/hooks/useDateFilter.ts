import { useState } from 'react';
import type { DropdownOption } from '../../../components/common/Dropdown';

export type DateFilterOption = 'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_6_months' | 'last_year' | 'all_time';

export const DATE_FILTER_OPTIONS: DropdownOption[] = [
    { label: 'Last 7 days', value: 'last_7_days' },
    { label: 'Last 30 days', value: 'last_30_days' },
    { label: 'Last 90 days', value: 'last_90_days' },
    { label: 'Last 6 months', value: 'last_6_months' },
    { label: 'Last year', value: 'last_year' },
    { label: 'All time', value: 'all_time' },
];

/**
 * Custom hook for managing date filter state in dashboard.
 *
 * @returns An object containing the selected date filter and handler function.
 */
export function useDateFilter() {
    const [selectedFilter, setSelectedFilter] = useState<DropdownOption>(DATE_FILTER_OPTIONS[1]); // Default to "Last 30 days"

    const handleFilterChange = (value: DropdownOption | undefined) => {
        if (value) {
            setSelectedFilter(value);
        }
    };

    /**
     * Calculates the start date based on the selected filter.
     * @returns The start date as a Date object, or undefined for "all_time"
     */
    const getStartDate = (): Date | undefined => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (selectedFilter.value as DateFilterOption) {
            case 'last_7_days': {
                const last7Days = new Date(today);
                last7Days.setDate(today.getDate() - 7);
                return last7Days;
            }
            case 'last_30_days': {
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);
                return last30Days;
            }
            case 'last_90_days': {
                const last90Days = new Date(today);
                last90Days.setDate(today.getDate() - 90);
                return last90Days;
            }
            case 'last_6_months': {
                const last6Months = new Date(today);
                last6Months.setMonth(today.getMonth() - 6);
                return last6Months;
            }
            case 'last_year': {
                const lastYear = new Date(today);
                lastYear.setFullYear(today.getFullYear() - 1);
                return lastYear;
            }
            case 'all_time': {
                return undefined;
            }
            default: {
                return undefined;
            }
        }
    };

    /**
     * Filters data points based on the selected date range.
     * Assumes date format is 'MM/DD' or 'MM/DD/YY' or similar.
     */
    const filterDataByDate = <T extends { date: string }>(data: T[]): T[] => {
        const startDate = getStartDate();
        if (!startDate) {
            return data; // Return all data for "all_time"
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        return data.filter(item => {
            // Parse date string (format: 'MM/DD' or 'MM/DD/YY')
            const dateParts = item.date.split('/');
            if (dateParts.length < 2) return false;

            const month = Number.parseInt(dateParts[0], 10) - 1; // Month is 0-indexed
            const day = Number.parseInt(dateParts[1], 10);
            let year = today.getFullYear();

            // If year is provided in the date string
            if (dateParts.length === 3) {
                const yearPart = Number.parseInt(dateParts[2], 10);
                // Handle 2-digit years
                year = yearPart < 100 ? 2000 + yearPart : yearPart;
            }

            const itemDate = new Date(year, month, day);
            return itemDate >= startDate && itemDate <= today;
        });
    };

    return {
        selectedFilter,
        handleFilterChange,
        getStartDate,
        filterDataByDate,
    };
}
