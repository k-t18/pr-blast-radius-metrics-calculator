export interface SponsorPortalSettings {
    name: string;
    studio_show_prize_agreement_window_days: number;
    studio_show_creatives_upload_window_days: number;
    studio_show_cash_reward_transfer_window_days: number;
    studio_show_address_for_gift_reward_transfer: Address;
    ticket_reopen_window_days: number;
    mobile_game_prize_agreement_window_days: number;
    mobile_game_creatives_upload_window_days: number;
    mobile_game_cash_reward_transfer_window_days: number;
    mobile_game_address_for_gift_reward_transfer: Address;
}

export interface Address {
    name: string;
    address_title: string;
    address_type: string;
    address_line1: string;
    address_line2: string;
    custom_region_zone: string;
    city: string;
    county: string;
    state: string;
    country: string;
    pincode: string;
    email_id: string;
    phone: string;
    is_primary_address: boolean;
    is_shipping_address: boolean;
    is_your_company_address: boolean;
    links: Link[];
}

export interface Link {
    link_doctype: string;
    link_name: string;
    link_title: string;
}
