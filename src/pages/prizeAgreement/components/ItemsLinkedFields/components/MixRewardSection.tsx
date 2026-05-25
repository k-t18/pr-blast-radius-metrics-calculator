import { useMemo } from 'react';
import type { MixTypeData, MixTypeKey } from '../../../../../interfaces/prizeAgreement/prizeAgreement.types';
import InputField from '../../../../../components/form-fields/inputField/InputField';
import { RadioButtonGroup } from '../../../../../components/common/RadioButton';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { DEFAULT_MIX_TYPE_DATA, getMixTypeLabel, UNCLAIMED_PRIZES_MIX_OPTIONS } from '../../../config/constants';

interface MixRewardSectionProperties {
    itemId: string;
    selectedMixTypes: MixTypeKey[];
    mixTypesData: Record<MixTypeKey, MixTypeData> | undefined;
    isMixTypesValid: boolean;
    onToggleMixType: (mixType: MixTypeKey) => void;
    onUpdateMixTypeData: (mixType: MixTypeKey, field: keyof MixTypeData, value: string | number) => void;
    sponsorshipType?: string;
}

function MixRewardSection({
    itemId,
    selectedMixTypes,
    mixTypesData,
    isMixTypesValid,
    onToggleMixType,
    onUpdateMixTypeData,
    sponsorshipType,
}: MixRewardSectionProperties) {
    const mixTypeOptions: MixTypeKey[] = useMemo(() => {
        const allOptions: MixTypeKey[] = ['cash', 'gift', 'voucher-coupon'];
        if (sponsorshipType === 'Studio Show') {
            return allOptions.filter(option => option !== 'voucher-coupon');
        }
        return allOptions;
    }, [sponsorshipType]);

    return (
        <>
            {/* Mix Type Selection */}
            <fieldset className="flex flex-col gap-3 border-0 p-0">
                <legend className="text-base font-medium text-black mb-[9px]">
                    Select reward types you want to include<span className="text-red-600">*</span>
                </legend>
                <div className="flex flex-col gap-2">
                    {mixTypeOptions.map(mixType => (
                        <label key={mixType} htmlFor={`mixType-${itemId}-${mixType}`} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id={`mixType-${itemId}-${mixType}`}
                                checked={selectedMixTypes.includes(mixType)}
                                onChange={() => onToggleMixType(mixType)}
                                className="w-4 h-4 accent-brand-500"
                            />
                            <span className="text-sm font-medium">{getMixTypeLabel(mixType)}</span>
                        </label>
                    ))}
                </div>
                {!isMixTypesValid && <span className="text-xs text-red-600 mt-1">Please select at least 2 reward types.</span>}
            </fieldset>

            {/* Render fields for each selected mix type */}
            {selectedMixTypes.map(mixType => {
                const data = mixTypesData?.[mixType] || DEFAULT_MIX_TYPE_DATA;
                const mixTotalRewardValue = data.quantity * data.unitRetailPrice;
                const mixAmountPerPlayer = data.cashAmount > 0 && data.playersCount > 0 ? data.cashAmount / data.playersCount : 0;

                return (
                    <div key={mixType} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
                        <h4 className="text-base font-semibold text-black">{getMixTypeLabel(mixType)}</h4>

                        {/* Description */}
                        <InputField
                            id={`desc-${itemId}-${mixType}`}
                            name={`desc-${itemId}-${mixType}`}
                            label="Description"
                            value={data.description}
                            onChange={v => onUpdateMixTypeData(mixType, 'description', v)}
                            placeholder="Input field"
                            required
                            className="max-w-[520px]"
                        />

                        {/* Cash-specific fields */}
                        {mixType === 'cash' && (
                            <>
                                <InputField
                                    id={`cashAmount-${itemId}-${mixType}`}
                                    name={`cashAmount-${itemId}-${mixType}`}
                                    type="number"
                                    label="How much amount would you like to allocated for Cash reward?"
                                    value={data.cashAmount}
                                    onChange={v => onUpdateMixTypeData(mixType, 'cashAmount', Number(v) || 0)}
                                    prefix="₦"
                                    inputClassName="max-w-[173px]"
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        id={`players-${itemId}-${mixType}`}
                                        name={`players-${itemId}-${mixType}`}
                                        type="number"
                                        label="Between how many players would you like to split this amount?"
                                        value={data.playersCount}
                                        onChange={v => onUpdateMixTypeData(mixType, 'playersCount', Number(v) || 0)}
                                        inputClassName="max-w-[173px]"
                                        required
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm font-medium text-gray-700">Each players who lands on this square gets</div>
                                        <div className="text-xl font-semibold text-gray-900">₦ {formatCurrency(mixAmountPerPlayer)}</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Gift / Voucher-specific fields */}
                        {(mixType === 'gift' || mixType === 'voucher-coupon') && (
                            <div className="grid grid-cols-6 gap-4">
                                <InputField
                                    id={`qty-${itemId}-${mixType}`}
                                    name={`qty-${itemId}-${mixType}`}
                                    type="number"
                                    label="Quantity"
                                    value={data.quantity}
                                    onChange={v => onUpdateMixTypeData(mixType, 'quantity', Number(v) || 0)}
                                    inputClassName="max-w-[173px]"
                                    required
                                />
                                <InputField
                                    id={`price-${itemId}-${mixType}`}
                                    name={`price-${itemId}-${mixType}`}
                                    type="number"
                                    label="Unit Retail Price"
                                    value={data.unitRetailPrice}
                                    onChange={v => onUpdateMixTypeData(mixType, 'unitRetailPrice', Number(v) || 0)}
                                    prefix="₦"
                                    inputClassName="max-w-[173px]"
                                    required
                                />
                                <div className="flex flex-col gap-2">
                                    <div className="text-sm font-medium text-gray-700">Total Reward Value</div>
                                    <div className="text-lg font-semibold py-2">₦ {formatCurrency(mixTotalRewardValue)}</div>
                                </div>
                            </div>
                        )}

                        {/* Unclaimed Prizes */}
                        <fieldset className="flex flex-col gap-3 border-0 p-0">
                            <legend className="text-sm font-medium text-black mb-[9px]">
                                The allocated reward for this square may remain unused if no player lands on it. How would you like to handle any
                                unclaimed prizes?
                                <span className="text-red-600">*</span>
                            </legend>
                            <RadioButtonGroup
                                name={`unclaimedPrizesHandling-${mixType}`}
                                value={data.unclaimedPrizesHandling}
                                onChange={v => onUpdateMixTypeData(mixType, 'unclaimedPrizesHandling', v)}
                                options={UNCLAIMED_PRIZES_MIX_OPTIONS}
                                layout="vertical"
                            />
                        </fieldset>

                        {/* Disbursement Ownership */}
                        <fieldset className="flex flex-col gap-2 border-0 p-0">
                            <legend className="text-sm font-medium text-black mb-[9px]">
                                Disbursement Ownership<span className="text-red-600">*</span>
                            </legend>
                            <RadioButtonGroup
                                name={`disbursementOwnership-${mixType}`}
                                value={data.disbursementOwnership}
                                onChange={v => onUpdateMixTypeData(mixType, 'disbursementOwnership', v)}
                                options={[
                                    { value: 'chances', label: mixType === 'voucher-coupon' ? 'Chance' : 'Chances' },
                                    { value: 'sponsor', label: 'Sponsor' },
                                ]}
                                layout="horizontal"
                            />
                        </fieldset>

                        {/* Collection Instructions */}
                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium text-black">
                                Share instructions on how winners will collect the reward<span className="text-red-600">*</span>
                            </div>
                            <label htmlFor={`collectionInstructions-${itemId}-${mixType}`}>
                                <textarea
                                    id={`collectionInstructions-${itemId}-${mixType}`}
                                    name={`collectionInstructions-${itemId}-${mixType}`}
                                    aria-label="Collection Instructions"
                                    value={data.collectionInstructions}
                                    onChange={event => onUpdateMixTypeData(mixType, 'collectionInstructions', event.target.value)}
                                    className="w-full px-3 py-2 border rounded-md min-h-20"
                                    placeholder="Example: Provide voucher via SMS. For physical items, deliver to winner's address and email tracking number to chances..."
                                />
                            </label>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default MixRewardSection;
