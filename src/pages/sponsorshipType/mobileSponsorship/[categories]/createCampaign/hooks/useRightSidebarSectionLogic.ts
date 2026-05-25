import { useEffect, useMemo } from 'react';
import { useCreateCampaignContext } from '../context/createCampaignContext';
import { useTargetAudienceFilterData } from '../../../../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import { extractTargetAudienceFilterValues } from '../utils/extractTargetAudienceFilterValues';
import { useTotalAudienceReach } from '../../../../../../hooks/mobileSponsorship/useTotalAudienceReach';
import { useBaseRateLogic } from './useBaseRateLogic';
import { buildFilterGroups } from '../utils/buildFilterGroups';
import { useApplySavedFilters } from './useApplySavedFilters';

export function useRightSidebarSectionLogic() {
    // ============================================================================
    // Context and Hooks Initialization
    // ============================================================================

    // Get filter and field values from context
    const { selectedFilters, fieldValues, objective, budget, currentCategoryId, updateCategoryData } = useCreateCampaignContext();

    // Get filter sections from API (same source as the main component)
    const { targetAudienceFilterData } = useTargetAudienceFilterData();

    // Use extracted saved filters logic hook
    const { saveFilters, setSaveFilters, clearFilters, isLoadingSavedFilters, savedFiltersError } = useApplySavedFilters();

    // ============================================================================
    // Target Audience and Item Code Calculations
    // ============================================================================

    // Extract all filter values (checkboxes, dropdowns, multiselects, radios) - comma-separated format
    // Format: "target_audience-0172,target_audience-0183,value1,value2"
    const targetAudience = useMemo(
        () => extractTargetAudienceFilterValues(selectedFilters, fieldValues, targetAudienceFilterData),
        [selectedFilters, fieldValues, targetAudienceFilterData]
    );

    // ============================================================================
    // Rate Fetching Logic
    // ============================================================================

    // Use shared hook for rate fetching
    const {
        visibilityRate,
        engagementRate,
        baseCPMRate,
        baseCPCRate,
        newCPMRateFromApi,
        newCPCRateFromApi,
        targetImpressions,
        targetClicks,
        canFetchInitialRates,
        hasTargetAudience,
        hasBudgetAndTargetAudience,
    } = useBaseRateLogic({
        targetAudience,
        budget,
        objective,
        objectivesToFetch: ['visibility', 'engagement'],
    });

    // ============================================================================
    // Get Total Audience Reach API Call
    // ============================================================================

    // API call to get customer count by target audience
    // Always call the API - on page load (without target_audience) and when filters are selected (with target_audience)
    // Include currentCategoryId in parameters to ensure query key changes when category changes, forcing a refetch
    // Note: currentCategoryId is only used for query key, not sent to API
    const customerCountParameters = {
        ...(targetAudience && { target_audience: targetAudience }),
        // Include categoryId in parameters object for query key purposes only (not sent to API)
        _categoryId: currentCategoryId,
    };

    // Always enable the API call (on page load and when filters change)
    const {
        totalAudienceReachData,
        isLoading: isLoadingAudienceReach,
        error: errorAudienceReach,
    } = useTotalAudienceReach(customerCountParameters, true);

    // Use customer count from API when available, otherwise undefined
    const audienceReach = totalAudienceReachData?.customer_count;

    // ============================================================================
    // Filter Groups and Counts
    // ============================================================================

    /**
     * Process and group selected filters by option type
     * Handles dropdown, multiselect, radio, checkbox, and nested checkbox selections
     * Returns an array of filter groups with their selected options
     */
    const filterGroups = useMemo(
        () => buildFilterGroups(selectedFilters, fieldValues, targetAudienceFilterData),
        [selectedFilters, fieldValues, targetAudienceFilterData]
    );

    /**
     * Calculate total count of selected filters across all groups
     * Used for displaying filter count and calculating rates
     */
    const selectedFiltersCount = useMemo(() => {
        return filterGroups.reduce((accumulator, group) => accumulator + group.options.length, 0);
    }, [filterGroups]);

    // ============================================================================
    // Sync Derived Metrics to Context For Review Modal
    // ============================================================================

    useEffect(() => {
        updateCategoryData(previous => ({
            ...previous,
            derivedMetrics: {
                ...previous.derivedMetrics,
                audienceReach,
                baseCPMRate,
                baseCPCRate,
                newCPMRate: newCPMRateFromApi,
                newCPCRate: newCPCRateFromApi,
                targetImpressions,
                targetClicks,
            },
        }));
    }, [audienceReach, baseCPMRate, baseCPCRate, newCPMRateFromApi, newCPCRateFromApi, targetImpressions, targetClicks, updateCategoryData]);

    // ============================================================================
    // Return Statement
    // ============================================================================

    return {
        filterGroups,
        selectedFiltersCount,
        audienceReach,
        baseCPMRate,
        newCPMRate: newCPMRateFromApi,
        saveFilters,
        setSaveFilters,
        clearFilters,
        // API rates
        visibilityRate: visibilityRate?.old_base_rate,
        engagementRate: engagementRate?.old_base_rate,
        newCPMRateFromApi,
        newCPCRateFromApi,
        baseCPCRate,
        targetImpressions,
        targetClicks,
        objective,
        budget,
        targetAudience,
        canFetchInitialRates,
        hasTargetAudience,
        hasBudgetAndTargetAudience,
        isLoadingSavedFilters,
        savedFiltersError,
        isLoadingAudienceReach,
        errorAudienceReach,
    };
}
