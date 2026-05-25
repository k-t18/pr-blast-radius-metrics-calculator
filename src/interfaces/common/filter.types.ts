export interface TableFilterOption<Value extends string> {
    label: string;
    value: Value;
}

export interface TableFilterProperties<Value extends string> {
    options: TableFilterOption<Value>[];
    onClear: () => void;
    className?: string;
    // to removed after custom filter implementation
    selected?: Value | null | '';
    onSelect?: (value: Value) => void;
    /**
     * Optional map of value options per filter key, e.g. { id: [...] }.
     * Used to populate the second input's dropdown dynamically per table.
     * Can be array of strings or array of objects with {name: string} format from API.
     */
    valueOptions?: Partial<Record<Value, string[] | Array<{ name: string }>>>;
    /**
     * Optional callback fired when the user clicks "Apply Filters".
     * Receives the list of active filters (field + chosen value).
     */
    onApply?: (filters: { field: Value; value: string }[]) => void;
    /**
     * Optional initial filter values to pre-populate the filter inputs.
     * Used for URL-based filtering or restoring filter state.
     */
    initialFilters?: { field: Value; value: string }[];
    /**
     * Optional callback fired when the value text changes in any filter row.
     * Used for fetching dynamic filter options based on search term.
     * @param field - The filter field name
     * @param searchTerm - The current search term typed by the user
     * @param rowId - The unique ID of the filter row
     */
    onValueTextChange?: (field: Value, searchTerm: string, rowId: number) => void;
}
