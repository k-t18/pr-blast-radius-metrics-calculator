import type { GlobalState } from '../context/createCampaignContext';
import type { CampaignDataItem } from '../../../../../../services/sponsor_api/postMobileGameCampaignData.api';
import { extractTargetAudienceFilterValues } from './extractTargetAudienceFilterValues';
import { isWeeklyLeaderboardCategory } from '../constants/categoryIds';
import type { FilterSection } from '../../../../../../interfaces/mobileSponsorship/filters';

/**
 * Format objective name to match API requirements (capitalize first letter)
 */
function formatObjective(objective: string): string {
    if (!objective) return 'Visibility';
    // Handle special cases
    if (objective.toLowerCase() === 'both') {
        // This shouldn't happen here as we split "both" before calling this
        return 'Visibility';
    }
    return objective.charAt(0).toUpperCase() + objective.slice(1).toLowerCase();
}

/**
 * Transform campaign data from context to API quotation format
 *
 * @param globalState - All category data from context
 * @param categoryIds - Array of category IDs from URL
 * @param categoryIdToItemCode - Map of category ID to item code/name
 * @param filterSections - Filter sections for target audience extraction
 * @returns Array of quotation items
 */
export function transformCampaignDataToCreateQuotation(
    globalState: GlobalState,
    categoryIds: string[],
    categoryIdToItemCode: Map<string, string>,
    filterSections: FilterSection[],
    selectedBlanketOrderId: string | null
): CampaignDataItem[] {
    return categoryIds.flatMap(categoryId => {
        const categoryData = globalState[categoryId];
        if (!categoryData || !categoryData.isCompleted) {
            return []; // Skip incomplete categories
        }

        const itemCode = categoryIdToItemCode.get(categoryId);
        if (!itemCode) {
            return []; // Skip if no item code found
        }

        // Handle weekly leaderboard separately
        if (isWeeklyLeaderboardCategory(categoryId)) {
            const weeklyLeaderboardDuration = categoryData.weeklyLeaderboardData.durationDays ?? 6;
            // Iterate over each saved week and selected ranking
            return categoryData.weeklyLeaderboardData.weeks
                .filter(week => week.isSaved)
                .flatMap(week =>
                    week.rankings
                        .filter(ranking => ranking.isSelected)
                        .map(
                            ranking =>
                                ({
                                    blanket_order: selectedBlanketOrderId ?? '',
                                    against_blanket_order: selectedBlanketOrderId ? 1 : 0,
                                    item_code: itemCode,
                                    item_name: itemCode,
                                    custom_rank: ranking.position,
                                    custom_start_date: week.startDate,
                                    custom_duration: weeklyLeaderboardDuration,
                                    custom_declared_reward_amount: String(ranking.rewardValue),
                                }) as CampaignDataItem
                        )
                );
        }

        // Extract target audience
        const targetAudience = extractTargetAudienceFilterValues(categoryData.selectedFilters, categoryData.fieldValues, filterSections);

        const durationDays = categoryData.duration ? String(categoryData.duration) : '';

        const customCampaignName = categoryData.campaignName || '';

        // Format start date (YYYY-MM-DD)
        const startDate = categoryData.startDate || '';

        // Handle objective - if "both", create two items (Visibility and Engagement)
        const objectives = categoryData.objective === 'both' ? ['Visibility', 'Engagement'] : [categoryData.objective || 'Visibility'];

        // Check if this category has square types (sponsor rewards with squares)
        const hasSquares = categoryData.selectedSquares && categoryData.selectedSquares.length > 0;

        if (hasSquares) {
            // For square types, create a separate item for each square row
            return categoryData.selectedSquares.flatMap(square =>
                objectives.map(objective => ({
                    item_code: itemCode,
                    item_name: itemCode,
                    custom_campaign_name: customCampaignName,
                    custom_sponsorship_objective: formatObjective(objective),
                    custom_target_audience: targetAudience,
                    budget: categoryData.budget || 0,
                    custom_start_date: startDate,
                    custom_duration: durationDays,
                    custom_row: String(square.row),
                    custom_square_type: square.squareType,
                    custom_declared_reward_amount: String(square.rewardValue || 0),
                    blanket_order: selectedBlanketOrderId ?? '',
                    against_blanket_order: selectedBlanketOrderId ? 1 : 0,
                }))
            );
        }
        // For non-square types (Ads campaigns), create one item per objective
        return objectives.map(objective => ({
            blanket_order: selectedBlanketOrderId ?? '',
            against_blanket_order: selectedBlanketOrderId ? 1 : 0,
            item_code: itemCode,
            item_name: itemCode,
            custom_campaign_name: customCampaignName,
            custom_sponsorship_objective: formatObjective(objective),
            custom_target_audience: targetAudience,
            budget: categoryData.budget || 0,
            custom_start_date: startDate,
            custom_duration: durationDays,
        }));
    });
}
