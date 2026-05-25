export type OrderCategory = 'mobile-game' | 'studio-show';

export interface QrderItem {
    name: string;
    sponsor_item_name?: string;
    customer_item_code?: string | null;
    custom_episode?: string | null;
    custom_sponsorship_category?: string | null;
    custom_sponsorship_objective?: string | null;
    custom_declared_reward_amount?: number;
    custom_square_type?: string;
    custom_sequence?: string;
    custom_status?: string;
    rate?: number;
}

export interface EpisodeWiseSponsorItem {
    episode: number;
    items: QrderItem[];
}
export interface OrderRecord {
    name: string;
    quotation_id: string;
    creation: string;
    grand_total: number;
    status: string;
    workflow_state: string;
    items?: QrderItem[];
    items_count?: number;
    is_prize_agreement_available: number;
    custom_prize_agreement: number;
    episode_wise_sponsor_items?: EpisodeWiseSponsorItem[];
    due_date?: string | null | undefined;
}

export interface OrderSidebarProperties {
    order: OrderRecord | undefined;
    onClose: () => void;
    isFetchingDetail: boolean;
    detailError: string | Error | undefined;
    retryFetchDetail: () => void;
    activeIndex: number;
}

export interface OrderHeaderProperties {
    order: OrderRecord;
    onClose: () => void;
    activeIndex: number;
}

export interface OrderBodyProperties {
    order: OrderRecord;
}

export interface OrderFooterProperties {
    order: OrderRecord;
}
