export type InvoiceCategory = 'mobile-game' | 'studio-show';

export interface InvoiceRecord {
    name: string;
    creation: string;
    grand_total: number;
    status: string;
    workflow_state: string;
    custom_quotation: string;
    custom_sales_order: string;
}
