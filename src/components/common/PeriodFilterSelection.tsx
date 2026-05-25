import { useMemo } from 'react';
import Select, { type SingleValue, type StylesConfig } from 'react-select';
import { Colors } from '../../styles/tokens/colors';
import FormLabel from './FormLabel';

interface DropdownOption {
    label: string;
    value: number;
}

// Styles configuration for React Select to match the application theme
const customStyles: StylesConfig<DropdownOption, false> = {
    control: (base, state) => ({
        ...base,
        minHeight: '40px',
        borderRadius: '0.375rem',
        borderColor: state.isFocused ? Colors.brand[500] : Colors.gray[600],
        boxShadow: state.isFocused ? `0 0 0 1px ${Colors.brand[500]}` : 'none',
        fontFamily: 'var(--font-poppins)',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '22px',
        cursor: 'pointer',
        color: Colors.text.black,
        '&:hover': {
            borderColor: Colors.gray[600],
        },
    }),
    singleValue: base => ({
        ...base,
        fontFamily: 'var(--font-poppins)',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '22px',
        cursor: 'pointer',
        color: Colors.text.black,
    }),
    option: (base, state) => {
        const getBackgroundColor = (): string => {
            if (state.isSelected) return Colors.brand[500];
            if (state.isFocused) return Colors.brand[50];
            return Colors.text.white;
        };
        const backgroundColor = getBackgroundColor();
        return {
            ...base,
            fontFamily: 'var(--font-poppins)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '22px',
            backgroundColor,
            color: state.isSelected ? Colors.text.white : Colors.text.black,
            cursor: 'pointer',
            '&:active': {
                backgroundColor: Colors.brand[500],
                color: Colors.text.white,
            },
        };
    },
    menu: base => ({
        ...base,
        fontFamily: 'var(--font-poppins)',
        fontSize: '14px',
        cursor: 'pointer',
    }),
};

interface PeriodFilterDropdownProperties {
    periodData: { label: string; numeric_days: number }[];
    selectedValue?: number;
    onChange: (value: number | undefined) => void;
    className?: string;
}

export function PeriodFilterSelection({ periodData, selectedValue, onChange, className }: PeriodFilterDropdownProperties) {
    const options: DropdownOption[] = useMemo(
        () =>
            periodData.map(period => ({
                label: period.label,
                value: period.numeric_days,
            })),
        [periodData]
    );

    const currentOption = useMemo(() => options.find(opt => opt.value === selectedValue) || null, [options, selectedValue]);

    const handleChange = (newValue: SingleValue<DropdownOption>) => {
        onChange(newValue?.value);
    };

    return (
        <div className={`flex items-center justify-end ${className}`}>
            <div className="me-2">
                <FormLabel label="Select Filter" className="text-[14px]" />
            </div>
            <div style={{ width: '200px' }}>
                <Select
                    options={options}
                    value={currentOption}
                    onChange={handleChange}
                    placeholder="Select Filter"
                    isDisabled={options.length === 0}
                    classNamePrefix="react-select"
                    styles={customStyles}
                />
            </div>
        </div>
    );
}
