import { useNavigate } from 'react-router-dom';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import DescriptionText from '../../../../components/common/DescriptionText';
import BackButton from '../../../../components/common/BackButton';
import { Plus, ShoppingCart } from '../../../../components/icons';
import ActionButton from '../../../../components/common/ActionButton';
import StatusBadge from '../../../../components/common/StatusBadge';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import QuoteRowItem from './components/QuoteRowItem';
import { dateDashFormat, time12hFormat } from '../../../../utils/dateUtils';
import { formatCurrency } from '../../../../utils/formatCurrency';
import useDeclaredReward from '../../../../hooks/studioShow/useDeclaredReward';
import LinkButton from '../../../../components/common/LinkButton';

function DeclareRewardPage() {
    const navigate = useNavigate();
    const {
        squares,
        rewardValues,
        rewardErrors,
        totals,
        allRewardsValid,
        handleRewardValueChange,
        handleAddToCart: handleAddToCartInternal,
        hasNoSquares,
        episodeName,
        episodeDetails,
    } = useDeclaredReward();

    // Handle Add to Cart with navigation
    const handleAddToCart = () => {
        handleAddToCartInternal();
        navigate('/cart');
    };

    // Redirect to select squares if no squares are selected
    if (hasNoSquares) {
        // Optionally redirect after a brief delay or show message
        return (
            <div className="flex flex-col gap-6 pb-2">
                <BackButton />
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="No squares selected. Please select squares first." color="text-secondary-text" size="md" />
                </div>
            </div>
        );
    }

    // Determine episode details text
    let episodeDetailsText: string;
    if (episodeDetails) {
        episodeDetailsText = `Episode Details: ${episodeDetails.name}, ${dateDashFormat(episodeDetails.episode_date)} | ${time12hFormat(new Date(`${episodeDetails.episode_date}T${episodeDetails.episode_time}`))}`;
    } else if (episodeName) {
        episodeDetailsText = `Episode Details: ${episodeName}`;
    } else {
        episodeDetailsText = 'Episode Details: Not specified';
    }

    return (
        <div className="flex flex-col gap-6 pb-2">
            <BackButton />

            <div className="flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Quote Reward for Selected Squares" size="2xl" color="text-primary-text" weight="medium" />

                    <DescriptionText text="Enter the reward amount you'd like to allocate for each selected square." size="sm" weight="medium" />
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center h-fit gap-4">
                        <DescriptionText text="Time remaining:" size="sm" color="text-primary-text" weight="medium" />
                        <StatusBadge
                            label="00:29 mins"
                            statusKey="rejected"
                            icon={undefined}
                            showIcon={false}
                            className="p-2! text-danger-600! font-medium!"
                        />
                    </div>
                </div>
            </div>

            {/* Sponsorship Details */}
            <div className="border border-border-gray-600 rounded-lg p-4 flex flex-col gap-2">
                <HeaderTitle text="Sponsorship Details" size="md" weight="medium" />
                <div className="flex flex-col">
                    <DescriptionText text="Type: Studio Show" size="xs" color="text-primary-text" className="p-2" />
                    <DescriptionText text={episodeDetailsText} size="xs" color="text-primary-text" className="p-2" />
                </div>
            </div>

            {/* Selection Box */}
            <div className="border border-border-gray-600 rounded-lg p-4 flex flex-col gap-6">
                <HeaderTitle text={`Square Selection (${squares.length} items)`} size="md" weight="medium" />

                {/* Header Row */}
                <div className="grid grid-cols-12 text-xs text-gray-500 font-medium">
                    <DescriptionText text="Square Type" className="col-span-7" color="text-tertiary-text" size="sm" weight="medium" />
                    <DescriptionText text="Unit Sales Price" className="col-span-3" color="text-tertiary-text" size="sm" weight="medium" />
                    <DescriptionText text="Reward Value" className="col-span-2" color="text-tertiary-text" size="sm" weight="medium" />
                </div>

                <div className="flex flex-col gap-4">
                    {/* Square Rows */}
                    <div className="flex flex-col gap-4">
                        {squares.map(sq => (
                            <QuoteRowItem
                                key={sq.id}
                                square={sq}
                                rewardValue={rewardValues[sq.id]}
                                errorMessage={rewardErrors[sq.id]}
                                onRewardValueChange={value => handleRewardValueChange(sq.id, value)}
                            />
                        ))}
                    </div>

                    {/* Add Square Button */}
                    <LinkButton
                        to={`/sponsorship-type/studio-show/select-squares?episode_name=${encodeURIComponent(episodeName || '')}`}
                        textColor="text-primary-text"
                        width="auto"
                        className="p-2! gap-2 w-fit flex items-center text-sm! bg-transparent border border-border-gray-600 rounded"
                    >
                        <Plus />
                        Add Square
                    </LinkButton>

                    {/* Totals */}
                    <div className="pt-4 border-t border-border-gray-600 ">
                        <div className="grid grid-cols-12 text-sm">
                            <HeaderTitle text="Sub Total" size="md" weight="medium" className="col-span-7" />
                            <div className="flex items-center gap-1 col-span-3">
                                <CurrencySymbol className="text-base font-medium text-primary-text" />
                                <HeaderTitle text={formatCurrency(totals.subtotalUSP)} size="md" weight="medium" />
                            </div>
                            <div className="flex items-center gap-1 col-span-2 justify-end">
                                {allRewardsValid && (
                                    <>
                                        <CurrencySymbol className="text-base font-medium text-primary-text" />
                                        <HeaderTitle
                                            text={allRewardsValid ? formatCurrency(totals.subtotalRewardValues) : '-'}
                                            size="md"
                                            weight="medium"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between text-base">
                            <HeaderTitle text="Your Total" size="xl" weight="medium" color="text-brand-primary-500" className="col-span-7" />
                            <div className="flex items-center gap-1 col-span-2 justify-end">
                                {allRewardsValid && (
                                    <>
                                        <CurrencySymbol className="text-xl font-medium text-brand-primary-500" />
                                        <HeaderTitle
                                            text={allRewardsValid ? formatCurrency(totals.total) : '-'}
                                            size="xl"
                                            weight="medium"
                                            color="text-brand-primary-500"
                                            className="col-span-7"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex justify-end w-full">
                <ActionButton
                    bgColor="bg-brand-primary-500"
                    textColor="text-white"
                    isDisabled={!allRewardsValid}
                    width="auto"
                    borderRadius="rounded-xs"
                    className="py-2 flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart />
                    Add to Cart
                </ActionButton>
            </div>
        </div>
    );
}

export default DeclareRewardPage;
