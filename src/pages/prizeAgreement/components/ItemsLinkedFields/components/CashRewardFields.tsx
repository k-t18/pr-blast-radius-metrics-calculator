import InputField from '../../../../../components/form-fields/inputField/InputField';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface CashRewardFieldsProperties {
    itemId: string;
    playersCount: number;
    amountPerPlayer: number;
    onPlayersCountChange: (value: number) => void;
    minPlayersCount?: number;
}

function CashRewardFields({ itemId, playersCount, amountPerPlayer, onPlayersCountChange, minPlayersCount = 0 }: CashRewardFieldsProperties) {
    const handlePlayersCountChange = (value: string | number) => {
        const numberValue = Number(value) || 0;
        onPlayersCountChange(numberValue);
    };

    const handlePlayersCountBlur = () => {
        if (minPlayersCount > 0 && playersCount < minPlayersCount) {
            onPlayersCountChange(minPlayersCount);
        }
    };

    const isInvalid = minPlayersCount > 0 && playersCount < minPlayersCount;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col gap-1">
                <InputField
                    id={`players-${itemId}`}
                    name={`players-${itemId}`}
                    type="number"
                    label="Between how many players would you like to split this amount?"
                    value={playersCount}
                    onChange={handlePlayersCountChange}
                    onBlur={handlePlayersCountBlur}
                    inputClassName="max-w-[173px]"
                    min={minPlayersCount}
                    required
                />
                {isInvalid && <span className="text-xs text-red-600">Players count must be {minPlayersCount} or more.</span>}
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-gray-700">Each player gets</div>
                <div className="text-xl font-semibold text-gray-900">₦ {formatCurrency(amountPerPlayer)}</div>
            </div>
        </div>
    );
}

export default CashRewardFields;
