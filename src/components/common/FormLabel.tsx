import '../../styles/inputField.css';

interface FormLabelProperties {
    id?: string;
    label?: string;
    required?: boolean;
    className?: string;
}

export default function FormLabel({ id, label, required = false, className = '' }: FormLabelProperties) {
    return (
        <label htmlFor={id} className={`input-field-label ${className}`}>
            {label}
            {required && <span className="required-indicator">*</span>}
        </label>
    );
}
