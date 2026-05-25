import { useState, useCallback } from 'react';
import type { MixTypeData, MixTypeKey, PrizeAgreementFormDataTypes, SavedQuestion } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';
import { DEFAULT_FORM_VALUES, DEFAULT_MIX_TYPE_DATA } from '../../config/constants';

export const useItemsLinkedForm = (initialValues?: PrizeAgreementFormDataTypes) => {
    const [form, setForm] = useState<PrizeAgreementFormDataTypes>(initialValues || DEFAULT_FORM_VALUES);

    const update = useCallback(
        (key: keyof PrizeAgreementFormDataTypes, value: string | number | MixTypeKey[] | Record<MixTypeKey, MixTypeData> | SavedQuestion[]) => {
            setForm(previous => ({ ...previous, [key]: value }));
        },
        []
    );

    const updateMixTypeData = useCallback((mixType: MixTypeKey, field: keyof MixTypeData, value: string | number) => {
        setForm(previous => {
            const currentMixTypesData = previous.mixTypesData || {
                cash: { ...DEFAULT_MIX_TYPE_DATA },
                gift: { ...DEFAULT_MIX_TYPE_DATA },
                'voucher-coupon': { ...DEFAULT_MIX_TYPE_DATA },
            };
            return {
                ...previous,
                mixTypesData: {
                    ...currentMixTypesData,
                    [mixType]: {
                        ...currentMixTypesData[mixType],
                        [field]: value,
                    },
                },
            };
        });
    }, []);

    const toggleMixType = useCallback((mixType: MixTypeKey) => {
        setForm(previous => {
            const currentSelected = previous.selectedMixTypes || [];
            const isSelected = currentSelected.includes(mixType);
            const newSelected = isSelected ? currentSelected.filter(t => t !== mixType) : ([...currentSelected, mixType] as MixTypeKey[]);
            return { ...previous, selectedMixTypes: newSelected };
        });
    }, []);

    return {
        form,
        update,
        updateMixTypeData,
        toggleMixType,
    };
};
