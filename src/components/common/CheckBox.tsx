/**
 * Reusable Checkbox component using PrimeReact.
 *
 * Features:
 * - Optional label support.
 * - 20x20 size with 4px border radius.
 * - Checked state: bg-brand-primary-500 + border-brand-primary-500.
 * - Unchecked state: bg-white + border-border-gray.
 * - Uses PrimeReact PassThrough API for internal element styling (no CSS file needed).
 */

import { useId, useCallback } from 'react';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';

interface CheckboxProperties {
    label?: string;
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

function Checkbox({ label, checked = false, indeterminate = false, onChange, className = '', disabled = false }: CheckboxProperties) {
    const id = useId();

    // Ref callback - runs when DOM node is created/updated
    const setRootReference = useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                const inputElement = node.querySelector(`input#${id}`) as HTMLInputElement;
                if (inputElement) {
                    inputElement.indeterminate = indeterminate;
                }
            }
        },
        [indeterminate, id]
    );

    return (
        <label
            htmlFor={id}
            className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} select-none ${className}`}
        >
            <div ref={setRootReference}>
                <PrimeCheckbox
                    inputId={id}
                    checked={checked}
                    disabled={disabled}
                    onChange={event => onChange?.(event.checked as boolean)}
                    pt={{
                        root: {
                            className: 'w-5 h-5 flex items-center justify-center',
                        },
                        box: {
                            className: `
                                w-5 h-5 rounded-[4px] border transition-all
                                ${checked || indeterminate ? 'bg-brand-primary-500 border-brand-primary-500' : 'bg-white border-border-gray'}
                            `,
                        },
                        icon: {
                            className: 'text-white text-[12px]',
                        },
                    }}
                />
            </div>

            {label && <span className="text-sm text-primary-text">{label}</span>}
        </label>
    );
}

export default Checkbox;
