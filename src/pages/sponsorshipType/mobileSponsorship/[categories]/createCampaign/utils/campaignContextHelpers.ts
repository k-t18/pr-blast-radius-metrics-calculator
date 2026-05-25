import type { Dispatch, SetStateAction } from 'react';
import type { CategoryData, GlobalState } from '../../../../../../interfaces/mobileSponsorship/createCampaignContextTypes';

/**
 * Default number of steps for a category
 * Used when creating default category data
 */
export const DEFAULT_TOTAL_STEPS = 5;

/**
 * Creates a default empty CategoryData object with all fields initialized
 * @param totalSteps - Total number of steps for this category (default: 5)
 */
export const createDefaultCategoryData = (totalSteps: number = DEFAULT_TOTAL_STEPS): CategoryData => ({
    selectedFilters: new Set(),
    fieldValues: {},
    selectedSquares: [],
    completedSubSteps: new Set(),
    isCompleted: false,
    totalSteps,
    campaignName: '',
    objective: '',
    budget: 0,
    startDate: '',
    duration: undefined,
    weeklyLeaderboardData: {
        weeks: [],
        durationDays: undefined,
    },
    derivedMetrics: {
        targetImpressions: 0,
        targetClicks: 0,
    },
});

/**
 * Helper function to update a specific category's state in globalState
 * Handles creating default data if category doesn't exist
 * @param setGlobalState - State setter function
 * @param categoryId - ID of the category to update
 * @param updater - Function that receives previous data and returns new data
 * @param defaultSteps - Optional default totalSteps to use when creating new category data (defaults to DEFAULT_TOTAL_STEPS)
 */
export const updateCategoryState = (
    setGlobalState: Dispatch<SetStateAction<GlobalState>>,
    categoryId: string,
    updater: (data: CategoryData) => CategoryData,
    defaultSteps: number = DEFAULT_TOTAL_STEPS
) => {
    setGlobalState(previous => {
        const previousData = previous[categoryId] || createDefaultCategoryData(defaultSteps);
        return {
            ...previous,
            [categoryId]: updater(previousData),
        };
    });
};

/**
 * Marks a specific sub-step as completed for a category
 * @param setGlobalState - State setter function
 * @param categoryId - ID of the category to update
 * @param subStepNumber - Number of the sub-step to mark as completed
 */
export const markSubStepCompleted = (setGlobalState: Dispatch<SetStateAction<GlobalState>>, categoryId: string, subStepNumber: number) => {
    updateCategoryState(setGlobalState, categoryId, previousData => {
        const newSteps = new Set(previousData.completedSubSteps);
        newSteps.add(subStepNumber);
        return { ...previousData, completedSubSteps: newSteps };
    });
};

/**
 * Unmarks a specific sub-step as completed for a category
 * Also resets the category completion status (isCompleted) to false
 * @param setGlobalState - State setter function
 * @param categoryId - ID of the category to update
 * @param subStepNumber - Number of the sub-step to unmark
 */
export const unmarkSubStepCompleted = (setGlobalState: Dispatch<SetStateAction<GlobalState>>, categoryId: string, subStepNumber: number) => {
    setGlobalState(previous => {
        const previousData = previous[categoryId];
        if (!previousData) return previous;
        const newSteps = new Set(previousData.completedSubSteps);
        newSteps.delete(subStepNumber);
        return {
            ...previous,
            [categoryId]: { ...previousData, completedSubSteps: newSteps, isCompleted: false },
        };
    });
};

/**
 * Calculates the completion progress for a category as a percentage (0-100)
 * @param globalState - The global state object
 * @param categoryId - ID of the category to check
 * @returns Progress percentage (0-100), or 0 if category doesn't exist
 */
export const calculateCategoryProgress = (globalState: GlobalState, categoryId: string): number => {
    const data = globalState[categoryId];
    if (!data) return 0;
    const categoryTotalSteps = data.totalSteps || DEFAULT_TOTAL_STEPS;
    if (categoryTotalSteps === 0) return 0;

    // For standard 5-step campaigns, step 2 is optional.
    // Progress is based on the 4 required steps [1, 3, 4, 5].
    if (categoryTotalSteps === 5) {
        const requiredSteps = [1, 3, 4, 5];
        const completedRequiredCount = requiredSteps.filter(step => data.completedSubSteps.has(step)).length;
        return Math.round((completedRequiredCount / 4) * 100);
    }

    return Math.round((data.completedSubSteps.size / categoryTotalSteps) * 100);
};

/**
 * Checks if all specified categories are marked as completed
 * @param globalState - The global state object
 * @param categoryIds - Array of category IDs to check
 * @returns True if all categories are completed
 */
export const allCategoriesCompleted = (globalState: GlobalState, categoryIds: string[]): boolean => {
    return categoryIds.every(id => globalState[id]?.isCompleted);
};
