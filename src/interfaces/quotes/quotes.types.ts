export type QuoteCategory = 'mobile-game' | 'studio-show';

export type QuoteItemType = 'square' | 'powered' | 'title';

export interface QuoteItem {
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

export interface QuoteEpisode {
    id: string;
    name: string;
    items: QuoteItem[];
}

export interface EpisodeWiseSponsorItem {
    episode: number;
    items: QuoteItem[];
}

export interface Quote {
    name: string;
    quotation_created_against_blanket_order: boolean | number;
    creation: string;
    grand_total: number;
    status: string;
    workflow_state: string;
    items?: QuoteItem[];
    items_count?: number;
    episode_wise_sponsor_items?: EpisodeWiseSponsorItem[];
    // Optional API Fields
}

export interface QuoteSidebarProperties {
    quote: Quote | undefined;
    onClose: () => void;
    isFetchingDetail: boolean;
    detailError: string | Error | undefined;
    retryFetchDetail: () => void;
    activeIndex: number;
}

export interface QuoteHeaderProperties {
    quote: Quote;
    onClose: () => void;
    activeIndex: number;
}
export interface QuoteBodyProperties {
    quote: Quote;
}

export interface QuoteFooterProperties {
    quote: Quote;
}
