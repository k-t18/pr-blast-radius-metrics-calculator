import { useCallback, useMemo } from 'react';
import { useCreateCampaignContext, type FieldValuesState } from '../context/createCampaignContext';
import useStepCollapseLogic from './useStepCollapseLogic';
import useHierarchicalFilterLogic from '../../../../../../hooks/useHierarchicalFilterLogic';
import type { FilterSection } from '../../../../../../interfaces/mobileSponsorship/filters';

/**
 * Custom hook for managing target audience filter logic with campaign context integration
 * This hook wraps the common useHierarchicalFilterLogic hook and adds campaign-specific
 * behaviors:
 * - Integration with campaign context for state persistence
 * - Step collapse/expand logic for the wizard flow
 * - Auto-unmarking step when filters are cleared
 * - Auto-expanding step when data is added while collapsed
 *
 * @param filterSections - Array of filter sections containing hierarchical options
 * @returns Object containing filter utility functions, UI state management, and context values
 */
const useTargetAudienceFilterLogic = (filterSections: FilterSection[]) => {
    // Get state and setters from campaign context
    const { selectedFilters, setSelectedFilters, fieldValues, setFieldValues, currentCategoryId, unmarkSubStepAsCompleted } =
        useCreateCampaignContext();

    // Use the step collapse hook for step collapse/expand state and handlers
    const { isCollapsed, handleSaveAndContinue, handleEdit, isStepCompleted, expandStep } = useStepCollapseLogic(2);

    /**
     * Checks if all filter data (both checkbox selections and field values) is empty.
     * Used to determine when to auto-unmark the step as completed.
     * Example:
     * isAllFilterDataEmpty(new Set(['opt-1']), { country: { label: 'Nigeria', value: 'nigeria' } }) -> false
     * isAllFilterDataEmpty(new Set(), { country: undefined, cities: [] }) -> true
     */
    const isAllFilterDataEmpty = useCallback((filters: Set<string>, fields: Record<string, unknown>): boolean => {
        const hasFilters = filters.size > 0;
        const hasFieldValues =
            Object.keys(fields).length > 0 &&
            Object.values(fields).some(value => {
                if (value === undefined || value === null) return false;
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'string') return value.trim().length > 0;
                return true;
            });
        return !hasFilters && !hasFieldValues;
    }, []);

    /**
     * Enhanced setter for selected filters that adds wizard step behaviors:
     * - Auto-expands the step when filters are added while collapsed
     * - Auto-unmarks step completion when all filters are cleared
     * Example:
     * updateSelectedFiltersWithStepBehaviors(prev => new Set(prev).add('target_audience-0176'));
     * // expands step if collapsed and marks data present; clears completion if emptied
     */
    const updateSelectedFiltersWithStepBehaviors = useCallback(
        (value: Set<string> | ((previous: Set<string>) => Set<string>)) => {
            setSelectedFilters(previous => {
                const next = typeof value === 'function' ? value(previous) : value;

                // Auto-expand step when data is added while collapsed
                const nextHasData = next.size > 0 || Object.keys(fieldValues).length > 0;
                if (isCollapsed && nextHasData) {
                    expandStep();
                }

                // Auto-unmark step when filters are cleared
                const isEmpty = isAllFilterDataEmpty(next, fieldValues);
                if (isEmpty && isStepCompleted && currentCategoryId) {
                    expandStep();
                    unmarkSubStepAsCompleted(currentCategoryId, 2);
                }

                return next;
            });
        },
        [setSelectedFilters, fieldValues, isCollapsed, expandStep, isStepCompleted, currentCategoryId, unmarkSubStepAsCompleted, isAllFilterDataEmpty]
    );

    /**
     * Enhanced setter for field values (dropdowns, multiselects, radios) that adds wizard step behaviors:
     * - Auto-expands the step when field values are added while collapsed
     * - Auto-unmarks step completion when all fields are cleared
     * Example:
     * updateFieldValuesWithStepBehaviors(prev => ({
     *   ...prev,
     *   'target_audience-0171': { label: 'Nigeria', value: 'target_audience-0172' },
     *   'target_audience-0181': [{ label: 'Ahuja Metro', value: 'target_audience-0182' }],
     * }));
     * // expands step if collapsed and data present; clears completion if emptied
     */
    const updateFieldValuesWithStepBehaviors = useCallback(
        (value: FieldValuesState | ((previous: FieldValuesState) => FieldValuesState)) => {
            setFieldValues(previous => {
                const next = typeof value === 'function' ? value(previous) : value;

                // Auto-expand step when data is added while collapsed
                const nextHasData =
                    selectedFilters.size > 0 ||
                    (Object.keys(next).length > 0 &&
                        Object.values(next).some(v => {
                            if (v === undefined || v === null) return false;
                            if (Array.isArray(v)) return v.length > 0;
                            if (typeof v === 'string') return v.trim().length > 0;
                            return true;
                        }));

                if (isCollapsed && nextHasData) {
                    expandStep();
                }

                // Auto-unmark step when filters are cleared
                const isEmpty = isAllFilterDataEmpty(selectedFilters, next);
                if (isEmpty && isStepCompleted && currentCategoryId) {
                    expandStep();
                    unmarkSubStepAsCompleted(currentCategoryId, 2);
                }

                return next;
            });
        },
        [setFieldValues, selectedFilters, isCollapsed, expandStep, isStepCompleted, currentCategoryId, unmarkSubStepAsCompleted, isAllFilterDataEmpty]
    );

    /**
     * Bridge object that connects campaign context state to the common hierarchical filter hook.
     * Uses our enhanced setters to ensure wizard behaviors are applied.
     */
    const bridgeStateForHierarchicalHook = useMemo(
        () => ({
            selectedFilters,
            setSelectedFilters: updateSelectedFiltersWithStepBehaviors,
            fieldValues,
            setFieldValues: updateFieldValuesWithStepBehaviors,
        }),
        [selectedFilters, updateSelectedFiltersWithStepBehaviors, fieldValues, updateFieldValuesWithStepBehaviors]
    );
    // Example bridge state shape:
    // {
    //   selectedFilters: Set(['target_audience-0176']),
    //   setSelectedFilters: fn (with wizard behaviors),
    //   fieldValues: { 'target_audience-0171': { label: 'Nigeria', value: 'target_audience-0172' } },
    //   setFieldValues: fn (with wizard behaviors)
    // }

    // USE the common hook in CONTROLLED MODE - passing our bridge state
    // This provides all the hierarchical filter logic (cascading selection, etc.)
    const {
        expandedSections,
        expandedOptions,
        getAllDescendantIds,
        findParentOptions,
        isOptionFullySelected,
        isOptionPartiallySelected,
        handleFilterChange,
        toggleSection,
        toggleOption,
    } = useHierarchicalFilterLogic<FieldValuesState>(filterSections, {
        controlledState: bridgeStateForHierarchicalHook,
    });

    return {
        // State values from context (via common hook)
        selectedFilters,
        setSelectedFilters: updateSelectedFiltersWithStepBehaviors,
        fieldValues,
        setFieldValues: updateFieldValuesWithStepBehaviors,

        // Filter logic functions from common hook
        getAllDescendantIds,
        findParentOptions,
        isOptionFullySelected,
        isOptionPartiallySelected,
        handleFilterChange,

        // UI state from common hook
        expandedSections,
        expandedOptions,

        // Step collapse state (campaign-specific)
        isCollapsed,
        isStepCompleted,

        // UI state handlers
        toggleSection,
        toggleOption,
        handleSaveAndContinue,
        handleEdit,
    };
};

export default useTargetAudienceFilterLogic;
