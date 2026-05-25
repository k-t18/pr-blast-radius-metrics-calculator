import { Calendar } from 'primereact/calendar';
import FormLabel from './FormLabel';
import '../../styles/dateInput.css';

interface DateInputProperties {
    id: string;
    name: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    showIcon?: boolean;
    dateFormat?: string;
}

export default function DateInput({
    id,
    name,
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    className = '',
    labelClassName = '',
    placeholder,
    minDate,
    maxDate,
    showIcon = true,
    dateFormat = 'dd-mm-yy',
}: DateInputProperties) {
    // Convert string value to Date object for PrimeReact Calendar
    const dateValue = value ? new Date(value) : undefined;

    const handleChange = (event: { value: Date | Date[] | null | undefined }) => {
        const selectedDate = event.value as Date | null | undefined;
        if (selectedDate) {
            // Format date as YYYY-MM-DD string
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
        } else {
            onChange('');
        }
    };

    return (
        <div className={`date-input-container ${className}`}>
            {label && <FormLabel id={id} label={label} required={required} className={labelClassName} />}
            <div className="date-input-wrapper">
                <Calendar
                    id={id}
                    name={name}
                    value={dateValue}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder}
                    minDate={minDate}
                    maxDate={maxDate}
                    showIcon={showIcon}
                    dateFormat={dateFormat}
                    className="date-input"
                    inputId={id}
                />
            </div>
        </div>
    );
}
