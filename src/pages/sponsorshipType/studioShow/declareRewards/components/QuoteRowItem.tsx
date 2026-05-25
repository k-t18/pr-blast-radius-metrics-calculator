import SquareCard from '../../../../../components/cards/SquareCard';
import { CurrencySymbol } from '../../../../../components/common/CurrencySymbol';
import DescriptionText from '../../../../../components/common/DescriptionText';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { SelectedSquare } from '../../../../../hooks/studioShow/useDeclaredReward';

interface QuoteRowItemProperties {
    square: SelectedSquare;
    rewardValue?: number;
    errorMessage?: string;
    onRewardValueChange: (value: string) => void;
}

function QuoteRowItem({ square, rewardValue, errorMessage, onRewardValueChange }: QuoteRowItemProperties) {
    const hasError = Boolean(errorMessage);
    const inputBorderColor = hasError ? 'border-red-500' : 'border-gray-300';

    return (
        <div className="grid grid-cols-12 items-start">
            {/* Left Box */}
            <div className="col-span-7 flex gap-4">
                <SquareCard
                    number={square?.square_lable}
                    usp={formatCurrency(square.usp)}
                    rv={formatCurrency(square.rv)}
                    status="selected"
                    className="w-26.5! h-26.5!"
                />

                <div className="flex flex-col gap-2">
                    <HeaderTitle
                        // text={`Square ${square.id} - ${square.type}`}
                        text={`Square - ${square.type}`}
                        size="md"
                        color="text-primary-text"
                        weight="medium"
                        className="capitalize"
                    />
                    <div className="flex items-center gap-1">
                        <DescriptionText text={`Minimum Reward Value: `} size="xs" color="text-primary-text" weight="normal" />
                        <CurrencySymbol className="text-xs text-primary-text" />
                        <DescriptionText text={formatCurrency(square.rv)} size="xs" color="text-primary-text" weight="normal" />
                    </div>
                </div>
            </div>

            {/* Unit Price */}
            <div className="col-span-3 flex items-center gap-1">
                <CurrencySymbol className="text-xs text-primary-text" />
                <DescriptionText text={formatCurrency(square.usp)} size="xs" color="text-primary-text" weight="normal" />
            </div>

            {/* Reward Input */}
            <div className="col-span-2 flex flex-col gap-2">
                <input
                    type="number"
                    placeholder="Enter Reward Value"
                    value={rewardValue === undefined ? '' : rewardValue.toString()}
                    onChange={event => onRewardValueChange(event.target.value)}
                    className={`w-full border ${inputBorderColor} rounded-md px-3 py-2 text-sm`}
                />
                {hasError && errorMessage ? (
                    <DescriptionText text={errorMessage} size="xxs" color="text-red-600" weight="normal" />
                ) : (
                    <div className="flex items-center gap-1">
                        <DescriptionText text={`Minimum `} size="xxs" color="text-secondary-text" weight="normal" />
                        <CurrencySymbol className="text-[10px] text-secondary-text" />
                        <DescriptionText text={formatCurrency(square.rv)} size="xxs" color="text-secondary-text" weight="normal" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuoteRowItem;
