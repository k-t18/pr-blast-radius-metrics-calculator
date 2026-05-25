import { useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCreateCampaignContext } from '../context/createCampaignContext';
import { useCategoriesData } from '../../../../../../stores/mobileSponsorshipCategoriesStore';

export interface LeftSidebarCategory {
    id: string;
    label: string;
    progress: number;
    itemCode: string;
}

/**
 * Custom hook for managing campaign category navigation and data
 * Handles category ID extraction from URL, navigation between categories,
 * fetching sponsorship items, and getting item codes
 *
 * @param currentStep - The current active step/category ID
 * @param onStepChange - Callback function when step changes
 * @returns Object containing category navigation data, item code, and navigation handlers
 */
export function useCampaignLeftSidebarCategoryLogic(currentStep: string, onStepChange: (step: string) => void) {
    // ============================================================================
    // Hook Dependencies & Context Setup
    // ============================================================================
    // Extract required functions and state from the campaign context
    // These provide access to category progress, enablement status, and navigation
    const { getCategoryProgress, isCategoryEnabled, enableCategory, currentCategoryId } = useCreateCampaignContext();

    // Access and update URL search parameters for category and item_code tracking
    const [searchParameters, setSearchParameters] = useSearchParams();

    // Get categories data from Zustand store (shared state across the application)
    const categoriesData = useCategoriesData();

    // ============================================================================
    // URL Parameter Extraction
    // ============================================================================
    // Extract category IDs from URL query parameters
    // Supports both 'categories' and 'category' query params for backward compatibility
    // Returns an array of trimmed category IDs from the URL
    const categoryIdsFromUrl = useMemo(() => {
        return (searchParameters.get('categories')?.split(',') || searchParameters.get('category')?.split(',') || []).map(id => id.trim());
    }, [searchParameters]);

    // ============================================================================
    // Category Mapping & Filtering
    // ============================================================================
    // Transform URL category IDs into sidebar category objects
    // Only includes categories that:
    // 1. Exist in the URL parameters
    // 2. Have matching data in the categories store
    // 3. Have valid string IDs and titles
    // Maps each valid category to a LeftSidebarCategory object with id, label, progress, and itemCode
    const leftSidebarCategories: LeftSidebarCategory[] = useMemo(() => {
        // If no categories in URL, return empty array (no steps to display)
        if (categoryIdsFromUrl.length === 0) {
            return [];
        }

        // Only include steps for categories whose IDs match the URL and exist in the data
        return categoryIdsFromUrl
            .map(categoryId => {
                const trimmedId = categoryId.trim();
                return categoriesData.find(item => item.id === trimmedId);
            })
            .filter((category): category is NonNullable<typeof category> => category !== undefined)
            .filter(
                (category): category is typeof category & { id: string; title: string } =>
                    typeof category.id === 'string' && typeof category.title === 'string'
            )
            .map(category => ({
                id: category.id,
                label: category.title,
                progress: 0,
                itemCode: category.title, // Store title as item_code
            }));
    }, [categoryIdsFromUrl, categoriesData]);

    // ============================================================================
    // Current Step Resolution
    // ============================================================================
    // Determines the effective current step to display
    // If the provided currentStep doesn't match any category in the sidebar,
    // defaults to the first category to prevent invalid states
    const effectiveCurrentStep = useMemo(() => {
        if (leftSidebarCategories.length > 0 && !leftSidebarCategories.some(category => category.id === currentStep)) {
            return leftSidebarCategories[0].id;
        }
        return currentStep;
    }, [leftSidebarCategories, currentStep]);

    // ============================================================================
    // Auto-Enable First Category
    // ============================================================================
    // Automatically enables the first category when categories are loaded
    // This ensures users can always interact with at least the first step
    // Only enables if not already enabled to avoid unnecessary state updates
    const firstCategoryId = leftSidebarCategories.length > 0 ? leftSidebarCategories[0].id : undefined;
    if (firstCategoryId && !isCategoryEnabled(firstCategoryId)) {
        enableCategory(firstCategoryId);
    }

    // ============================================================================
    // URL Synchronization Effect
    // ============================================================================
    // Keeps the URL's item_code parameter in sync with the active step
    // When the effective current step changes, updates the item_code in the URL
    // This ensures the URL always reflects the currently active category's item code
    // Only updates if the item_code is different or missing to avoid unnecessary URL changes
    useEffect(() => {
        if (leftSidebarCategories.length > 0 && effectiveCurrentStep) {
            const activeStep = leftSidebarCategories.find(category => category.id === effectiveCurrentStep);
            if (activeStep) {
                const currentItemCode = searchParameters.get('item_code');
                // Only update if item_code is different or missing
                if (currentItemCode !== activeStep.itemCode) {
                    const currentParameters = Object.fromEntries(searchParameters.entries());
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { item_code: removedItemCode, ...restParameters } = currentParameters;
                    setSearchParameters({
                        ...restParameters,
                        item_code: activeStep.itemCode,
                    });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveCurrentStep, leftSidebarCategories]);

    // ============================================================================
    // Progress Calculation Function
    // ============================================================================
    // Calculates and returns the completion progress for a given step/category
    // Progress is based on completed sub-steps within the category
    // Each category typically has 5 steps, where each step represents 20% progress
    const getStepProgress = useCallback(
        (stepId: string): number => {
            // Get progress from context based on completed sub-steps
            // Each of the 5 steps represents 20% (100% / 5 = 20%)
            return getCategoryProgress(stepId);
        },
        [getCategoryProgress]
    );

    // ============================================================================
    // Category Click Handler
    // ============================================================================
    // Handles clicks on sidebar category buttons
    // Updates the URL to set only the clicked category's item_code
    // Removes any existing item_code before setting the new one
    // Triggers the onStepChange callback to update the active step
    const handleCategoryClick = useCallback(
        (stepId: string, itemCode: string) => {
            // Update URL with only the active category's item_code when sidebar button is clicked
            const currentParameters = Object.fromEntries(searchParameters.entries());
            // Remove existing item_code and set only the active one
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { item_code: removedItemCode, ...restParameters } = currentParameters;
            setSearchParameters({
                ...restParameters,
                item_code: itemCode, // Only the active category's item_code
            });
            onStepChange(stepId);
        },
        [searchParameters, setSearchParameters, onStepChange]
    );

    // ============================================================================
    // Navigation Indices Calculation
    // ============================================================================
    // Calculates the current position and adjacent category IDs for navigation
    // Used by navigation buttons (Previous/Next) to determine which categories
    // can be navigated to from the current position
    const currentIndex = useMemo(() => categoryIdsFromUrl.indexOf(currentCategoryId), [categoryIdsFromUrl, currentCategoryId]);
    const previousId = useMemo(() => categoryIdsFromUrl[currentIndex - 1], [categoryIdsFromUrl, currentIndex]);
    const nextId = useMemo(() => categoryIdsFromUrl[currentIndex + 1], [categoryIdsFromUrl, currentIndex]);

    // ============================================================================
    // Category Data Transformation
    // ============================================================================
    // Transforms raw category data from Zustand store into a simplified format
    // Filters out categories without valid IDs or titles
    // Returns an array of objects with only id and title properties
    // This format is used by other parts of the application that need category metadata
    const allCategoriesData = useMemo(() => {
        return categoriesData
            .filter(item => item.id && item.title)
            .map(item => ({
                id: item.id!,
                title: item.title!,
            }));
    }, [categoriesData]);

    // ============================================================================
    // Item Code Retrieval
    // ============================================================================
    // Gets the item code (title) for the currently active category
    // Used by components that need to display or work with the current category's item code
    // Returns undefined if the current category is not found in the data
    const itemCode = useMemo(() => {
        const found = allCategoriesData.find(item => item.id === currentCategoryId);
        return found?.title;
    }, [currentCategoryId, allCategoriesData]);

    // ============================================================================
    // Navigation Handlers
    // ============================================================================
    // Handles navigation to the next category
    // Automatically enables the next category before navigating to it
    // This ensures users can proceed through categories in sequence
    const handleNext = useCallback(() => {
        if (nextId && onStepChange) {
            // Enable the next category before navigating to it
            enableCategory(nextId);
            onStepChange(nextId);
        }
    }, [nextId, onStepChange, enableCategory]);

    // Handles navigation to the previous category
    // Simply navigates back without any additional logic (previous categories are already enabled)
    const handlePrevious = useCallback(() => {
        if (previousId && onStepChange) {
            onStepChange(previousId);
        }
    }, [previousId, onStepChange]);

    // ============================================================================
    // Return Values
    // ============================================================================
    // Returns all computed values and handlers needed by consuming components
    // - Navigation data: categoryIdsFromUrl, currentIndex, previousId, nextId
    // - Category data: itemCode, allCategoriesData, leftSidebarCategories
    // - UI state: effectiveCurrentStep
    // - Handlers: handleNext, handlePrevious, handleCategoryClick, getStepProgress
    return {
        categoryIdsFromUrl,
        currentIndex,
        previousId,
        nextId,
        itemCode,
        allCategoriesData,
        handleNext,
        handlePrevious,
        leftSidebarCategories,
        effectiveCurrentStep,
        getStepProgress,
        handleCategoryClick,
    };
}

export default useCampaignLeftSidebarCategoryLogic;
