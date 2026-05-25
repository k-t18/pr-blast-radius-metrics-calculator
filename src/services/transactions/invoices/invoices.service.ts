/**
 * Invoices Service
 *
 * Service layer for Sales Invoice API endpoints.
 * Uses the apiClient with fetch to make HTTP requests.
 *
 * @module invoicesService
 */

import type { InvoiceRecord } from '../../../interfaces/invoices/invoices.types';
import { api } from '../../api/apiClient';

/**
 * Sales Invoice type definition
 */
export interface SalesInvoice {
    name: string;
    creation: string;
    grand_total: number;
    status: string;
    workflow_state: string | null;
}

/**
 * Invoice detail type (may have more fields than list view)
 */
export interface SalesInvoiceDetail extends SalesInvoice {
    // Add additional fields that come from detail endpoint
    // e.g., customer_name, items, etc.
}

/**
 * Invoices API service
 * All invoice-related API calls
 */
export const invoicesService = {
    /**
     * Get list of all Sales Invoices
     *
     * @returns Promise resolving to array of invoices
     * @see src/services/transactions/invoices/getInvoicesList.api.ts for API documentation
     */
    getInvoicesList: () => api.get<InvoiceRecord[]>('/api/method/chances_game.api.transactions_api.sales_invoice.get_sales_invoices_list'),

    /**
     * Get detailed information for a single invoice
     *
     * @param invoiceId - The invoice ID (e.g., 'ACC-SINV-2025-00001')
     * @returns Promise resolving to invoice details
     * @see src/services/transactions/invoices/getInvoiceDetail.api.ts for API documentation
     */
    getInvoiceDetail: (invoiceId: string) =>
        api.get<SalesInvoiceDetail>(`/api/method/chances_game.api.transactions_api.sales_invoice.get_sales_invoice_detail?invoice_id=${invoiceId}`),

    /**
     * Create a new Sales Invoice
     *
     * @param data - Invoice data
     * @returns Promise resolving to created invoice
     */
    createInvoice: (data: Partial<SalesInvoice>) =>
        api.post<SalesInvoice>('/api/method/chances_game.api.transactions_api.sales_invoice.create_invoice', data),

    /**
     * Update an existing Sales Invoice
     *
     * @param invoiceId - The invoice ID to update
     * @param data - Updated invoice data
     * @returns Promise resolving to updated invoice
     */
    updateInvoice: (invoiceId: string, data: Partial<SalesInvoice>) =>
        api.put<SalesInvoice>(`/api/method/chances_game.api.transactions_api.sales_invoice.update_invoice?invoice_id=${invoiceId}`, data),

    /**
     * Delete a Sales Invoice
     *
     * @param invoiceId - The invoice ID to delete
     * @returns Promise resolving when deletion is complete
     */
    deleteInvoice: (invoiceId: string) =>
        api.delete<void>(`/api/method/chances_game.api.transactions_api.sales_invoice.delete_invoice?invoice_id=${invoiceId}`),
};
