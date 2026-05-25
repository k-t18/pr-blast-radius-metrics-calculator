import { useState } from 'react';
import { Eye, EyeOff } from '../../icons';
import InputField, { type InputFieldProperties } from '../inputField/InputField';

type PasswordFieldProperties = Omit<InputFieldProperties, 'type' | 'suffixIcon'>;

/**
 * Password input with built-in show/hide toggle, reusing the base InputField.
 */
export default function PasswordField({ value, onChange, name, ...restProperties }: PasswordFieldProperties) {
    const [visible, setVisible] = useState(false);

    return (
        <InputField
            {...restProperties}
            type={visible ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={onChange}
            suffixIcon={
                <button
                    type="button"
                    className="password-toggle"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    onClick={() => setVisible(previous => !previous)}
                >
                    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            }
        />
    );
}
