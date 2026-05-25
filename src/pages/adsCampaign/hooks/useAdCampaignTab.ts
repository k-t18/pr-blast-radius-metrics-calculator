import { useMemo, useState } from 'react';
import { TABS } from '../dataset/adsCampaignTableColumns';
import { useCampaigns } from '../../../hooks/adsCampaign/useAdsCampaignMetrics';
import { useCampaignFilterOptions } from '../../../hooks/adsCampaign/useCampaignFilterOptions';
import type { CampaignFilterKey } from '../../../services/adsCampaign/getCampaignFilters.api';
import { useTableFilterLogic } from '../../../hooks/useTableFilterLogic';
// import { submittedData } from '../dataset/adsCampaignTableColumns'; // Remove if not needed or pass from component

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

/**
 * Custom hook for managing ads campaign tab state, pagination, and data fetching.
 */
export function useAdCampaignTab() {
    const [activeTab, setActiveTab] = useState<string>('live');
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
    } = useTableFilterLogic<CampaignFilterKey>({
        onFilterChange: () => setPage(0),
    });

    // Switch between Live and Submitted tabs and reset pagination + filters.
    const handleTabChange = (index: number) => {
        setActiveTab(TABS[index].value);
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

    // Determine Status for API
    const campaignStatus = activeTab === 'submitted' ? 'Submitted' : 'Live';

    // Only fetch filter options when the respective field is selected
    const { filterOptions: creativesIdOptions } = useCampaignFilterOptions('creatives_id', selectedFields.has('creatives_id'));
    const { filterOptions: orderIdOptions } = useCampaignFilterOptions('order_id', selectedFields.has('order_id'));
    const { filterOptions: campaignNameOptions } = useCampaignFilterOptions('campaign_name', selectedFields.has('campaign_name'));

    // Map filter keys to suggestion lists consumed by CustomTableFilter (supports `{name}` API shape).
    const valueOptions = useMemo(() => {
        return {
            creatives_id: creativesIdOptions,
            order_id: orderIdOptions,
            campaign_name: campaignNameOptions,
        };
    }, [campaignNameOptions, creativesIdOptions, orderIdOptions]);

    // Fetch campaigns for the active tab with server-side pagination + currently applied filters.
    const {
        data: campaigns,
        count: totalCount,
        isLoading,
        error,
    } = useCampaigns(campaignStatus, {
        limit: rowsPerPage,
        offset: page,
        ...filterParameters,
    });

    const totalRecords = totalCount ?? campaigns.length;

    return {
        activeTab,
        handleTabChange,
        rowsPerPage,
        page,
        handlePageChange,
        ROWS_PER_PAGE_OPTIONS,
        campaigns,
        isLoading,
        error,
        totalRecords,
        valueOptions,
        handleApplyFilters,
        handleClearFilters,
        handleValueTextChange,
    };
}
