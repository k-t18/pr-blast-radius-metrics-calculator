import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '../../../../hooks/useApiMutation';
import { createPrizeAgreement } from '../../../../services/transactions/prize-agreement/createPrizeAgreement.api';
import type { MixTypeData, MixTypeKey, PrizeAgreementFormDataTypes } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';
import type { PrizeAgreementSubmitData } from '../../../../interfaces/prizeAgreement/prizeAgreementApiPayload.types';

interface UseFormHandlerProperties {
    sponsorshipType: string;
    sponsor: string;
}

type SavedFormData = PrizeAgreementFormDataTypes & {
    total_amount: number;
    sponsorship_category: string;
    no_of_questions?: number;
};

const useFormHandler = ({ sponsorshipType }: UseFormHandlerProperties) => {
    const queryClient = useQueryClient();
    const [savedFormsData, setSavedFormsData] = useState<Record<string, SavedFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate total amount from all saved items (sum of all items' reward values)
    const totalAmount = Object.entries(savedFormsData)
        .filter(([key]) => key !== 'charity_item_table')
        .reduce((sum, [, data]) => sum + (data.total_amount || 0), 0);

    const rewardTypeMap: Record<string, string> = {
        cash: 'Cash Reward',
        gift: 'Gift Reward',
        'voucher-coupon': 'Voucher/Coupons',
        mix: 'Mix',
    };

    const unclaimedMap: Record<string, string> = {
        'carry-forward': 'Carry forward to the next episode',
        donate: 'Donate to the charity',
        distribute: 'Distribute to the live audience',
    };

    const ownershipMap: Record<string, string> = {
        chances: 'Chances Team',
        sponsor: 'Sponsor',
    };

    /** ======================================================
     *  Helper Function to Transform frontend questions to API format
     *  ====================================================== */
    const formatBrainiacQuestions = (questions: PrizeAgreementFormDataTypes['brainiacQuestionsList']) => {
        if (!questions || questions.length === 0) return null;

        return questions.map(q => {
            const apiQuestion: Record<string, string> = { question: q.question };
            let answer = '';
            q.options.forEach((opt, index) => {
                apiQuestion[`option_${index + 1}`] = opt.text;
                if (opt.isCorrect) answer = opt.text;
            });
            apiQuestion.answer = answer;
            return apiQuestion;
        });
    };
    const toSnakeCasePayload = (data: SavedFormData & { sales_order_item: string }, orderId: string) => {
        const isCashReward = data.rewardType === 'cash';

        const payload: Record<string, unknown> = {
            reward_type: rewardTypeMap[data.rewardType] || '',
            sponsorship_type: sponsorshipType,
            sponsorship_category: data.sponsorship_category || '',
            item_code: '',
            description: data.description || '',
            ownership_disbursement: ownershipMap[data.disbursementOwnership] || '',
            instructions: data.collectionInstructions || '',
            unclaimed_prizes: unclaimedMap[data.unclaimedPrizesHandling] || '',
            sponsorship_start_date: data.startDate || '',
            sponsorship_end_date: '',
            sales_order: orderId,
            sales_order_item: data.sales_order_item,
            // Cash: qty=0, rate=0, total_amount=value | Gift/Voucher: qty=value, rate=value, total_amount=0
            quantity: isCashReward ? 0 : data.quantity || 0,
            rate_per_unit: isCashReward ? 0 : data.unitRetailPrice || 0,
            total_amount: isCashReward ? data.total_amount || 0 : 0,
            total_rewards: data.playersCount,
            per_square_amount: '',
            episode: data.episode,
            square: data.square,
        };

        const formattedQuestions = formatBrainiacQuestions(data.brainiacQuestionsList);
        if (formattedQuestions && formattedQuestions.length > 0) {
            payload.branic_questions_list = formattedQuestions;
            payload.no_of_questions = formattedQuestions.length;
        }

        return payload;
    };

    /** ======================================================
     *  Helper Function to convert Mix type data to individual payloads
     *  ====================================================== */
    const mixTypeToPayload = (mixType: MixTypeKey, mixData: MixTypeData, baseData: SavedFormData & { sales_order_item: string }, orderId: string) => {
        const isCash = mixType === 'cash';

        const payload: Record<string, unknown> = {
            reward_type: rewardTypeMap[mixType] || '',
            sponsorship_type: sponsorshipType,
            sponsorship_category: baseData.sponsorship_category || '',
            item_code: '',
            description: mixData.description || '',
            ownership_disbursement: ownershipMap[mixData.disbursementOwnership] || '',
            instructions: mixData.collectionInstructions || '',
            unclaimed_prizes: unclaimedMap[mixData.unclaimedPrizesHandling] || '',
            sponsorship_start_date: '',
            sponsorship_end_date: '',
            sales_order: orderId,
            sales_order_item: baseData.sales_order_item,
            // Cash: qty=0, rate=0, total_amount=value | Gift/Voucher: qty=value, rate=value, total_amount=0
            quantity: isCash ? 0 : mixData.quantity || 0,
            rate_per_unit: isCash ? 0 : mixData.unitRetailPrice || 0,
            total_amount: isCash ? mixData.cashAmount : 0,
            total_rewards: isCash ? mixData.playersCount : 0,
            per_square_amount: '',
            episode: baseData.episode,
            square: baseData.square,
        };

        const formattedQuestions = formatBrainiacQuestions(baseData.brainiacQuestionsList);
        if (formattedQuestions && formattedQuestions.length > 0) {
            payload.branic_questions_list = formattedQuestions;
            payload.no_of_questions = formattedQuestions.length;
        }

        return payload;
    };

    /** ======================================================
     *  HANDLE SAVE FROM CHILD
     *  ====================================================== */
    const handleSaveItem = (
        itemId: string,
        episodeId: string,
        squareId: string,
        data: PrizeAgreementFormDataTypes,
        declaredRewardAmount: number,
        sponsorshipCategory: string
    ) => {
        setSavedFormsData(previousData => ({
            ...previousData,
            [itemId]: {
                ...data,
                total_amount: declaredRewardAmount,
                episode: episodeId,
                square: squareId,
                sponsorship_category: sponsorshipCategory,
            },
        }));
    };
    const handleSaveCSRContributionForm = (data: unknown[]) => {
        const dataWithItem = data.map(entry => ({ ...(entry as Record<string, unknown>), item: 'charity' }));
        setSavedFormsData(previousData => ({ ...previousData, charity_item_table: dataWithItem as unknown as SavedFormData }));
    };

    /** ======================================================
     *  API MUTATION FOR SUBMITTING PRIZE AGREEMENT
     *  ====================================================== */
    const mutation = useApiMutation({
        mutationFn: (payload: PrizeAgreementSubmitData) => createPrizeAgreement(payload),
        onSuccess: () => {
            /* eslint-disable no-console */
            console.log('✅ Prize agreement created successfully');
            // Refetch the prize agreement list after successful creation
            queryClient.invalidateQueries({ queryKey: ['prize-agreement-list'] });
            queryClient.invalidateQueries({ queryKey: ['salesOrdersWithPrizeAgreementItemsList'] });
        },
        onError: error => {
            /* eslint-disable no-console */
            console.error('❌ Failed to create prize agreement:', error);
        },
        successMessage: 'Prize agreement submitted successfully!',
    });

    const handleSubmit = async (orderId: string) => {
        setIsSubmitting(true);
        try {
            // Filter out charity_item_table and only process item forms
            const formattedItems: ReturnType<typeof toSnakeCasePayload>[] = [];

            Object.entries(savedFormsData)
                .filter(([key]) => key !== 'charity_item_table')
                .forEach(([itemId, data]) => {
                    const formData = data as SavedFormData;
                    const baseData = { ...formData, sales_order_item: itemId };

                    // If reward type is 'mix', expand each selected mix type into individual items
                    if (formData.rewardType === 'mix' && formData.selectedMixTypes && formData.mixTypesData) {
                        formData.selectedMixTypes.forEach((mixType: MixTypeKey) => {
                            const mixData = formData.mixTypesData?.[mixType];
                            if (mixData) {
                                formattedItems.push(mixTypeToPayload(mixType, mixData, baseData, orderId));
                            }
                        });
                    } else {
                        // For non-mix types, use the standard transformation
                        formattedItems.push(toSnakeCasePayload(baseData, orderId));
                    }
                });
            const payload: PrizeAgreementSubmitData = {
                orderId,
                sponsorship_type: sponsorshipType,
                items_and_rewards: formattedItems,
                csr_contribution_items: savedFormsData.charity_item_table as unknown as Record<string, unknown>[],
            };

            console.log(payload);

            mutation.mutate(payload);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        savedFormsData,
        handleSaveItem,
        handleSubmit,
        handleSaveCSRContributionForm,
        isSubmitting,
        isSubmittingFormMutation: mutation.isPending,
        totalAmount,
    };
};

export default useFormHandler;
