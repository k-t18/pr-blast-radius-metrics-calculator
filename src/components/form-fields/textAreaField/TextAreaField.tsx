/**
 * TextAreaField Component
 *
 * A reusable textarea field component that provides a consistent
 * design system for textarea inputs across the application.
 */

import type { TextareaHTMLAttributes } from 'react';
import '../../../styles/inputField.css';

export interface TextAreaFieldProperties extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    /** Unique identifier for the textarea field */
    id: string;
    /** Name attribute for the textarea */
    name: string;
    /** Current value of the textarea */
    value: string | number;
    /** Callback when textarea value changes */
    onChange: (value: string, name: string) => void;
    /** Label text to display above the textarea */
    label?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Error message to display */
    error?: string;
    /** Helper text to display below the textarea */
    helperText?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Whether the field is read-only */
    readOnly?: boolean;
    /** Custom className for the container */
    className?: string;
    /** Custom className for the textarea element */
    textAreaClassName?: string;
    /** Number of rows (default: 3) */
    rows?: number;
    /** Number of columns */
    cols?: number;
    /** Maximum length of input */
    maxLength?: number;
    /** Minimum length of input */
    minLength?: number;
}

/**
 * TextAreaField Component
 *
 * A customizable textarea field with label, error handling, and consistent styling.
 *
 * @example
 * ```tsx
 * <TextAreaField
 *   id="description"
 *   name="description"
 *   label="Description"
 *   value={description}
 *   onChange={(value) => setDescription(value)}
 *   placeholder="Enter description"
 *   required
 *   error={descriptionError}
 *   rows={4}
 * />
 * ```
 */
function TextAreaField({
    id,
    name,
    value,
    onChange,
    label,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    className = '',
    textAreaClassName = '',
    rows = 3,
    cols,
    maxLength,
    minLength,
    ...restProperties
}: TextAreaFieldProperties) {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value, name);
    };

    const hasError: boolean = Boolean(error);
    const showHelperText: boolean = Boolean(helperText && !error);

    return (
        <div className={`input-field-container ${className} ${hasError ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
            {/* Label */}
            {label && (
                <label htmlFor={id} className="input-field-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            {/* Textarea Field */}
            <textarea
                id={id}
                name={name}
                value={String(value)}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                rows={rows}
                cols={cols}
                maxLength={maxLength}
                minLength={minLength}
                className={`${textAreaClassName} ${hasError ? 'p-invalid' : ''}`}
                aria-invalid={hasError}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...restProperties}
            />

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

export default TextAreaField;
