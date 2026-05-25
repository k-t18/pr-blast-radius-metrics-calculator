export type MixTypeKey = 'cash' | 'gift' | 'voucher-coupon';

export interface MixTypeData {
    description: string;
    quantity: number;
    unitRetailPrice: number;
    playersCount: number;
    cashAmount: number;
    unclaimedPrizesHandling: string;
    disbursementOwnership: string;
    collectionInstructions: string;
}

export interface QnAOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface SavedQuestion {
    id: string;
    question: string;
    options: QnAOption[];
}

export interface SalesOrderWithItems {
    name: string;
    creation: string;
    grand_total: number;
    status: string;
    items_count: number;
    items_with_status: PrizeAgreementItem[];
    game_format?: 0 | 1; // 0 = studio-show, 1 = mobile-game
    customer?: string;
}

export interface PrizeAgreementItem {
    name: string;
    item_code: string;
    item_name: string;
    qty: number;
    sponsor_item_name: string;
    rate: number;
    custom_episode?: string;
    custom_declared_reward_amount?: number;
    custom_square?: string;
    custom_sponsorship_category?: string;
}

export interface PrizeAgreementDataTableTypes {
    name: string;
    total_amount: number;
    quotation_id: string | null;
    sales_order: string | null;
    sponsor: string;
    sponsorship_type: string;
    episode: string | null;
    creation: string;
    workflow_state?: string;
    pdf_link?: string;
}

export interface PrizeAgreementFormDataTypes {
    episode: string;
    square: string;
    rewardType: string;
    description: string;
    quantity: number;
    unitRetailPrice: number;
    playersCount: number;
    startDate: string;
    durationMonths: number;
    unclaimedPrizesHandling: string;
    disbursementOwnership: string;
    collectionInstructions: string;
    totalAmount: number;
    selectedMixTypes?: MixTypeKey[];
    mixTypesData?: Record<MixTypeKey, MixTypeData>;
    brainiacQuestionsList?: SavedQuestion[];
}
