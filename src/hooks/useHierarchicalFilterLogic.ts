import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FilterOption, FilterSection, HierarchicalFilterConfig, HierarchicalFilterState } from '../interfaces/mobileSponsorship/filters';

/**
 * Custom hook for managing hierarchical filter logic
 *
 * Quick example:
 * const { selectedFilters, setSelectedFilters, fieldValues, setFieldValues, handleFilterChange } =
 *   useHierarchicalFilterLogic(filterSections, { initialSelectedFilters: new Set(['opt-1']) });
 * setFieldValues({ country: { label: 'Nigeria', value: 'nigeria' } });
 * handleFilterChange(option, true); // option is a FilterOption with children; cascades selection
 * // Returns: state + handlers for hierarchical checkboxes, dropdowns, multiselects, radios.
 *
 * This is a pure, context-agnostic hook that handles hierarchical filter selection
 * with parent-child relationships. It supports two modes:
 *
 * 1. UNCONTROLLED MODE (default): The hook manages its own internal state
 * 2. CONTROLLED MODE: Pass external state via `controlledState` config option
 * Features:
 * - Hierarchical checkbox selection (parent-child cascading)
 * - Support for multiple input types (checkbox, dropdown, multiselect, radio)
 * - Auto-expansion of sections/options containing selected filters
 * - Indeterminate state for partially selected parent options
 *
 * @param filterSections - Array of filter sections containing hierarchical options
 * @param config - Configuration options including initial state and callbacks
 * @returns Object containing filter state and utility functions
 */
const useHierarchicalFilterLogic = <TFieldValues extends Record<string, unknown> = Record<string, unknown>>(
    filterSections: FilterSection[],
    config: HierarchicalFilterConfig<TFieldValues> = {}
): HierarchicalFilterState<TFieldValues> => {
    const {
        controlledState,
        initialSelectedFilters = new Set<string>(),
        initialFieldValues = {},
        onSelectedFiltersChange,
        onFieldValuesChange,
        onEmpty,
    } = config;

    // Determine if we're in controlled mode
    const isControlled = controlledState !== undefined;

    // UNCONTROLLED MODE: Internal state (only used when not controlled)
    const [internalSelectedFilters, setInternalSelectedFilters] = useState<Set<string>>(initialSelectedFilters);
    const [internalFieldValues, setInternalFieldValues] = useState<TFieldValues>((initialFieldValues ?? {}) as TFieldValues);

    // Section expand/collapse state - always managed internally
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());

    // Use controlled or internal state based on mode
    const selectedFilters = isControlled ? controlledState.selectedFilters : internalSelectedFilters;
    const fieldValues = isControlled ? controlledState.fieldValues : internalFieldValues;

    /**
     * Helper function to check if all fields are empty.
     * Example:
     * checkIfEmpty(new Set(['opt-1']), { country: { label: 'Nigeria', value: 'nigeria' } }) -> false
     * checkIfEmpty(new Set(), { country: undefined, cities: [] }) -> true
     * @param filters - selected checkbox IDs
     * @param fields - record of dropdown/multiselect/radio values
     * @returns boolean indicating no selections/values
     */
    const checkIfEmpty = useCallback((filters: Set<string>, fields: Record<string, unknown>): boolean => {
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
     * Unified setter for selectedFilters that works in both modes.
     * Example:
     * setSelectedFilters(new Set(['opt-1'])); // replace selection
     * setSelectedFilters(prev => {
     *   const next = new Set(prev);
     *   next.add('opt-2');
     *   return next;
     * }); // functional update; triggers cascading effects + callbacks
     */
    const setSelectedFilters = useCallback(
        (value: Set<string> | ((previous: Set<string>) => Set<string>)) => {
            const setter = isControlled ? controlledState.setSelectedFilters : setInternalSelectedFilters;

            // For internal state, we need to compute the next value for callbacks
            if (isControlled) {
                // For controlled state, just call the external setter
                // Callbacks should be handled by the parent hook
                setter(value);
            } else {
                setInternalSelectedFilters(previous => {
                    const next = typeof value === 'function' ? value(previous) : value;
                    if (onSelectedFiltersChange) {
                        onSelectedFiltersChange(next);
                    }
                    if (onEmpty && checkIfEmpty(next, fieldValues)) {
                        onEmpty();
                    }
                    return next;
                });
            }
        },
        [isControlled, controlledState, onSelectedFiltersChange, onEmpty, checkIfEmpty, fieldValues]
    );

    /**
     * Unified setter for fieldValues (select and multiselect) that works in both modes.
     * Example:
     * setFieldValues({
     *   country: { label: 'Nigeria', value: 'nigeria' },
     *   cities: [{ label: 'Ahuja Metro', value: 'ahuja-metro' }],
     * });
     * setFieldValues(prev => ({ ...prev, region: 'north' })); // functional update
     */
    const setFieldValues = useCallback(
        (value: TFieldValues | ((previous: TFieldValues) => TFieldValues)) => {
            if (isControlled) {
                controlledState.setFieldValues(value);
            } else {
                setInternalFieldValues(previous => {
                    const next = typeof value === 'function' ? value(previous) : value;
                    if (onFieldValuesChange) {
                        onFieldValuesChange(next);
                    }
                    if (onEmpty && checkIfEmpty(selectedFilters, next)) {
                        onEmpty();
                    }
                    return next;
                });
            }
        },
        [isControlled, controlledState, onFieldValuesChange, onEmpty, checkIfEmpty, selectedFilters]
    );

    /**
     * Recursively retrieves all descendant option IDs for a given filter option.
     * Example:
     * const option = { id: 'parent', children: [{ id: 'child-1', children: [{ id: 'grand-1' }] }] } as FilterOption;
     * getAllDescendantIds(option) -> ['child-1', 'grand-1']
     * @param option - parent FilterOption
     * @returns string[] of all descendant IDs (depth-first)
     */
    const getAllDescendantIds = useCallback((option: FilterOption): string[] => {
        if (!option.children) {
            return [];
        }

        const ids: string[] = [];
        const childrenLength = option.children.length;

        for (let index = 0; index < childrenLength; index += 1) {
            const child = option.children[index];
            ids.push(child.id);
            const childIds = getAllDescendantIds(child);
            const childIdsLength = childIds.length;
            for (let childIndex = 0; childIndex < childIdsLength; childIndex += 1) {
                ids.push(childIds[childIndex]);
            }
        }

        return ids;
    }, []);

    /**
     * Recursively finds all parent options that contain a target option ID.
     * Example:
     * const tree = [{ id: 'p1', children: [{ id: 'c1', children: [{ id: 'g1' }] }] }] as FilterOption[];
     * findParentOptions('g1', tree) -> [{ id: 'p1', ... }, { id: 'c1', ... }]
     */
    const findParentOptions = useCallback((targetId: string, options: FilterOption[], parents: FilterOption[] = []): FilterOption[] => {
        const foundParents: FilterOption[] = [];
        const optionsLength = options.length;

        for (let index = 0; index < optionsLength; index += 1) {
            const option = options[index];

            if (option.id === targetId) {
                return parents;
            }

            if (option.children) {
                const newParents = [...parents, option];
                const childParents = findParentOptions(targetId, option.children, newParents);
                if (childParents.length > 0) {
                    foundParents.push(...childParents);
                }
            }
        }

        return foundParents;
    }, []);

    /**
     * Checks if an option and ALL its descendants are currently selected.
     * Example:
     * // with selectedFilters = Set(['c1', 'g1'])
     * isOptionFullySelected({ id: 'p1', children: [{ id: 'c1', children: [{ id: 'g1' }] }] }) -> true
     */
    const isOptionFullySelected = useCallback(
        (option: FilterOption): boolean => {
            if (!option.children || option.children.length === 0) {
                return selectedFilters.has(option.id);
            }

            const allDescendantIds = getAllDescendantIds(option);
            return allDescendantIds.every(id => selectedFilters.has(id));
        },
        [selectedFilters, getAllDescendantIds]
    );

    /**
     * Checks if an option is partially selected.
     * Examples:
     * // with selectedFilters = Set(['g1'])
     * isOptionPartiallySelected({ id: 'p1', children: [{ id: 'g1' }, { id: 'g2' }] }) -> true
     * // with selectedFilters = Set(['g1', 'g2'])
     * isOptionPartiallySelected({ id: 'p1', children: [{ id: 'g1' }, { id: 'g2' }] }) -> false (fully selected)
     */
    const isOptionPartiallySelected = useCallback(
        (option: FilterOption): boolean => {
            if (!option.children || option.children.length === 0) {
                return false;
            }

            const allDescendantIds = getAllDescendantIds(option);
            const selectedCount = allDescendantIds.filter(id => selectedFilters.has(id)).length;

            return selectedCount > 0 && selectedCount < allDescendantIds.length;
        },
        [selectedFilters, getAllDescendantIds]
    );

    /**
     * Handles filter checkbox change with automatic parent-child relationship management.
     * Example:
     * handleFilterChange(optionWithChildren, true);  // selects option + all descendants, updates parents
     * handleFilterChange(optionWithChildren, false); // deselects option + all descendants, updates parents
     */
    const handleFilterChange = useCallback(
        (option: FilterOption, checked: boolean) => {
            setSelectedFilters(previous => {
                const next = new Set(previous);
                const allDescendantIds = getAllDescendantIds(option);

                if (checked) {
                    next.add(option.id);
                    const idsLength = allDescendantIds.length;
                    for (let index = 0; index < idsLength; index += 1) {
                        next.add(allDescendantIds[index]);
                    }
                } else {
                    next.delete(option.id);
                    const idsLength = allDescendantIds.length;
                    for (let index = 0; index < idsLength; index += 1) {
                        next.delete(allDescendantIds[index]);
                    }
                }

                // Update parent options based on children state
                const allSections = filterSections.flatMap(section => section.options);
                const parentOptions = findParentOptions(option.id, allSections);

                const parentOptionsLength = parentOptions.length;
                for (let parentIndex = 0; parentIndex < parentOptionsLength; parentIndex += 1) {
                    const parent = parentOptions[parentIndex];

                    if (parent.children && parent.children.length > 0) {
                        let allChildrenSelected = true;
                        const childrenLength = parent.children.length;

                        for (let childIndex = 0; childIndex < childrenLength; childIndex += 1) {
                            const child = parent.children[childIndex];
                            const childDescendants = getAllDescendantIds(child);
                            const childAndDescendants = [child.id, ...childDescendants];
                            const childFullySelected = childAndDescendants.every(id => next.has(id));

                            if (!childFullySelected) {
                                allChildrenSelected = false;
                                break;
                            }
                        }

                        if (allChildrenSelected) {
                            next.add(parent.id);
                        } else {
                            next.delete(parent.id);
                        }
                    }
                }

                return next;
            });
        },
        [getAllDescendantIds, filterSections, findParentOptions, setSelectedFilters]
    );

    /**
     * Compute which sections and options should be expanded based on selected filters
     */
    const sectionsAndOptionsToExpand = useMemo(() => {
        if (filterSections.length === 0) {
            return { sectionsToExpand: new Set<string>(), optionsToExpand: new Set<string>() };
        }

        const sectionsToExpand = new Set<string>();
        const optionsToExpand = new Set<string>();

        const checkOption = (option: FilterOption): boolean => {
            if (selectedFilters.has(option.id) || fieldValues[option.id]) {
                if (option.children && option.children.length > 0) {
                    optionsToExpand.add(option.id);
                }
                return true;
            }

            if (option.children) {
                const childrenLength = option.children.length;
                for (let childIndex = 0; childIndex < childrenLength; childIndex += 1) {
                    if (checkOption(option.children[childIndex])) {
                        optionsToExpand.add(option.id);
                        return true;
                    }
                }
            }

            return false;
        };

        const sectionsLength = filterSections.length;
        for (let sectionIndex = 0; sectionIndex < sectionsLength; sectionIndex += 1) {
            const section = filterSections[sectionIndex];
            let hasSelectedFilters = false;

            const optionsLength = section.options.length;
            for (let optionIndex = 0; optionIndex < optionsLength; optionIndex += 1) {
                if (checkOption(section.options[optionIndex])) {
                    hasSelectedFilters = true;
                }
            }

            if (hasSelectedFilters) {
                sectionsToExpand.add(section.id);
            }
        }

        return { sectionsToExpand, optionsToExpand };
    }, [selectedFilters, fieldValues, filterSections]);

    /**
     * Auto-expand sections and options that contain selected filters
     */
    useEffect(() => {
        const { sectionsToExpand, optionsToExpand } = sectionsAndOptionsToExpand;

        if (sectionsToExpand.size > 0) {
            setExpandedSections(previous => {
                const next = new Set(previous);
                // eslint-disable-next-line no-restricted-syntax
                for (const section of sectionsToExpand) {
                    next.add(section);
                }
                return next;
            });
        }

        if (optionsToExpand.size > 0) {
            setExpandedOptions(previous => {
                const next = new Set(previous);
                // eslint-disable-next-line no-restricted-syntax
                for (const option of optionsToExpand) {
                    next.add(option);
                }
                return next;
            });
        }
    }, [sectionsAndOptionsToExpand]);

    /**
     * Toggles the expand/collapse state of a filter section
     */
    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(previous => {
            const next = new Set(previous);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    }, []);

    /**
     * Toggles the expand/collapse state of a nested filter option
     */
    const toggleOption = useCallback((optionId: string) => {
        setExpandedOptions(previous => {
            const next = new Set(previous);
            if (next.has(optionId)) {
                next.delete(optionId);
            } else {
                next.add(optionId);
            }
            return next;
        });
    }, []);

    /**
     * Clears all selected filters and field values
     */
    const clearAll = useCallback(() => {
        setSelectedFilters(new Set());
        setFieldValues({} as TFieldValues);
    }, [setSelectedFilters, setFieldValues]);

    /**
     * Check if there are any selections
     */
    const hasSelections = useMemo(() => {
        return !checkIfEmpty(selectedFilters, fieldValues);
    }, [selectedFilters, fieldValues, checkIfEmpty]);

    return {
        // State values
        selectedFilters,
        fieldValues,
        expandedSections,
        expandedOptions,

        // State setters
        setSelectedFilters,
        setFieldValues,

        // Filter logic functions
        getAllDescendantIds,
        findParentOptions,
        isOptionFullySelected,
        isOptionPartiallySelected,
        handleFilterChange,

        // UI state handlers
        toggleSection,
        toggleOption,

        // Utility functions
        clearAll,
        hasSelections,
    };
};

export default useHierarchicalFilterLogic;
