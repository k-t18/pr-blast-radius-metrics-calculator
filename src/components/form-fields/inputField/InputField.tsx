/**
 * InputField Component
 *
 * A reusable input field component that provides a consistent
 * design system for form inputs across the application.
 */

import { InputText } from 'primereact/inputtext';
import type { ReactNode, InputHTMLAttributes } from 'react';
import '../../../styles/inputField.css';

export interface InputFieldProperties extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    /** Unique identifier for the input field */
    id: string;
    /** Name attribute for the input */
    name: string;
    /** Current value of the input */
    value: string | number;
    /** Callback when input value changes */
    onChange: (value: string, name: string) => void;
    /** Type of input field (default: 'text') */
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    /** Label text to display above the input */
    label?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Error message to display */
    error?: string;
    /** Helper text to display below the input */
    helperText?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Whether the field is read-only */
    readOnly?: boolean;
    /** Icon to display at the start of the input */
    prefixIcon?: ReactNode;
    /** Icon to display at the end of the input */
    suffixIcon?: ReactNode;
    /** Custom className for the container */
    className?: string;
    /** Custom className for the input element */
    inputClassName?: string;
    /** Maximum length of input */
    maxLength?: number;
    /** Minimum length of input */
    minLength?: number;
    /** Pattern for validation (regex) */
    pattern?: string;
    /** Autocomplete attribute */
    autoComplete?: string;
    /** Whether to autofocus on mount */
    autoFocus?: boolean;
}

/**
 * InputField Component
 *
 * A customizable input field with label, error handling, and icon support.
 *
 * @example
 * ```tsx
 * <InputField
 *   id="email"
 *   name="email"
 *   type="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={(value) => setEmail(value)}
 *   placeholder="Enter your email"
 *   required
 *   error={emailError}
 * />
 * ```
 */
function InputField({
    id,
    name,
    value,
    onChange,
    type = 'text',
    label,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    prefixIcon,
    suffixIcon,
    className = '',
    inputClassName = '',
    maxLength,
    minLength,
    pattern,
    autoComplete,
    autoFocus = false,
    ...restProperties
}: InputFieldProperties) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, name);
    };

    const hasError: boolean = Boolean(error);
    const showHelperText: boolean = Boolean(helperText && !error);
    // const describedBy: string | undefined = hasError ? `${id}-error` : showHelperText ? `${id}-helper` : undefined;

    return (
        <div className={`input-field-container ${className} ${hasError ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
            {/* Label */}
            {label && (
                <label htmlFor={id} className="input-field-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            {/* Input Wrapper */}
            <div className={`input-wrapper ${prefixIcon ? 'has-prefix' : ''} ${suffixIcon ? 'has-suffix' : ''}`}>
                {/* Prefix Icon */}
                {prefixIcon && <span className="input-icon input-prefix-icon">{prefixIcon}</span>}

                {/* Input Field */}
                <InputText
                    id={id}
                    name={name}
                    type={type}
                    value={String(value)}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    className={`input-field ${inputClassName} ${hasError ? 'p-invalid' : ''}`}
                    aria-invalid={hasError}
                    {...restProperties}
                />

                {/* Suffix Icon */}
                {suffixIcon && <span className="input-icon input-suffix-icon">{suffixIcon}</span>}
            </div>

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

export default InputField;
