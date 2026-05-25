import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useCreateCampaignContext } from '../context/createCampaignContext';
import { useProcessedApplySavedFilterData } from './useProcessedApplySavedFilterData';
import type { StateBeforeSavedFilters, UseApplySavedFiltersReturn } from '../../../../../../interfaces/mobileSponsorship/createCampaignHooks.types';

/**
 * Custom hook for managing apply saved filters logic
 *
 * Handles:
 * - Fetching saved filters when checkbox is checked
 * - Merging saved filters with current filters
 * - Clearing filters when checkbox is unchecked
 * - Step 2 completion state management
 *
 * @returns Object containing saveFilters state and handlers
 */
export function useApplySavedFilters(): UseApplySavedFiltersReturn {
    const { selectedFilters, fieldValues, setSelectedFilters, setFieldValues, currentCategoryId, unmarkSubStepAsCompleted, completedSubSteps } =
        useCreateCampaignContext();

    // State for filter save checkbox - when checked, applies saved filters
    const [saveFilters, setSaveFiltersState] = useState(false);

    // ============================================================================
    // Saved Filters Data Fetching
    // ============================================================================

    // Fetch and extract saved filter data when checkbox is checked
    const {
        selectedFilters: savedSelectedFilters,
        fieldValues: savedFieldValues,
        sectionsToExpand: savedSectionsToExpand,
        optionsToExpand: savedOptionsToExpand,
        isLoading: isLoadingSavedFilters,
        error: savedFiltersError,
    } = useProcessedApplySavedFilterData(saveFilters);

    // Track if saved filters have been applied to prevent re-applying
    const savedFiltersAppliedReference = useRef(false);

    // Store the state before saved filters were applied (to restore when unchecked)
    // eslint-disable-next-line unicorn/no-null
    const stateBeforeSavedFiltersReference = useRef<StateBeforeSavedFilters | null>(null);

    // ============================================================================
    // Merged Filters Computation
    // ============================================================================

    /**
     * Computes merged filters by combining current filters with saved filters
     *
     * This memoized value:
     * - Returns undefined if saved filters are disabled, still loading, or already applied
     * - Stores the current filter state before merging (for restoration when unchecked)
     * - Merges current filters with saved filters (saved filters take precedence for field values)
     * - Returns the merged filters ready to be applied to the context
     *
     * @returns Merged filters object with selectedFilters, fieldValues, sectionsToExpand, and optionsToExpand,
     *          or undefined if filters should not be applied
     */
    const mergedFiltersReadyToApply = useMemo(() => {
        // Early return if saved filters are disabled, still loading, or already applied
        if (!saveFilters || isLoadingSavedFilters || savedFiltersAppliedReference.current) {
            return;
        }

        // Check if we have saved filters to apply
        const hasSavedFilters = savedSelectedFilters.size > 0 || Object.keys(savedFieldValues).length > 0;
        if (!hasSavedFilters) {
            return;
        }

        // Store current state before applying saved filters (to restore when unchecked)
        stateBeforeSavedFiltersReference.current = {
            selectedFilters: new Set(selectedFilters),
            fieldValues: { ...fieldValues },
        };

        // Merge saved filters with current filters
        // For selectedFilters: combine both sets (union)
        // For fieldValues: saved values override current values
        const mergedSelectedFilters = new Set([...selectedFilters, ...savedSelectedFilters]);
        const mergedFieldValues = { ...fieldValues, ...savedFieldValues };

        return {
            selectedFilters: mergedSelectedFilters,
            fieldValues: mergedFieldValues,
            sectionsToExpand: savedSectionsToExpand,
            optionsToExpand: savedOptionsToExpand,
        };
    }, [
        saveFilters,
        isLoadingSavedFilters,
        savedSelectedFilters,
        savedFieldValues,
        selectedFilters,
        fieldValues,
        savedSectionsToExpand,
        savedOptionsToExpand,
    ]);

    // ============================================================================
    // Side Effects
    // ============================================================================

    /**
     * Apply merged filters to context when they're ready
     * If step 2 is completed (collapsed), unmark it first to expand it, then apply filters
     */
    useEffect(() => {
        if (mergedFiltersReadyToApply) {
            // Mark as applied to prevent re-applying
            savedFiltersAppliedReference.current = true;
            // If step 2 is completed (collapsed with edit icon showing), unmark it to expand it
            // This ensures the step opens when saved filters are applied
            if (currentCategoryId && completedSubSteps.has(2)) {
                unmarkSubStepAsCompleted(currentCategoryId, 2);
            }
            // Apply filters to context
            setSelectedFilters(mergedFiltersReadyToApply.selectedFilters);
            setFieldValues(mergedFiltersReadyToApply.fieldValues);
        }
    }, [mergedFiltersReadyToApply, setSelectedFilters, setFieldValues, currentCategoryId, completedSubSteps, unmarkSubStepAsCompleted]);

    /**
     * Clear all target audience filters when checkbox is unchecked
     * Removes all filters immediately when saved filters checkbox is unchecked
     * Also unmarks step 2 (target audience step) and resets category completion
     */
    useEffect(() => {
        // Clear filters when checkbox is unchecked and saved filters were applied
        if (!saveFilters && savedFiltersAppliedReference.current) {
            // Reset applied flag
            savedFiltersAppliedReference.current = false;
            // Clear all target audience filters
            setSelectedFilters(new Set<string>());
            setFieldValues({});
            // Unmark step 2 (target audience step) - this also resets isCompleted to false
            // This ensures "Save Campaign" button shows and "Next"/"Review & Submit" buttons are disabled
            if (currentCategoryId) {
                unmarkSubStepAsCompleted(currentCategoryId, 2);
            }
            // Clear the stored state
            // eslint-disable-next-line unicorn/no-null
            stateBeforeSavedFiltersReference.current = null;
        }
    }, [saveFilters, setSelectedFilters, setFieldValues, currentCategoryId, unmarkSubStepAsCompleted]);

    // ============================================================================
    // Handlers
    // ============================================================================

    /**
     * Wrapper for setSaveFilters that clears filters when unchecked
     * Clears all target audience filters immediately when unchecked
     * Also unmarks step 2 (target audience step) and resets category completion
     */
    const setSaveFilters = useCallback(
        (checked: boolean) => {
            if (!checked) {
                // Clear all filters immediately when unchecked
                savedFiltersAppliedReference.current = false;
                // eslint-disable-next-line unicorn/no-null
                stateBeforeSavedFiltersReference.current = null;
                // Clear target audience filters
                setSelectedFilters(new Set<string>());
                setFieldValues({});
                // Unmark step 2 (target audience step) - this also resets isCompleted to false
                // This ensures "Save Campaign" button shows and "Next"/"Review & Submit" buttons are disabled
                if (currentCategoryId) {
                    unmarkSubStepAsCompleted(currentCategoryId, 2);
                }
            }
            setSaveFiltersState(checked);
        },
        [setSelectedFilters, setFieldValues, currentCategoryId, unmarkSubStepAsCompleted]
    );

    /**
     * Clear all selected filters and field values
     * Resets the filter state to initial empty state
     * Also unchecks the "Apply saved filters" checkbox
     * Also unmarks step 2 (target audience step) and resets category completion
     */
    const clearFilters = useCallback(() => {
        setSelectedFilters(new Set());
        setFieldValues({});
        // Unmark step 2 (target audience step) - this also resets isCompleted to false
        if (currentCategoryId) {
            unmarkSubStepAsCompleted(currentCategoryId, 2);
        }
        // Uncheck the saved filters checkbox
        setSaveFiltersState(false);
        // Reset saved filters tracking
        savedFiltersAppliedReference.current = false;
        // eslint-disable-next-line unicorn/no-null
        stateBeforeSavedFiltersReference.current = null;
    }, [setSelectedFilters, setFieldValues, currentCategoryId, unmarkSubStepAsCompleted]);

    return {
        saveFilters,
        setSaveFilters,
        clearFilters,
        isLoadingSavedFilters,
        savedFiltersError,
    };
}
