'use client';

import { InputNumber } from 'primereact/inputnumber';
import { CaretUp, CaretDown } from '../../../../../../../components/icons';
import '../../../../../../../styles/mobileSponsorshipStyles/quantityInput.css';

interface QuantityInputProperties {
    value: string | number;
    onChange: (value: string | number) => void;
    onIncrement: () => void;
    onDecrement: () => void;
    label?: string;
    maxValue?: number;
    disabled?: boolean;
}

export default function QuantityInputIncreaseDecrese({
    value,
    onChange,
    onIncrement,
    onDecrement,
    label = 'How many Squares would you like to Sponsor?',
    maxValue,
    disabled = false,
}: QuantityInputProperties) {
    const numberValue = Number(value) || 1;
    const isDecrementDisabled = numberValue <= 1 || disabled;
    const isIncrementDisabled = maxValue ? numberValue >= maxValue : false || disabled;

    return (
        <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="quantity-input-label text-sm font-medium text-gray-700">{label || 'text'}</label>
            <div className="flex items-center w-fit border border-gray-300 rounded-md">
                <InputNumber
                    value={numberValue}
                    onValueChange={event => onChange(event.value || 1)}
                    min={1}
                    max={maxValue}
                    disabled={disabled}
                    useGrouping={false}
                    className="quantity-input"
                    inputClassName="!rounded-r-none !border-r-0"
                />
                <div className="quantity-input-buttons">
                    <button
                        type="button"
                        onClick={onIncrement}
                        className="quantity-input-button"
                        disabled={isIncrementDisabled}
                        aria-label="Increment"
                    >
                        <CaretUp size={16} color="#374151" />
                    </button>
                    <button
                        type="button"
                        onClick={onDecrement}
                        className="quantity-input-button"
                        disabled={isDecrementDisabled}
                        aria-label="Decrement"
                    >
                        <CaretDown size={16} color="#374151" />
                    </button>
                </div>
            </div>
        </div>
    );
}
