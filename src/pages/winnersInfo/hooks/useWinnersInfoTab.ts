import { useMemo, useState } from 'react';
import { useWinnerTable } from '../../../hooks/winners/useWinners';
import { TABS, type MobileGameReward, type StudioShowWinner, type WinnersTabValue } from '../dataset/winnersInfoTableColumns';
import { useWinnersFilterOptions, type WinnersFilterKey } from './useWinnersFilterOptions';
import { useTableFilterLogic } from '../../../hooks/useTableFilterLogic';

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

/**
 * Custom hook for managing winners info table state and handlers.
 *
 * @returns An object containing state values and handler functions for the winners info table.
 */
export function useWinnersInfoTab() {
    const [activeTab, setActiveTab] = useState<WinnersTabValue>('mobile-game');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

    // Shared filter state + handlers (apply/clear/value-change) with a callback to reset pagination on filter changes.
    const {
        filterParameters,
        setFilterParameters,
        selectedFields,
        setSelectedFields,
        handleApplyFilters,
        handleClearFilters,
        handleValueTextChange,
    } = useTableFilterLogic<WinnersFilterKey>({
        onFilterChange: () => setPage(0),
    });

    // Switch between Mobile Game and Studio Show tabs and reset pagination + filters.
    const handleTabChange = (index: number) => {
        setActiveTab(TABS[index].value as WinnersTabValue);
        setPage(0); // Reset page on tab switch
        // Reset filters on tab switch
        setFilterParameters({});
        setSelectedFields(new Set());
    };

    // Handles PrimeReact pagination events (supports rows-per-page changes and resets to page 0 when rows change).
    const handlePageChange = (nextPage: number, nextRows?: number) => {
        if (typeof nextRows === 'number' && nextRows !== rowsPerPage) {
            setRowsPerPage(nextRows);
            setPage(0);
            return;
        }
        setPage(nextPage);
    };

    // Only fetch filter options when the respective field is selected
    const isStudioShow = activeTab === 'studio-show';
    const { filterOptions: episodeOptions } = useWinnersFilterOptions('episode', isStudioShow && selectedFields.has('episode'));
    const { filterOptions: rewardTypeOptions } = useWinnersFilterOptions('reward_type', selectedFields.has('reward_type'));
    const { filterOptions: statusOptions } = useWinnersFilterOptions('status', isStudioShow && selectedFields.has('status'));

    // Map filter keys to suggestion lists consumed by CustomTableFilter (supports `{name}` API shape).
    const valueOptions = useMemo(() => {
        return {
            episode: episodeOptions,
            reward_type: rewardTypeOptions,
            status: statusOptions,
        };
    }, [episodeOptions, rewardTypeOptions, statusOptions]);

    // Fetch the winner table for the active tab with server-side pagination + currently applied filters.
    const {
        data: winners,
        count: totalCount,
        isLoading,
        error,
        refetch,
    } = useWinnerTable<MobileGameReward | StudioShowWinner>(activeTab, {
        limit: rowsPerPage,
        offset: page,
        ...filterParameters,
    });

    const totalRecords = totalCount ?? winners.length;

    return {
        activeTab,
        handleTabChange,
        rowsPerPage,
        page,
        handlePageChange,
        ROWS_PER_PAGE_OPTIONS,
        winners,
        isLoading,
        error,
        totalRecords,
        refetch,
        valueOptions,
        handleApplyFilters,
        handleClearFilters,
        handleValueTextChange,
    };
}
