# CustomTableFilter Component

A flexible filter component for data tables that allows users to filter data by multiple fields with dynamic autocomplete suggestions.

## Props Interface

The component accepts the following properties:

**Required Props:**

- `options`: Array of filter field options. Each option has a `label` (display text) and `value` (internal value).
- `onClear`: Function called when user clicks "Clear Filters". Should reset all filter-related state.

**Optional Props:**

- `className`: String for custom CSS classes
- `valueOptions`: Object mapping field values to arrays of possible values. Supports both string arrays and object arrays with `name` property.
- `onApply`: Function called when user clicks "Apply Filters". Receives array of active filters (field + value pairs).
- `initialFilters`: Array of filter objects to pre-populate the component. Useful for URL-based initialization.
- `onValueTextChange`: Function called when user types in value field. Receives field name, search term, and row ID. Useful for dynamic value fetching.

## Basic Usage

### Simple Implementation

1. Define your filter options with labels and values
2. Create state to store filter parameters
3. Implement `handleApplyFilters` to process active filters and update your data fetching
4. Implement `handleClearFilters` to reset all filters
5. Pass these handlers to the component

The component will manage the UI state internally (open/close panel, filter rows, suggestions).

## Advanced Usage

### With Dynamic Value Options

When filter values need to be fetched dynamically based on the selected field:

1. Maintain search terms state for each filterable field
2. Use a hook (like `useFilterOptions`) to fetch options based on search terms
3. Memoize the `valueOptions` object mapping fields to their available values
4. Implement `onValueTextChange` to update search terms as user types
5. The component will automatically show filtered suggestions based on the search term

### With Initial Filters from URL

To initialize filters from URL parameters:

1. Extract filter values from URL search parameters
2. Map URL values to initial filter format: `[{ field: 'fieldName', value: 'fieldValue' }]`
3. Pass as `initialFilters` prop
4. The component will pre-populate the filter rows on mount

## How It Works

### Component Structure

1. **Filter Button**: Displays active filter count and opens/closes the filter panel
2. **Filter Rows**: Each row contains:
    - **Field Autocomplete**: Select what to filter by (e.g., "ID", "Order ID")
    - **Value Autocomplete**: Select the filter value (e.g., "123", "ORD-001")
    - **Remove Button**: Remove the specific filter row

3. **Actions**:
    - **+ Add a Filter**: Add another filter condition
    - **Clear Filters**: Remove all filters
    - **Apply Filters**: Apply all active filters

### Filter State Management

```typescript
// The component maintains internal state for:
- Filter rows (each with field + value)
- Suggestions for each autocomplete (per row)
- Active filter count (displayed on button)

// Parent component manages:
- Actual filter parameters for API calls
- Dynamic value options based on search terms
- Filter initialization from URL/state
```

## Value Options Format

The `valueOptions` prop accepts two formats:

**Format 1: String Array**

- Direct array of string values: `['123', '456', '789']`

**Format 2: Object Array (from API)**

- Array of objects with `name` property: `[{ name: '123' }, { name: '456' }]`
- The component automatically normalizes object arrays to strings by extracting the `name` property

Both formats can be used in the same `valueOptions` object for different fields.

## Implementation Steps

1. **Define filter options**: Create an array of objects with `label` and `value` properties for each filterable field

2. **Set up state management**:
    - Filter parameters state for API calls
    - Search terms state for dynamic value fetching (if needed)
    - URL parameters for initialization (if needed)

3. **Implement handlers**:
    - `handleApplyFilters`: Extract filter values, build parameters object, trigger data fetching
    - `handleClearFilters`: Reset all filter-related state
    - `handleValueTextChange`: Update search terms for dynamic fetching (optional)

4. **Prepare value options**: If using dynamic values, fetch and memoize the value options object

    The `valueOptions` object should map each field's `value` (from options) to its corresponding list of available values.

    **Example:**

    ```typescript
    // Filter options defined:
    const options = [
        { label: 'ID', value: 'id' },
        { label: 'Order ID', value: 'order_id' },
    ];

    // Value options structure - map field values to their option lists:
    const valueOptions = {
        id: idOptionsList, // Array of ID values
        order_id: orderIdOptionsList, // Array of Order ID values
    };
    ```

    Each field's `value` property becomes a key in `valueOptions`, mapping to an array of possible values for that field.

5. **Initialize from URL**: If needed, extract URL parameters and format as initial filters array

6. **Pass props**: Provide all required and optional props to the component

## Examples in Codebase

- **Orders Table**: `src/pages/transactions/orders/components/OrdersTable.tsx`
- **Quotes Table**: `src/pages/transactions/quotes/components/QuotesTable.tsx`
- **Invoices Table**: `src/pages/transactions/invoices/components/InvoicesTable.tsx`
