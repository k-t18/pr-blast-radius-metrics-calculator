import { useMemo } from 'react';
import type { MixTypeKey, PrizeAgreementFormDataTypes } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';

interface ValidationOptions {
    isMobileGameWeeklyLeaderboard?: boolean;
    declaredRewardAmount?: number;
    isMobileTab?: boolean;
}

// Field validation helpers
const isStringFieldValid = (value: string | undefined): boolean => String(value || '').trim() !== '';
const isNumberFieldValid = (value: number | undefined, min: number = 1): boolean => (value || 0) >= min;

export const useFormValidation = (form: PrizeAgreementFormDataTypes, options: ValidationOptions = {}) => {
    const { isMobileGameWeeklyLeaderboard = false, declaredRewardAmount = 0, isMobileTab = false } = options;

    const isCash = form.rewardType === 'cash';
    const isGift = form.rewardType === 'gift';
    const isVoucher = form.rewardType === 'voucher-coupon';
    const isMix = form.rewardType === 'mix';

    const selectedMixTypesCount = form.selectedMixTypes?.length || 0;
    const isMixTypesValid = useMemo(() => !isMix || selectedMixTypesCount >= 2, [isMix, selectedMixTypesCount]);

    // Validation for minimum values (Mobile Game Weekly Leaderboard)
    const minPlayersCount = isMobileGameWeeklyLeaderboard ? 1 : 1;
    const minQuantity = isMobileGameWeeklyLeaderboard ? 1 : 1;
    const minUnitRetailPrice = isMobileGameWeeklyLeaderboard ? declaredRewardAmount : 1;

    // Validate common fields (for all non-mix types)
    const areCommonFieldsValid = useMemo(() => {
        if (isMix) return true;
        return (
            isStringFieldValid(form.description) &&
            isStringFieldValid(form.unclaimedPrizesHandling) &&
            isStringFieldValid(form.disbursementOwnership) &&
            isStringFieldValid(form.collectionInstructions)
        );
    }, [isMix, form.description, form.unclaimedPrizesHandling, form.disbursementOwnership, form.collectionInstructions]);

    // Validate cash-specific fields
    const areCashFieldsValid = useMemo(() => {
        if (!isCash) return true;
        return isNumberFieldValid(form.playersCount, minPlayersCount);
    }, [isCash, form.playersCount, minPlayersCount]);

    // Validate gift/voucher-specific fields
    const areGiftVoucherFieldsValid = useMemo(() => {
        if (!isGift && !isVoucher) return true;
        return isNumberFieldValid(form.quantity, minQuantity) && isNumberFieldValid(form.unitRetailPrice, minUnitRetailPrice);
    }, [isGift, isVoucher, form.quantity, form.unitRetailPrice, minQuantity, minUnitRetailPrice]);

    // Validate voucher extra fields (only for Mobile Game sponsorship type)
    const areVoucherExtraFieldsValid = useMemo(() => {
        if (!isVoucher || !isMobileTab) return true;
        return isStringFieldValid(form.startDate) && isNumberFieldValid(form.durationMonths, 1);
    }, [isVoucher, isMobileTab, form.startDate, form.durationMonths]);

    // Validate mix type data fields for each selected mix type
    const areMixTypeDataFieldsValid = useMemo(() => {
        if (!isMix || !isMixTypesValid) return true;

        const selectedTypes = form.selectedMixTypes || [];
        const { mixTypesData } = form;

        if (!mixTypesData) return false;

        // Validate each selected mix type's fields
        return selectedTypes.every((mixType: MixTypeKey) => {
            const data = mixTypesData[mixType];
            if (!data) return false;

            // Common fields for all mix types
            const commonFieldsValid =
                isStringFieldValid(data.description) &&
                isStringFieldValid(data.unclaimedPrizesHandling) &&
                isStringFieldValid(data.disbursementOwnership) &&
                isStringFieldValid(data.collectionInstructions);

            if (!commonFieldsValid) return false;

            // Type-specific fields
            if (mixType === 'cash') {
                return isNumberFieldValid(data.cashAmount, 1) && isNumberFieldValid(data.playersCount, 1);
            }
            // gift or voucher-coupon
            return isNumberFieldValid(data.quantity, 1) && isNumberFieldValid(data.unitRetailPrice, 1);
        });
    }, [isMix, isMixTypesValid, form.selectedMixTypes, form.mixTypesData]);

    // Overall validation
    const canSubmit = useMemo(() => {
        // Must have a reward type selected
        if (!form.rewardType) return false;

        // Mix type validation - check both selection and data fields
        if (isMix) return isMixTypesValid && areMixTypeDataFieldsValid;

        // Validate all required fields for non-mix types
        return areCommonFieldsValid && areCashFieldsValid && areGiftVoucherFieldsValid && areVoucherExtraFieldsValid;
    }, [
        form.rewardType,
        isMix,
        isMixTypesValid,
        areMixTypeDataFieldsValid,
        areCommonFieldsValid,
        areCashFieldsValid,
        areGiftVoucherFieldsValid,
        areVoucherExtraFieldsValid,
    ]);

    return {
        isCash,
        isGift,
        isVoucher,
        isMix,
        isMixTypesValid,
        canSubmit,
        // Expose validation states for potential UI feedback
        areCommonFieldsValid,
        areCashFieldsValid,
        areGiftVoucherFieldsValid,
        areVoucherExtraFieldsValid,
        areMixTypeDataFieldsValid,
    };
};
