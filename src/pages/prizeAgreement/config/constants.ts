/* eslint-disable unicorn/filename-case */
import type { MixTypeData, MixTypeKey, PrizeAgreementFormDataTypes } from '../../../interfaces/prizeAgreement/prizeAgreement.types';

export const PROGRESS_FIELDS = {
    cash: ['rewardType', 'description', 'playersCount', 'unclaimedPrizesHandling', 'disbursementOwnership', 'collectionInstructions'],
    gift: ['rewardType', 'description', 'quantity', 'unitRetailPrice', 'unclaimedPrizesHandling', 'disbursementOwnership', 'collectionInstructions'],
    'voucher-coupon': [
        'rewardType',
        'description',
        'quantity',
        'unitRetailPrice',
        'startDate',
        'durationMonths',
        'unclaimedPrizesHandling',
        'disbursementOwnership',
        'collectionInstructions',
    ],
    mix: ['rewardType', 'selectedMixTypes'],
};

export const DEFAULT_MIX_TYPE_DATA: MixTypeData = {
    description: '',
    quantity: 0,
    unitRetailPrice: 0,
    playersCount: 0,
    cashAmount: 0,
    unclaimedPrizesHandling: '',
    disbursementOwnership: 'chances',
    collectionInstructions: '',
};

export const DEFAULT_FORM_VALUES: PrizeAgreementFormDataTypes = {
    episode: '',
    square: '',
    rewardType: '',
    description: '',
    quantity: 0,
    unitRetailPrice: 0,
    playersCount: 0,
    startDate: '',
    durationMonths: 0,
    unclaimedPrizesHandling: '',
    disbursementOwnership: 'chances',
    collectionInstructions: '',
    totalAmount: 0,
    selectedMixTypes: [],
    mixTypesData: {
        cash: { ...DEFAULT_MIX_TYPE_DATA },
        gift: { ...DEFAULT_MIX_TYPE_DATA },
        'voucher-coupon': { ...DEFAULT_MIX_TYPE_DATA },
    },
    brainiacQuestionsList: [],
};

export const REWARD_TYPE_OPTIONS = [
    { value: 'cash', label: 'Cash' },
    { value: 'gift', label: 'Gift' },
    { value: 'voucher-coupon', label: 'Voucher / Coupon' },
    { value: 'mix', label: 'Mix' },
];

export const UNCLAIMED_PRIZES_OPTIONS = [
    { value: 'carry-forward', label: 'Carry forward to the next episode' },
    { value: 'donate', label: 'Donate to the charity' },
    { value: 'distribute', label: 'Distribute to the live audience' },
];

export const UNCLAIMED_PRIZES_MIX_OPTIONS = [
    { value: 'carry-forward', label: 'Carry forward the unclaimed prizes to the next episode' },
    { value: 'donate', label: 'Donate the unclaimed prizes to charity' },
    { value: 'distribute', label: 'Distribute the unclaimed prizes to the live audience' },
];

export const DISBURSEMENT_OPTIONS = [
    { value: 'chances', label: 'Chances Team' },
    { value: 'sponsor', label: 'Sponsor' },
];

export const getMixTypeLabel = (type: MixTypeKey): string => {
    const labels: Record<MixTypeKey, string> = {
        cash: 'Cash',
        gift: 'Gift',
        'voucher-coupon': 'Voucher / Coupon',
    };
    return labels[type] || '';
};
