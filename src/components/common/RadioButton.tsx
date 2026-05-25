/**
 * RadioButton Component
 *
 * A reusable wrapper around PrimeReact's RadioButton component
 * that provides a consistent design system for the application.
 */

import { RadioButton as PrimeRadioButton } from 'primereact/radiobutton';
import type { RadioButtonChangeEvent } from 'primereact/radiobutton';
import type { ReactNode } from 'react';
import '../../styles/radioButton.css';

export interface RadioButtonOption {
    /** Unique value for the option */
    value: string | number;
    /** Label text to display */
    label: ReactNode;
    /** Whether this option is disabled */
    disabled?: boolean;
    /** Optional icon to display before label */
    icon?: ReactNode;
}

export interface RadioButtonGroupProperties {
    /** Name attribute for the radio group */
    name: string;
    /** Array of radio button options */
    options: RadioButtonOption[];
    /** Currently selected value */
    value: string | number | null;
    /** Callback when selection changes */
    onChange: (value: string | number) => void;
    /** Layout direction (default: 'horizontal') */
    layout?: 'horizontal' | 'vertical';
    /** Custom className for the group container */
    className?: string;
    /** Whether the entire group is disabled */
    disabled?: boolean;
}

export interface RadioButtonProperties {
    /** Input id */
    inputId: string;
    /** Name attribute */
    name: string;
    /** Value of the radio button */
    value: string | number;
    /** Currently selected value */
    checked: boolean;
    /** Label text */
    label?: ReactNode;
    /** Callback when selection changes */
    onChange: (event: RadioButtonChangeEvent) => void;
    /** Whether the radio button is disabled */
    disabled?: boolean;
    /** Custom className */
    className?: string;
    /** Optional icon */
    icon?: ReactNode;
}

/**
 * Single RadioButton Component
 */
export function RadioButton({ inputId, name, value, checked, label, onChange, disabled = false, className = '', icon }: RadioButtonProperties) {
    return (
        <div className={`custom-radio-button ${className} ${disabled ? 'disabled' : ''}`}>
            <PrimeRadioButton inputId={inputId} name={name} value={value} onChange={onChange} checked={checked} disabled={disabled} />
            {(label || icon) && (
                <label htmlFor={inputId} className="radio-label">
                    {icon && <span className="radio-icon">{icon}</span>}
                    {label && <span className="radio-text">{label}</span>}
                </label>
            )}
        </div>
    );
}

/**
 * RadioButtonGroup Component
 * Groups multiple radio buttons together
 */
export function RadioButtonGroup({
    name,
    options,
    value,
    onChange,
    layout = 'horizontal',
    className = '',
    disabled = false,
}: RadioButtonGroupProperties) {
    const handleChange = (event: RadioButtonChangeEvent) => {
        onChange(event.value);
    };

    return (
        <div className={`radio-button-group ${layout} ${className}`}>
            {options.map(option => (
                <RadioButton
                    key={`${name}-${option.value}`}
                    inputId={`${name}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    label={option.label}
                    onChange={handleChange}
                    disabled={disabled || option.disabled}
                    icon={option.icon}
                />
            ))}
        </div>
    );
}
