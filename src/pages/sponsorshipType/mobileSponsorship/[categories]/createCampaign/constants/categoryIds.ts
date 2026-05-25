/**
 * Category ID Constants
 *
 * Centralized constants for category IDs used throughout the mobile sponsorship campaign creation.
 * This prevents magic strings and makes refactoring easier.
 */

export const CATEGORY_IDS = {
    /** Weekly leaderboard category */
    WEEKLY_LEADERBOARD: 'weekly-leaderboard',

    /** Weekly leaderboard branding category */
    WEEKLY_LEADERBOARD_BRANDING: 'weekly-leaderboard-branding',
} as const;

/** Item code/name for weekly leaderboard items */
export const WEEKLY_LEADERBOARD_ITEM_CODE = 'Weekly Leaderboard' as const;

/**
 * Check if a category ID is a weekly leaderboard type
 * @param categoryId - The category ID to check
 * @returns true if the category is a weekly leaderboard variant
 */
export function isWeeklyLeaderboardCategory(categoryId: string): boolean {
    return (
        categoryId === CATEGORY_IDS.WEEKLY_LEADERBOARD ||
        categoryId === CATEGORY_IDS.WEEKLY_LEADERBOARD_BRANDING ||
        categoryId.includes('weekly-leaderboard')
    );
}

/** Type for category ID values */
export type CategoryIdType = (typeof CATEGORY_IDS)[keyof typeof CATEGORY_IDS];
