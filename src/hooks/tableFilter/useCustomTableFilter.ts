import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { OverlayPanel } from 'primereact/overlaypanel';
import type { AutoComplete } from 'primereact/autocomplete';
import type { TableFilterOption } from '../../interfaces/common/filter.types';

export interface FilterRow<Value extends string> {
    id: number;
    field: Value | '';
    fieldText: string;
    value: string;
    valueText: string;
    className?: string;
}

interface UseCustomTableFilterProperties<Value extends string> {
    options: TableFilterOption<Value>[];
    valueOptions?: Partial<Record<Value, string[] | Array<{ name: string }>>>;
    initialFilters?: { field: Value; value: string }[];
    onClear: () => void;
    onApply?: (filters: { field: Value; value: string }[]) => void;
    onValueTextChange?: (field: Value, searchTerm: string, rowId: number) => void;
}

export function useCustomTableFilter<Value extends string>({
    options,
    valueOptions,
    initialFilters,
    onClear,
    onApply,
    onValueTextChange,
}: UseCustomTableFilterProperties<Value>) {
    const overlayReference = useRef<OverlayPanel>(null);

    const optionLookup = useMemo(() => new Map(options.map(option => [option.value, option.label])), [options]);

    const [rows, setRows] = useState<FilterRow<Value>[]>(() => {
        if (initialFilters && initialFilters.length > 0) {
            return initialFilters.map((filter, index) => ({
                id: Date.now() + index,
                field: filter.field,
                fieldText: optionLookup.get(filter.field) ?? '',
                value: filter.value,
                valueText: filter.value,
            }));
        }
        return [
            {
                id: Date.now(),
                field: '' as Value | '',
                fieldText: '',
                value: '',
                valueText: '',
            },
        ];
    });

    // Per-row suggestions to avoid conflicts with multiple filter rows
    const [fieldSuggestions, setFieldSuggestions] = useState<Map<number, string[]>>(new Map());
    const [valueSuggestions, setValueSuggestions] = useState<Map<number, string[]>>(new Map());

    // Refs for AutoComplete components to show panel on focus
    const fieldAutocompleteReferences = useRef<Map<number, AutoComplete<string> | null>>(new Map());
    const valueAutocompleteReferences = useRef<Map<number, AutoComplete<string> | null>>(new Map());

    const activeCount = rows.filter(row => row.field && row.value).length;

    // Watch for valueText changes and valueOptions updates to re-filter suggestions
    useEffect(() => {
        rows.forEach(row => {
            const { field, valueText, id } = row;
            if (field) {
                const rawList = valueOptions?.[field as Value] ? valueOptions[field as Value]! : [];
                const list: string[] =
                    rawList.length > 0 && typeof rawList[0] === 'object'
                        ? (rawList as Array<{ name: string }>).map(item => item.name)
                        : (rawList as string[]);

                // Filter based on current valueText, or show all if empty
                const filtered = valueText.trim() === '' ? list : list.filter((v: string) => v.toLowerCase().includes(valueText.toLowerCase()));

                setValueSuggestions(previous => {
                    const next = new Map(previous);
                    next.set(id, filtered);
                    return next;
                });
            }
        });
    }, [rows, valueOptions]);

    /**
     * Toggles the filter overlay panel visibility.
     * Ensures at least one filter row exists when opening the panel.
     */
    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        // Ensure at least one row exists when opening
        if (rows.length === 0) {
            setRows([
                {
                    id: Date.now(),
                    field: '' as Value | '',
                    fieldText: '',
                    value: '',
                    valueText: '',
                },
            ]);
        }
        overlayReference.current?.toggle(event);
    };

    /**
     * Filters field options (e.g., 'ID', 'Order ID') based on the search query.
     * Updates the field suggestions for the specific row.
     * @param rowId - The unique ID of the filter row
     * @param query - The search query to filter options by (empty string shows all options)
     */
    const handleFieldSearch = (rowId: number, query: string) => {
        // If query is empty, show all options
        const filtered =
            query.trim() === ''
                ? options.map(o => o.label)
                : options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())).map(o => o.label);

        setFieldSuggestions(previous => {
            const next = new Map(previous);
            next.set(rowId, filtered);
            return next;
        });
    };

    /**
     * Handles when the field autocomplete input is focused.
     * Shows filtered suggestions based on the current field value, or all options if empty.
     * Displays the suggestions panel programmatically.
     * @param rowId - The unique ID of the filter row
     */
    const handleFieldFocus = (rowId: number) => {
        // Find the current row to get its fieldText value
        const currentRow = rows.find(r => r.id === rowId);
        const currentValue = currentRow?.fieldText || '';

        // If there's a current value, filter by it; otherwise show all options
        handleFieldSearch(rowId, currentValue);

        // Show the panel programmatically
        const autocompleteReference = fieldAutocompleteReferences.current.get(rowId);
        if (autocompleteReference) {
            autocompleteReference.show();
        }
    };

    /**
     * Handles when a field option is selected from the autocomplete dropdown.
     * Updates the row's field and fieldText, and clears the value/valueText.
     * Clears value suggestions for the row since the field has changed.
     * @param rowId - The unique ID of the filter row
     * @param selectedLabel - The label of the selected field option (e.g., 'ID', 'Order ID')
     */
    const handleFieldSelect = (rowId: number, selectedLabel: string) => {
        const matched = options.find(o => o.label === selectedLabel);

        setRows(previous =>
            previous.map(r =>
                r.id === rowId
                    ? {
                          ...r,
                          field: matched?.value || ('' as Value | ''),
                          fieldText: selectedLabel,
                          value: '', // Clear value when field changes
                          valueText: '',
                      }
                    : r
            )
        );

        // Clear value suggestions when field changes
        setValueSuggestions(previous => {
            const next = new Map(previous);
            next.delete(rowId);
            return next;
        });
    };

    /**
     * Handles the onChange event for the field autocomplete input.
     * Updates the selected field and triggers a search if the value is cleared.
     * @param rowId - The unique ID of the filter row
     * @param newValue - The new field value from the input (can be empty string)
     */
    const handleFieldChange = (rowId: number, newValue: string) => {
        handleFieldSelect(rowId, newValue);
        if (!newValue || newValue.trim() === '') {
            // Use setTimeout to ensure state is updated first
            setTimeout(() => {
                handleFieldSearch(rowId, '');
                const autocompleteReference = fieldAutocompleteReferences.current.get(rowId);
                if (autocompleteReference) {
                    autocompleteReference.show();
                }
            }, 0);
        }
    };

    /**
     * Filters value options (e.g., document IDs like 'SAL-QTN-25-0000235') based on the search query.
     * Notifies the parent component about the query change for dynamic data fetching.
     * Updates the value suggestions for the specific row.
     * @param rowId - The unique ID of the filter row
     * @param field - The selected field type (e.g., 'id', 'order_id')
     * @param query - The search query to filter values by (empty string shows all values)
     */
    const handleValueSearch = (rowId: number, field: Value | '', query: string) => {
        const rawList = field && valueOptions?.[field as Value] ? valueOptions[field as Value]! : [];

        // Normalize: Convert objects to strings if needed
        const list: string[] =
            rawList.length > 0 && typeof rawList[0] === 'object'
                ? (rawList as Array<{ name: string }>).map(item => item.name)
                : (rawList as string[]);

        // Notify parent about value text change for dynamic fetching FIRST
        // This allows parent to update valueOptions with broader results when query gets shorter
        if (onValueTextChange && field) {
            onValueTextChange(field, query, rowId);
        }

        // Filter the list based on query (case-insensitive partial match)
        // If query is empty, show all values
        const filtered = query.trim() === '' ? list : list.filter((v: string) => v.toLowerCase().includes(query.toLowerCase()));

        setValueSuggestions(previous => {
            const next = new Map(previous);
            next.set(rowId, filtered);
            return next;
        });
    };

    /**
     * Handles when the value autocomplete input is focused.
     * Shows filtered suggestions based on the current value, or all values if empty.
     * Displays the suggestions panel programmatically.
     * @param rowId - The unique ID of the filter row
     * @param field - The selected field type (must be set for the value field to work)
     */
    const handleValueFocus = (rowId: number, field: Value | '') => {
        // Show filtered values for the selected field when value field is focused
        if (!field) return;

        // Find the current row to get its valueText value
        const currentRow = rows.find(r => r.id === rowId);
        const currentValue = currentRow?.valueText || '';

        // If there's a current value, filter by it; otherwise show all values
        handleValueSearch(rowId, field, currentValue);

        // Show the panel programmatically
        const autocompleteReference = valueAutocompleteReferences.current.get(rowId);
        if (autocompleteReference) {
            autocompleteReference.show();
        }
    };

    /**
     * Handles when a value option is selected from the autocomplete dropdown.
     * Updates the row's value and valueText with the selected option.
     * @param rowId - The unique ID of the filter row
     * @param selectedValue - The selected value (e.g., 'SAL-QTN-25-0000235')
     */
    const handleValueSelect = (rowId: number, selectedValue: string) => {
        setRows(previous =>
            previous.map(r =>
                r.id === rowId
                    ? {
                          ...r,
                          value: selectedValue,
                          valueText: selectedValue,
                      }
                    : r
            )
        );
    };

    /**
     * Handles the onChange event for the value autocomplete input.
     * Updates the selected value and triggers a search if the value is cleared.
     * @param rowId - The unique ID of the filter row
     * @param field - The selected field type (must be set for the value field to work)
     * @param newValue - The new value from the input (can be empty string)
     */
    const handleValueChange = (rowId: number, field: Value | '', newValue: string) => {
        handleValueSelect(rowId, newValue);
        // If value is cleared, trigger search to show all suggestions
        if (field && (!newValue || newValue.trim() === '')) {
            // Use setTimeout to ensure state is updated first
            setTimeout(() => {
                handleValueSearch(rowId, field, '');
                const autocompleteReference = valueAutocompleteReferences.current.get(rowId);
                if (autocompleteReference) {
                    autocompleteReference.show();
                }
            }, 0);
        }
    };

    /**
     * Clears all filters and resets the filter state.
     * Calls the parent's onClear callback, resets rows to a single empty row,
     * clears all suggestions, and hides the overlay panel.
     */
    const handleClear = () => {
        onClear();
        setRows([
            {
                id: Date.now(),
                field: '' as Value | '',
                fieldText: '',
                value: '',
                valueText: '',
            },
        ]);
        setFieldSuggestions(new Map());
        setValueSuggestions(new Map());
        overlayReference.current?.hide();
    };

    /**
     * Adds a new empty filter row to allow multiple filter conditions.
     * Each new row gets a unique ID based on timestamp and current row count.
     */
    const handleAddFilterRow = () => {
        setRows(previous => [
            ...previous,
            {
                id: Date.now() + previous.length,
                field: '' as Value | '',
                fieldText: '',
                value: '',
                valueText: '',
            },
        ]);
    };

    /**
     * Removes a specific filter row by its ID.
     * Cleans up suggestions associated with the removed row.
     * If it's the last row, removes it completely (empty array).
     * @param rowId - The unique ID of the filter row to remove
     */
    const handleRemoveRow = (rowId: number) => {
        setRows(previous => {
            const next = previous.filter(row => row.id !== rowId);
            if (next.length === 0) {
                return [];
            }
            return next;
        });
        // Clean up suggestions for removed row
        setFieldSuggestions(previous => {
            const next = new Map(previous);
            next.delete(rowId);
            return next;
        });
        setValueSuggestions(previous => {
            const next = new Map(previous);
            next.delete(rowId);
            return next;
        });
    };

    /**
     * Applies all active filters (rows with both field and value set).
     * Calls the parent's onApply callback with the filtered results.
     * Hides the overlay panel after applying filters.
     */
    const handleApply = () => {
        const activeFilters = rows
            .filter(row => row.field && row.value)
            .map(row => ({
                field: row.field as Value,
                value: row.value,
            }));

        if (onApply) {
            onApply(activeFilters);
        }

        overlayReference.current?.hide();
    };

    return {
        // State
        rows,
        fieldSuggestions,
        valueSuggestions,
        activeCount,
        // Refs
        overlayReference,
        fieldAutocompleteReferences,
        valueAutocompleteReferences,
        // Handlers
        handleToggle,
        handleFieldSearch,
        handleFieldFocus,
        handleFieldSelect,
        handleFieldChange,
        handleValueSearch,
        handleValueFocus,
        handleValueSelect,
        handleValueChange,
        handleClear,
        handleAddFilterRow,
        handleRemoveRow,
        handleApply,
    };
}
