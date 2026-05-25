import { useEffect, useRef } from 'react';
import type { MixTypeData, MixTypeKey, PrizeAgreementFormDataTypes } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';
import { useItemsLinkedForm } from '../../hooks/form/useItemsLinkedForm';
import { useFormValidation } from '../../hooks/form/useFormValidation';
import { PROGRESS_FIELDS } from '../../config/constants';
import RewardTypeSelector from './components/RewardTypeSelector';
import DescriptionField from './components/DescriptionField';
import CashRewardFields from './components/CashRewardFields';
import GiftVoucherFields from './components/GiftVoucherFields';
import VoucherExtraFields from './components/VoucherExtraFields';
import MixRewardSection from './components/MixRewardSection';
import CommonFields from './components/CommonFields';
import SaveButton from './components/SaveButton';
import BrainiacQnAUploader, { type BrainiacQnAUploaderReference } from '../BrainiacQnAUploader';

export { DEFAULT_FORM_VALUES } from '../../config/constants';

interface ItemsLinkedFieldsProperties {
    itemId: string;
    declaredRewardAmount?: number;
    initialValues?: PrizeAgreementFormDataTypes;
    onSave: (data: PrizeAgreementFormDataTypes) => void;
    onProgress: (value: number) => void;
    sponsorshipType?: string;
    sponsorItemName?: string;
}

const MOBILE_GAME_WEEKLY_LEADERBOARD = 'Mobile Game Weekly Leaderboard';

function ItemsLinkedFields({
    itemId,
    declaredRewardAmount = 14000000,
    initialValues,
    onSave,
    onProgress,
    sponsorshipType,
    sponsorItemName,
}: ItemsLinkedFieldsProperties) {
    const { form, update, updateMixTypeData, toggleMixType } = useItemsLinkedForm(initialValues);
    const isMobileTab = sponsorshipType === 'Mobile Game';
    const isMobileGameWeeklyLeaderboard = sponsorItemName === MOBILE_GAME_WEEKLY_LEADERBOARD;
    const brainiacReference = useRef<BrainiacQnAUploaderReference>(null);

    const { isCash, isGift, isVoucher, isMix, isMixTypesValid, canSubmit } = useFormValidation(form, {
        isMobileGameWeeklyLeaderboard,
        declaredRewardAmount,
        isMobileTab,
    });

    // Apply special defaults for Mobile Game Weekly Leaderboard when reward type changes
    // Dependencies are intentionally limited to avoid infinite loops - we only want this to run on rewardType change
    useEffect(() => {
        if (!isMobileGameWeeklyLeaderboard || !form.rewardType) return;

        if (form.rewardType === 'cash' && form.playersCount < 1) {
            update('playersCount', 1);
        }

        if ((form.rewardType === 'gift' || form.rewardType === 'voucher-coupon') && form.quantity < 1) {
            update('quantity', 1);
        }

        if ((form.rewardType === 'gift' || form.rewardType === 'voucher-coupon') && form.unitRetailPrice < declaredRewardAmount) {
            update('unitRetailPrice', declaredRewardAmount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.rewardType, isMobileGameWeeklyLeaderboard, declaredRewardAmount]);

    /** Progress calculation - DO NOT MODIFY */
    // Store callback in ref to avoid stale closures and infinite loops
    const onProgressReference = useRef(onProgress);

    // Update ref when callback changes
    useEffect(() => {
        onProgressReference.current = onProgress;
    }, [onProgress]);

    // Track previous progress to avoid unnecessary updates
    const previousProgressReference = useRef<number | null>(null);

    useEffect(() => {
        const type = form.rewardType as keyof typeof PROGRESS_FIELDS;

        let progress = 0;

        if (type) {
            if (type === 'mix') {
                const selectedTypes = form.selectedMixTypes || [];
                if (selectedTypes.length === 0) {
                    progress = 10;
                } else {
                    // Calculate progress based on filled fields for each selected mix type
                    const mixFields = ['description', 'unclaimedPrizesHandling', 'disbursementOwnership', 'collectionInstructions'];
                    const fieldsPerType = mixFields.length + 2; // base fields + 2 type-specific fields

                    const countFilledForType = (mixType: MixTypeKey): number => {
                        const data = form.mixTypesData?.[mixType];
                        if (!data) return 0;

                        const baseFilledCount = mixFields.filter(f => String(data[f as keyof MixTypeData] || '').trim() !== '').length;

                        if (mixType === 'cash') {
                            return baseFilledCount + (data.cashAmount > 0 ? 1 : 0) + (data.playersCount > 0 ? 1 : 0);
                        }
                        return baseFilledCount + (data.quantity > 0 ? 1 : 0) + (data.unitRetailPrice > 0 ? 1 : 0);
                    };

                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const filledCounts = selectedTypes.map((t: MixTypeKey) => countFilledForType(t));
                    const totalCount = selectedTypes.length * fieldsPerType;
                    let actualFilled = 0;
                    filledCounts.forEach((n: number) => {
                        actualFilled += n;
                    });

                    progress = totalCount > 0 ? Math.round((actualFilled / totalCount) * 100) : 10;
                }
            } else {
                const fields = PROGRESS_FIELDS[type];
                const total = fields.length;

                const filled = fields.filter(fieldName => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const value = (form as any)[fieldName];
                    if (typeof value === 'number') return value > 0;
                    return String(value).trim() !== '';
                }).length;

                progress = Math.round((filled / total) * 100);
            }
        }

        // Update progress via callback (only when progress actually changes)
        if (onProgressReference.current && previousProgressReference.current !== progress) {
            previousProgressReference.current = progress;
            onProgressReference.current(progress);
        }
    }, [form]);

    // Calculated values
    const amountPerPlayer = isCash && form.playersCount > 0 ? declaredRewardAmount / form.playersCount : 0;
    const totalRewardValue = isGift || isVoucher ? form.quantity * form.unitRetailPrice : 0;
    const difference = declaredRewardAmount - totalRewardValue;

    const handleSave = () => {
        if (!canSubmit) return;

        const currentQuestions = [...(form.brainiacQuestionsList || [])];
        const draft = brainiacReference.current?.saveDraft();
        if (draft) {
            currentQuestions.push(draft);
        }

        const dataToSave: PrizeAgreementFormDataTypes = isCash ? { ...form, unitRetailPrice: amountPerPlayer } : { ...form };

        if (currentQuestions.length > 0) {
            dataToSave.brainiacQuestionsList = currentQuestions;
        }

        onSave(dataToSave);
    };

    return (
        <div className="p-4 bg-white flex flex-col gap-6">
            <RewardTypeSelector value={form.rewardType} onChange={v => update('rewardType', v)} sponsorshipType={sponsorshipType} />

            {!isMix && <DescriptionField itemId={itemId} value={form.description} onChange={v => update('description', v)} />}

            {isCash && (
                <CashRewardFields
                    itemId={itemId}
                    playersCount={form.playersCount}
                    amountPerPlayer={amountPerPlayer}
                    onPlayersCountChange={v => update('playersCount', v)}
                    minPlayersCount={isMobileGameWeeklyLeaderboard ? 1 : 0}
                />
            )}

            {(isGift || isVoucher) && (
                <GiftVoucherFields
                    itemId={itemId}
                    quantity={form.quantity}
                    unitRetailPrice={form.unitRetailPrice}
                    totalRewardValue={totalRewardValue}
                    difference={difference}
                    onQuantityChange={v => update('quantity', v)}
                    onPriceChange={v => update('unitRetailPrice', v)}
                    minQuantity={isMobileGameWeeklyLeaderboard ? 1 : 0}
                    minUnitRetailPrice={isMobileGameWeeklyLeaderboard ? declaredRewardAmount : 0}
                />
            )}

            {isVoucher && isMobileTab && (
                <VoucherExtraFields
                    itemId={itemId}
                    startDate={form.startDate}
                    durationMonths={form.durationMonths}
                    onStartDateChange={v => update('startDate', v)}
                    onDurationChange={v => update('durationMonths', v)}
                />
            )}

            {isMix && (
                <MixRewardSection
                    itemId={itemId}
                    selectedMixTypes={form.selectedMixTypes || []}
                    mixTypesData={form.mixTypesData}
                    isMixTypesValid={isMixTypesValid}
                    onToggleMixType={toggleMixType}
                    onUpdateMixTypeData={updateMixTypeData}
                    sponsorshipType={sponsorshipType}
                />
            )}

            {!isMix && (
                <CommonFields
                    itemId={itemId}
                    unclaimedPrizesHandling={form.unclaimedPrizesHandling}
                    disbursementOwnership={form.disbursementOwnership}
                    collectionInstructions={form.collectionInstructions}
                    onUnclaimedChange={v => update('unclaimedPrizesHandling', v)}
                    onOwnershipChange={v => update('disbursementOwnership', v)}
                    onInstructionsChange={v => update('collectionInstructions', v)}
                />
            )}

            {sponsorItemName?.toLowerCase().includes('braniac') && (
                <BrainiacQnAUploader
                    ref={brainiacReference}
                    questions={form.brainiacQuestionsList || []}
                    onChange={value => update('brainiacQuestionsList', value)}
                />
            )}

            <SaveButton disabled={!canSubmit} onClick={handleSave} />
        </div>
    );
}

export default ItemsLinkedFields;
