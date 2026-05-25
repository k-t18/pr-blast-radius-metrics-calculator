export interface PrizeAgreementSubmitData {
    orderId: string;
    sponsorship_type: string;
    items_and_rewards: Array<Record<string, unknown>>;
    csr_contribution_items: Array<Record<string, unknown>>;
}
