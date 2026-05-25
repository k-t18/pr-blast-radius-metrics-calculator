/**
 * MultiSelect Component
 *
 * A reusable multi-select dropdown component built with react-select
 * that provides a consistent design system for the application.
 */

import Select, { type MultiValue, type ActionMeta, type Props as SelectProperties } from 'react-select';
import '../../../styles/multiSelect.css';

export interface MultiSelectOption {
    /** Display label for the option */
    label: string;
    /** Unique value for the option */
    value: string | number;
    /** Whether this option is disabled */
    isDisabled?: boolean;
}

export interface MultiSelectProperties {
    /** Unique identifier for the multi-select field */
    id: string;
    /** Name attribute for the multi-select */
    name: string;
    /** Array of currently selected options */
    value: MultiSelectOption[];
    /** Callback when selection changes */
    onChange: (value: MultiSelectOption[], name: string) => void;
    /** Array of available options */
    options: MultiSelectOption[];
    /** Label text to display above the multi-select */
    label?: string;
    /** Placeholder text when no options are selected */
    placeholder?: string;
    /** Error message to display */
    error?: string;
    /** Helper text to display below the multi-select */
    helperText?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Whether to show search/filter functionality */
    isSearchable?: boolean;
    /** Whether to close menu on selection */
    closeMenuOnSelect?: boolean;
    /** Maximum number of selections allowed */
    maxSelections?: number;
    /** Custom className for the container */
    className?: string;
    /** Custom className for the select element */
    selectClassName?: string;
    /** Custom styles for react-select */
    customStyles?: SelectProperties<MultiSelectOption, true>['styles'];
    /** Whether to hide selected options from the menu */
    hideSelectedOptions?: boolean;
    /** Text to show when no options available */
    noOptionsMessage?: string;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * MultiSelect Component
 *
 * A customizable multi-select dropdown with support for tags, search, and validation.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   id="countries"
 *   name="countries"
 *   label="Select Countries"
 *   value={selectedCountries}
 *   onChange={(selected) => setSelectedCountries(selected)}
 *   options={countryOptions}
 *   placeholder="Choose countries..."
 * />
 * ```
 */
function MultiSelect({
    id,
    name,
    value,
    onChange,
    options,
    label,
    placeholder = 'Select...',
    error,
    helperText,
    required = false,
    disabled = false,
    isSearchable = true,
    closeMenuOnSelect = false,
    maxSelections,
    className = '',
    selectClassName = '',
    customStyles,
    hideSelectedOptions = false,
    noOptionsMessage = 'No options available',
    isLoading = false,
}: MultiSelectProperties) {
    const handleChange = (newValue: MultiValue<MultiSelectOption>, _actionMeta: ActionMeta<MultiSelectOption>) => {
        const selectedOptions = newValue as MultiSelectOption[];

        // Check max selections limit
        if (maxSelections && selectedOptions.length > maxSelections) {
            return;
        }

        onChange(selectedOptions, name);
    };

    const hasError = Boolean(error);
    const showHelperText = Boolean(helperText && !error);
    const isMaxReached = maxSelections ? value.length >= maxSelections : false;

    // Minimal style overrides to apply color tokens (CSS handles most styling)
    const defaultStyles: SelectProperties<MultiSelectOption, true>['styles'] = {
        control: (base, state) => {
            let borderColor = 'var(--color-gray-600)';

            if (hasError) {
                borderColor = 'var(--color-danger-500)';
            } else if (state.isFocused) {
                borderColor = 'var(--color-brand-500)';
            }

            const hoverBorderColor = hasError ? 'var(--color-danger-500)' : 'var(--color-brand-500)';

            return {
                ...base,
                borderColor,
                boxShadow: 'none',
                '&:hover': {
                    borderColor: hoverBorderColor,
                },
            };
        },
        multiValue: base => ({
            ...base,
            backgroundColor: 'var(--color-brand-50)',
        }),
        multiValueRemove: base => ({
            ...base,
            color: 'var(--color-text-black)',
            ':hover': {
                backgroundColor: 'var(--color-brand-50)',
                color: 'var(--color-text-black)',
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? 'var(--color-brand-50)' : 'transparent',
            color: state.isSelected ? 'var(--color-brand-700)' : 'var(--color-text-black)',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: state.isSelected ? 'var(--color-brand-50)' : 'var(--color-gray-200)',
            },
            ':active': {
                backgroundColor: state.isSelected ? 'var(--color-brand-100)' : 'var(--color-gray-300)',
            },
        }),
    };

    const mergedStyles = customStyles ? { ...defaultStyles, ...customStyles } : defaultStyles;

    return (
        <div className={`multi-select-container ${className} ${hasError ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
            {/* Label */}
            {label && (
                <label htmlFor={id} className="multi-select-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            {/* Multi-Select */}
            <Select
                inputId={id}
                name={name}
                value={value}
                onChange={handleChange}
                options={options}
                isMulti
                isDisabled={disabled || isMaxReached}
                isSearchable={isSearchable}
                isLoading={isLoading}
                closeMenuOnSelect={closeMenuOnSelect}
                hideSelectedOptions={hideSelectedOptions}
                placeholder={isMaxReached ? `Maximum ${maxSelections} selections reached` : placeholder}
                className={`multi-select ${selectClassName} ${hasError ? 'multi-select--error' : ''} ${disabled ? 'multi-select--disabled' : ''}`}
                classNamePrefix="multi-select"
                styles={mergedStyles}
                noOptionsMessage={() => noOptionsMessage}
                aria-invalid={hasError}
            />

            {/* Max Selections Warning */}
            {maxSelections && value.length >= maxSelections && (
                <small className="max-selection-message">
                    Maximum {maxSelections} selection{maxSelections > 1 ? 's' : ''} reached
                </small>
            )}

            {/* Error Message */}
            {error && (
                <small id={`${id}-error`} className="error-message">
                    {error}
                </small>
            )}

            {/* Helper Text */}
            {showHelperText && (
                <small id={`${id}-helper`} className="helper-text">
                    {helperText}
                </small>
            )}
        </div>
    );
}

export default MultiSelect;
