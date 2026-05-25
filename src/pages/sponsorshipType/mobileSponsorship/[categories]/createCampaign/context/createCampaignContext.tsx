import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type {
    SelectedFilters,
    FieldValuesState,
    SquareDataByTypeAndRow,
    CategoryData,
    GlobalState,
    CreateCampaignContextValue,
} from '../../../../../../interfaces/mobileSponsorship/createCampaignContextTypes';
import {
    createDefaultCategoryData,
    DEFAULT_TOTAL_STEPS,
    updateCategoryState,
    markSubStepCompleted,
    unmarkSubStepCompleted,
    calculateCategoryProgress,
    allCategoriesCompleted,
} from '../utils/campaignContextHelpers';

export type {
    FieldValue,
    FieldValuesState,
    SquareData,
    SquareTypeRowData,
    SquareDataByTypeAndRow,
    LeaderboardRanking,
    LeaderboardWeek,
    WeeklyLeaderboardData,
    DerivedMetrics,
    CategoryData,
    GlobalState,
} from '../../../../../../interfaces/mobileSponsorship/createCampaignContextTypes';

const CreateCampaignContext = createContext<CreateCampaignContextValue | undefined>(undefined);

export function CreateCampaignProvider({
    children,
    currentCategoryId: initialCategoryId = '',
    onStepChange,
}: {
    children: ReactNode;
    currentCategoryId?: string;
    onStepChange?: (stepId: string) => void;
}) {
    const [globalState, setGlobalState] = useState<GlobalState>({});

    const [squareDataByTypeAndRow, setSquareDataByTypeAndRow] = useState<SquareDataByTypeAndRow>({});

    /**
     * Set of enabled category IDs - tracks which categories are unlocked
     * First category is enabled by default if initialCategoryId is provided
     */
    const [enabledCategories, setEnabledCategories] = useState<Set<string>>(() => {
        const initialSet = new Set<string>();
        if (initialCategoryId) {
            initialSet.add(initialCategoryId);
        }
        return initialSet;
    });

    /** Current category ID (derived from prop) */
    const currentCategoryId = initialCategoryId;

    /**
     * Safely retrieves the current category's data
     * Returns default data if category doesn't exist yet
     * @returns CategoryData for the current category
     */
    const getCurrentData = useCallback(() => {
        return globalState[currentCategoryId] || createDefaultCategoryData(DEFAULT_TOTAL_STEPS);
    }, [globalState, currentCategoryId]);

    /**
     * Generic updater function for category data
     * Handles creating default data if category doesn't exist
     * @param updater - Function that receives previous data and returns new data
     */
    const updateCategoryData = useCallback(
        (updater: (previous: CategoryData) => CategoryData) => {
            updateCategoryState(setGlobalState, currentCategoryId, updater);
        },
        [currentCategoryId]
    );

    // Single state object containing all current category data
    // Automatically updates when the current category changes or its data changes
    const currentCategoryState = useMemo(() => getCurrentData(), [getCurrentData]);

    /**
     * Updates the selected filters(checkboxes) for the current category
     * Supports both direct value assignment and functional updates
     */
    const setSelectedFilters = useCallback(
        (value: SelectedFilters | ((previous: SelectedFilters) => SelectedFilters)) => {
            updateCategoryData(previous => ({
                ...previous,
                selectedFilters: typeof value === 'function' ? value(previous.selectedFilters) : value,
            }));
        },
        [updateCategoryData]
    );

    /**
     * Updates the field values (form fields select / multi select) for the current category
     * Supports both direct value assignment and functional updates
     */
    const setFieldValues = useCallback(
        (value: FieldValuesState | ((previous: FieldValuesState) => FieldValuesState)) => {
            updateCategoryData(previous => ({
                ...previous,
                fieldValues: typeof value === 'function' ? value(previous.fieldValues) : value,
            }));
        },
        [updateCategoryData]
    );

    /**
     * Determines if the current category has all required sub-steps filled
     * Used to enable/disable the "Save Campaign" button
     */
    /**
     * Determines if the current category has all required sub-steps filled
     * Used to enable/disable the "Save Campaign" button
     */
    const isCategoryFullyFilled = useMemo(() => {
        const { completedSubSteps, totalSteps } = currentCategoryState;

        // Step 2 is optional for campaigns with 5 steps (Ads or Sponsor Rewards).
        // We only strictly require steps [1, 3, 4, 5] to be completed.
        if (totalSteps === 5) {
            const requiredSteps = [1, 3, 4, 5];
            return requiredSteps.every(step => completedSubSteps.has(step));
        }

        return completedSubSteps.size === totalSteps && totalSteps > 0;
    }, [currentCategoryState]);

    /**
     * Marks a specific sub-step as completed for a category
     */
    const markSubStepAsCompleted = useCallback((categoryId: string, subStepNumber: number) => {
        markSubStepCompleted(setGlobalState, categoryId, subStepNumber);
    }, []);

    /**
     * Unmarks a specific sub-step as completed for a category
     * Also resets the category completion status (isCompleted) to false
     */
    const unmarkSubStepAsCompleted = useCallback((categoryId: string, subStepNumber: number) => {
        unmarkSubStepCompleted(setGlobalState, categoryId, subStepNumber);
    }, []);

    /**
     * Calculates the completion progress for a category as a percentage (0-100)
     */
    const getCategoryProgress = useCallback(
        (categoryId: string): number => {
            return calculateCategoryProgress(globalState, categoryId);
        },
        [globalState]
    );

    /**
     * Sets the total number of steps for a category
     */
    const setTotalSteps = useCallback((categoryId: string, steps: number) => {
        updateCategoryState(setGlobalState, categoryId, previousData => ({ ...previousData, totalSteps: steps }), steps);
    }, []);

    /**
     * Marks the current category as completed
     */
    const saveCategory = useCallback(() => {
        updateCategoryData(previous => ({ ...previous, isCompleted: true }));
    }, [updateCategoryData]);

    /**
     * Checks if all specified categories are marked as completed
     */
    const checkAllCategoriesCompleted = useCallback(
        (categoryIds: string[]) => {
            return allCategoriesCompleted(globalState, categoryIds);
        },
        [globalState]
    );

    /**
     * Returns all category data from global state
     */
    const getAllCategoryData = useCallback(() => {
        return globalState;
    }, [globalState]);

    /**
     * Unlocks a category, allowing it to be accessed and navigated to
     * Also ensures the current category remains enabled
     */
    const enableCategory = useCallback(
        (categoryId: string) => {
            setEnabledCategories(previous => {
                const next = new Set(previous);
                next.add(categoryId);
                // Always ensure current category is enabled
                if (currentCategoryId) {
                    next.add(currentCategoryId);
                }
                return next;
            });
        },
        [currentCategoryId]
    );

    /**
     * Checks if a category is enabled (unlocked)
     * The current category is always considered enabled, even if not in the enabledCategories set
     */
    const isCategoryEnabled = useCallback(
        (categoryId: string) => {
            return categoryId === currentCategoryId || enabledCategories.has(categoryId);
        },
        [enabledCategories, currentCategoryId]
    );

    const value = useMemo(
        () => ({
            // Current category state (contains all the destructured values)
            ...currentCategoryState,
            // Shared state
            squareDataByTypeAndRow,
            // State setters
            setSelectedFilters,
            setFieldValues,
            setSquareDataByTypeAndRow,
            updateCategoryData,
            // Computed values
            isCategoryFullyFilled,
            isCategoryCompleted: currentCategoryState.isCompleted,
            // Category management
            currentCategoryId,
            markSubStepAsCompleted,
            unmarkSubStepAsCompleted,
            getCategoryProgress,
            setTotalSteps,
            saveCategory,
            checkAllCategoriesCompleted,
            getAllCategoryData,
            // Category unlocking
            enabledCategories,
            enableCategory,
            isCategoryEnabled,
            // Step navigation
            onStepChange,
        }),
        [
            currentCategoryState,
            squareDataByTypeAndRow,
            setSelectedFilters,
            setFieldValues,
            setSquareDataByTypeAndRow,
            updateCategoryData,
            isCategoryFullyFilled,
            currentCategoryId,
            markSubStepAsCompleted,
            unmarkSubStepAsCompleted,
            getCategoryProgress,
            setTotalSteps,
            saveCategory,
            checkAllCategoriesCompleted,
            getAllCategoryData,
            enabledCategories,
            enableCategory,
            isCategoryEnabled,
            onStepChange,
        ]
    );

    return <CreateCampaignContext.Provider value={value}>{children}</CreateCampaignContext.Provider>;
}

export function useCreateCampaignContext() {
    const context = useContext(CreateCampaignContext);
    if (!context) {
        throw new Error('useCreateCampaign must be used within CreateCampaignProvider');
    }
    return context;
}
