import { useState } from 'react';
import { TABS, type SponsorshipType } from '../dataset/dashboardDataSets';

/**
 * Custom hook for managing quotes table state and handlers.
 *
 * @returns An object containing state values and handler functions for the quotes table.
 */
export function useDashboardTab() {
    const [activeTab, setActiveTab] = useState<SponsorshipType>('mobile_game');

    const handleTabChange = (index: number) => {
        setActiveTab(TABS[index].value);
    };

    return {
        activeTab,
        handleTabChange,
    };
}
