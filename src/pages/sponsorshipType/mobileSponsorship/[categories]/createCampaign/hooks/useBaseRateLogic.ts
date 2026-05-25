import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBaseRateData } from '../../../../../../hooks/mobileSponsorship/useBaseRateData';
import type {
    UseBaseRateLogicParameters,
    UseBaseRateLogicReturn,
    ObjectiveType,
    RateParameters,
} from '../../../../../../interfaces/mobileSponsorship/createCampaignHooks.types';

/**
 * Shared hook for fetching campaign rates (Visibility and Engagement)
 * Consolidates rate fetching logic used across multiple components
 *
 * @param parameters - Parameters for fetching rates
 * @returns Object containing all rate data and helper flags
 */
export function useBaseRateLogic({ targetAudience, budget, objective, objectivesToFetch }: UseBaseRateLogicParameters): UseBaseRateLogicReturn {
    const [searchParameters] = useSearchParams();

    // Extract itemCode directly from URL
    const itemCode = useMemo(() => {
        const itemCodeFromUrl = searchParameters.get('item_code');
        if (itemCodeFromUrl) {
            // Decode URL-encoded item_code (replace + with spaces and decode URI component)
            return decodeURIComponent(itemCodeFromUrl.replaceAll('+', ' '));
        }
    }, [searchParameters]);

    // Check if we have minimum required parameters (item_code and objectives)
    const canFetchInitialRates = Boolean(itemCode && objectivesToFetch.length > 0);

    // Check if target audience is selected
    const hasTargetAudience = Boolean(targetAudience);

    // Check if budget is provided
    const hasBudget = Boolean(budget > 0);

    // Check if we have budget and target_audience for updated rates with impressions/clicks
    const hasBudgetAndTargetAudience = Boolean(budget > 0 && hasTargetAudience);

    /**
     * Helper function to create rate parameters for a given objective
     */
    const createRateParameters = useMemo(() => {
        return (objectiveKey: 'visibility' | 'engagement', sponsorshipObjective: ObjectiveType): RateParameters => {
            const isIncluded = objectivesToFetch.includes(objectiveKey);
            const shouldFetchUpdated = isIncluded && (objective === objectiveKey || objective === 'both');

            // Initial parameters (without budget and target_audience) - for base rate
            const initialParameters =
                canFetchInitialRates && isIncluded ? { item_code: itemCode!, sponsorship_objective: sponsorshipObjective } : undefined;

            // Updated parameters (with target_audience and/or budget) - for updated rate
            let updatedParameters:
                | {
                      item_code: string;
                      sponsorship_objective: ObjectiveType;
                      target_audience?: string;
                      budget?: number;
                  }
                | undefined;

            if (shouldFetchUpdated && itemCode && (hasTargetAudience || hasBudget)) {
                updatedParameters = {
                    item_code: itemCode,
                    sponsorship_objective: sponsorshipObjective,
                };

                if (hasTargetAudience) {
                    updatedParameters.target_audience = targetAudience!;
                }

                if (hasBudget) {
                    updatedParameters.budget = budget;
                }
            }

            return {
                initial: initialParameters,
                updated: updatedParameters,
                shouldFetchInitial: canFetchInitialRates && isIncluded,
            };
        };
    }, [itemCode, objectivesToFetch, canFetchInitialRates, objective, hasTargetAudience, hasBudget, budget, targetAudience]);

    // Create parameters for both objectives
    const visibilityRateParameters = useMemo(() => createRateParameters('visibility', 'Visibility'), [createRateParameters]);

    const engagementRateParameters = useMemo(() => createRateParameters('engagement', 'Engagement'), [createRateParameters]);

    // Fetch rates for both objectives using the same pattern
    const { baseRateData: visibilityInitialRate } = useBaseRateData(visibilityRateParameters.initial, visibilityRateParameters.shouldFetchInitial);

    const { baseRateData: visibilityUpdatedRate } = useBaseRateData(visibilityRateParameters.updated, Boolean(visibilityRateParameters.updated));

    const { baseRateData: engagementInitialRate } = useBaseRateData(engagementRateParameters.initial, engagementRateParameters.shouldFetchInitial);

    const { baseRateData: engagementUpdatedRate } = useBaseRateData(engagementRateParameters.updated, Boolean(engagementRateParameters.updated));

    // Use updated rate if available, otherwise use initial rate
    const visibilityRate = visibilityUpdatedRate || visibilityInitialRate;
    const engagementRate = engagementUpdatedRate || engagementInitialRate;

    // Base rates from API only (no hardcoded fallbacks) - use old_base_rate
    const baseCPMRate = visibilityInitialRate?.old_base_rate;
    const baseCPCRate = engagementInitialRate?.old_base_rate;

    // New rates - check updated rate first, then fall back to initial rate
    // The API may return new_base_rate in any of these responses
    const newCPMRateFromApi = visibilityUpdatedRate?.new_base_rate || visibilityInitialRate?.new_base_rate;
    const newCPCRateFromApi = engagementUpdatedRate?.new_base_rate || engagementInitialRate?.new_base_rate;

    // Get target impressions and clicks from API response (when budget is provided)
    // The consolidated visibilityUpdatedRate includes budget, so it will have target_impressions
    const targetImpressions = visibilityUpdatedRate?.target_impressions || 0;
    const targetClicks = engagementUpdatedRate?.target_clicks || 0;

    return {
        // Consolidated rates (automatically selects best available)
        visibilityRate,
        engagementRate,

        // Base rates
        baseCPMRate,
        baseCPCRate,

        // New rates from API
        newCPMRateFromApi,
        newCPCRateFromApi,

        // Target metrics
        targetImpressions,
        targetClicks,

        // Helper flags
        canFetchInitialRates,
        hasTargetAudience,
        hasBudget,
        hasBudgetAndTargetAudience,
    };
}

export default useBaseRateLogic;
