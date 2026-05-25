import { useState, useEffect } from 'react';
import Checkbox from '../../../../../../../components/common/CheckBox';
import InputField from '../../../../../../../components/form-fields/inputField/InputField';

interface Ranking {
    id: string;
    position: number;
    unitSalesPrice: number;
    rewardValue: number;
    minReward: number;
    isSelected: boolean;
    status: 'Available' | 'Booked';
}

interface RankingRowProperties {
    ranking: Ranking;
    onToggle: (position: number) => void;
    onRewardChange: (position: number, value: string) => void;
}

function RankingRow({ ranking, onToggle, onRewardChange }: RankingRowProperties) {
    const [inputValue, setInputValue] = useState(ranking.rewardValue.toLocaleString());

    // Sync local state when rewardValue changes externally
    useEffect(() => {
        setInputValue(ranking.rewardValue.toLocaleString());
    }, [ranking.rewardValue]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        onRewardChange(ranking.position, value);
    };

    const isBooked = ranking.status === 'Booked';
    const isInvalid = ranking.rewardValue < ranking.minReward;

    return (
        <div className={`ranking-row ${isBooked ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="ranking-row-field">
                <Checkbox checked={ranking.isSelected} onChange={() => onToggle(ranking.position)} className="ranking-checkbox" disabled={isBooked} />
            </div>
            <div className="ranking-row-field">
                <span className="ranking-position">#{ranking.position}</span>
            </div>
            <div className="ranking-row-field">
                <span className="ranking-unit-price">₦ {ranking.unitSalesPrice.toLocaleString()}</span>
            </div>
            <div className="ranking-row-field">
                <div className="ranking-reward-field-wrapper">
                    <InputField
                        id={`reward-${ranking.id}`}
                        name={`reward-${ranking.id}`}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="ranking-reward-input"
                        inputClassName={isInvalid ? '!border-red-500 !text-red-600 focus:!border-red-500' : 'bg-white'}
                        disabled={!ranking.isSelected || isBooked}
                        prefixIcon={<span className="ranking-currency-prefix-icon">₦</span>}
                    />
                    <span className={`ranking-minimum ${isInvalid ? '!text-red-500' : ''}`}>Minimum ₦ {ranking.minReward.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

interface RankingsTableProperties {
    rankings: Ranking[];
    allSelected: boolean;
    someSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onToggle: (position: number) => void;
    onRewardChange: (position: number, value: string) => void;
}

export default function RankingsTable({ rankings, allSelected, someSelected, onSelectAll, onToggle, onRewardChange }: RankingsTableProperties) {
    return (
        <div className="leaderboard-rankings-section mt-6">
            <h3 className="leaderboard-rankings-title">Select Rankings to Sponsor</h3>
            <div className="leaderboard-rankings-table">
                <div className="leaderboard-rankings-table-header">
                    <div className="leaderboard-rankings-header-checkbox">
                        <Checkbox
                            checked={allSelected}
                            indeterminate={!allSelected && someSelected}
                            onChange={checked => onSelectAll(!!checked)}
                            className="ranking-checkbox"
                        />
                    </div>
                    <span className="leaderboard-rankings-header-label">Rankings</span>
                    <span className="leaderboard-rankings-header-label">Unit Sales Price</span>
                    <span className="leaderboard-rankings-header-label">Reward Value</span>
                </div>

                {rankings.map(ranking => (
                    <RankingRow key={ranking.id} ranking={ranking} onToggle={onToggle} onRewardChange={onRewardChange} />
                ))}
            </div>
        </div>
    );
}
