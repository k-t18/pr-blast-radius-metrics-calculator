import type { DropdownOption } from '../../components/common/Dropdown';
import type { MultiSelectOption } from '../../components/form-fields/multiSelect';
import type { RadioButtonOption } from '../../components/common/RadioButton';

/**
 * Represents a single filter option in a hierarchical filter structure.
 * Options can have nested children for multi-level filtering.
 */
export interface FilterOption {
    /** Unique identifier for the option */
    id: string;
    /** Display label for the option */
    label: string;
    /** Nested child options (for hierarchical filtering) */
    children?: FilterOption[];
    /** Whether this option is a subsection header */
    isSubSection?: boolean;
    /** Type of input control to render */
    inputType?: 'checkbox' | 'dropdown' | 'multiselect' | 'radio';
    /** Options for dropdown input type */
    dropdownOptions?: DropdownOption[];
    /** Options for multiselect input type */
    multiselectOptions?: MultiSelectOption[];
    /** Options for radio input type */
    radioOptions?: RadioButtonOption[];
}

/**
 * Represents a section of filters, containing a title, subtitle, and options.
 */
export interface FilterSection {
    /** Unique identifier for the section */
    id: string;
    /** Section title (main heading) */
    title: string;
    /** Section subtitle (description) */
    subtitle: string;
    /** Array of filter options within this section */
    options: FilterOption[];
}

/**
 * Configuration options for the hierarchical filter logic hook
 * @template TFieldValues - Type for field values, defaults to Record<string, unknown>
 */
export interface HierarchicalFilterConfig<TFieldValues extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * CONTROLLED MODE: External state and setters
     * When provided, the hook uses these instead of internal state
     */
    controlledState?: {
        selectedFilters: Set<string>;
        setSelectedFilters: (value: Set<string> | ((previous: Set<string>) => Set<string>)) => void;
        fieldValues: TFieldValues;
        setFieldValues: (value: TFieldValues | ((previous: TFieldValues) => TFieldValues)) => void;
    };

    /**
     * UNCONTROLLED MODE: Initial values (only used if controlledState is not provided)
     */
    initialSelectedFilters?: Set<string>;
    initialFieldValues?: TFieldValues;

    /** Callback when selected filters change (works in both modes) */
    onSelectedFiltersChange?: (filters: Set<string>) => void;
    /** Callback when field values change (works in both modes) */
    onFieldValuesChange?: (fieldValues: TFieldValues) => void;
    /** Callback when all fields become empty (works in both modes) */
    onEmpty?: () => void;
}

/**
 * Return type for the useHierarchicalFilterLogic hook
 * @template TFieldValues - Type for field values, defaults to Record<string, unknown>
 */
export interface HierarchicalFilterState<TFieldValues extends Record<string, unknown> = Record<string, unknown>> {
    // State values
    selectedFilters: Set<string>;
    fieldValues: TFieldValues;
    expandedSections: Set<string>;
    expandedOptions: Set<string>;

    // State setters
    setSelectedFilters: (value: Set<string> | ((previous: Set<string>) => Set<string>)) => void;
    setFieldValues: (value: TFieldValues | ((previous: TFieldValues) => TFieldValues)) => void;

    // Filter logic functions
    getAllDescendantIds: (option: FilterOption) => string[];
    findParentOptions: (targetId: string, options: FilterOption[], parents?: FilterOption[]) => FilterOption[];
    isOptionFullySelected: (option: FilterOption) => boolean;
    isOptionPartiallySelected: (option: FilterOption) => boolean;
    handleFilterChange: (option: FilterOption, checked: boolean) => void;

    // UI state handlers
    toggleSection: (sectionId: string) => void;
    toggleOption: (optionId: string) => void;

    // Utility functions
    clearAll: () => void;
    hasSelections: boolean;
}
