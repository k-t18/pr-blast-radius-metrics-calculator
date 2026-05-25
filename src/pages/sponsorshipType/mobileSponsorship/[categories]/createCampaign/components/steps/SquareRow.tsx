import { useState, useEffect } from 'react';
import InputField from '../../../../../../../components/form-fields/inputField/InputField';
import { Cross } from '../../../../../../../components/icons';
import type { SquareData } from '../../context/createCampaignContext';
import '../../../../../../../styles/mobileSponsorshipStyles/squareRow.css';

interface SquareRowProperties {
    square: SquareData;
    onRemove: () => void;
    onChange: (field: keyof SquareData, value: string | number) => void;
}

export default function SquareRow({ square, onRemove, onChange }: SquareRowProperties) {
    // Use local state for input value to improve performance
    const [inputValue, setInputValue] = useState((square.rewardValue || 0).toLocaleString());

    // Sync local state when square.rewardValue changes externally
    useEffect(() => {
        setInputValue((square.rewardValue || 0).toLocaleString());
    }, [square.rewardValue]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        const parsed = Number.parseInt(value.replaceAll(',', ''), 10) || 0;
        onChange('rewardValue', parsed);
    };

    const isInvalid = (square.rewardValue || 0) < (square.minReward || 0);

    return (
        <div className="square-row">
            <div className="square-row-field">
                <span className="square-row-value">{square.squareType}</span>
            </div>
            <div className="square-row-field">
                <span className="square-row-value">{square.row}</span>
            </div>
            {/* <div className="square-row-field">
                <span className="square-row-value">₦ {square.unitSalesPrice.toLocaleString()}</span>
            </div> */}
            <div className="square-row-field">
                <div className="flex flex-col w-full">
                    <InputField
                        id={`reward-${square.id}`}
                        name={`reward-${square.id}`}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="square-row-input"
                        inputClassName={isInvalid ? '!border-red-500 !text-red-600 focus:!border-red-500' : ''}
                    />
                    <span className={`square-row-minimum ${isInvalid ? '!text-red-500' : ''}`}>Minimum ₦ {square.minReward.toLocaleString()}</span>
                </div>
            </div>
            <div className="square-row-field">
                <button type="button" className="square-row-remove" onClick={onRemove}>
                    <Cross size={16} color="var(--color-text-black)" />
                </button>
            </div>
        </div>
    );
}
