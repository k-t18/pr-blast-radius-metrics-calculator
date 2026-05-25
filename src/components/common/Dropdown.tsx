/**
 * A clean, reusable dropdown component built on top of PrimeReact's `<Dropdown>`.
 * Supports both controlled and uncontrolled usage, with consistent styling
 * matching the InputField component.
 *
 * @component
 * @param {string} [label] - Optional label displayed above the dropdown.
 * @param {DropdownOption[]} options - Array of dropdown options with `label` and `value`.
 * @param {DropdownOption} [value] - Controlled selected value.
 * @param {string} [placeholder='Select'] - Placeholder text when no option is selected.
 * @param {(value: DropdownOption | undefined) => void} [onChange] - Callback fired on selection change.
 * @param {string} [error] - Error message to display.
 * @param {boolean} [required=false] - Whether the field is required.
 * @param {boolean} [disabled=false] - Whether the field is disabled.
 * @param {string} [width='150px'] - Dropdown width.
 * @param {string} [className] - Additional CSS classes.
 *
 */

import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { useState } from 'react';
import FormLabel from './FormLabel';
import '../../styles/inputField.css';
import '../../styles/dropdown.css';

export interface DropdownOption {
    label: string;
    value: string | number;
}

export interface CustomDropdownProperties {
    id?: string;
    label?: string;
    options: DropdownOption[];
    value?: DropdownOption | undefined;
    placeholder?: string;
    onChange?: (value: DropdownOption | undefined) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    width?: string;
    className?: string;
    labelClassName?: string;
    dropDownClass?: string;
}

export function CustomDropdown({
    id,
    label,
    options,
    value: controlledValue,
    placeholder = 'Select',
    onChange,
    error,
    required = false,
    disabled = false,
    width = '150px',
    className = '',
    labelClassName = '',
    dropDownClass = '',
}: CustomDropdownProperties) {
    const [internalValue, setInternalValue] = useState<DropdownOption | undefined>(controlledValue || undefined);
    const selectedValue = controlledValue ?? internalValue;

    const handleChange = (event: DropdownChangeEvent) => {
        setInternalValue(event.value);
        onChange?.(event.value);
    };

    const hasError: boolean = Boolean(error);

    return (
        <div
            className={`input-field-container dropdown-container ${className} ${hasError ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}
            style={{ width }}
        >
            {/* Label */}
            {label && <FormLabel id={id} label={label} required={required} className={labelClassName} />}

            {/* Dropdown */}
            <Dropdown
                value={selectedValue}
                onChange={handleChange}
                options={options}
                optionLabel="label"
                placeholder={placeholder}
                disabled={disabled}
                className={`dropdown-field rounded-sm! ${dropDownClass} ${hasError ? 'p-invalid' : ''}`}
                panelClassName="dropdown-panel rounded-sm! text-gray-800! text-xs!"
            />

            {/* Error Message */}
            {error && <small className="error-message">{error}</small>}
        </div>
    );
}
