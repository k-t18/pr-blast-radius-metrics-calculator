import { useState } from 'react';
import type { InvoiceRecord } from '../interfaces/invoices/invoices.types';
import type { SelectionChangeEvent } from '../interfaces/common/table.types';

/**
 * Custom hook for managing invoices table state and handlers.
 *
 * @returns An object containing state values and handler functions for the invoices table.
 */
export function useInvoicesTable() {
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | undefined>();

    const handleSelectionChange = (event: SelectionChangeEvent<InvoiceRecord>) => {
        const value = event.value as InvoiceRecord | InvoiceRecord[] | null;
        if (Array.isArray(value)) {
            setSelectedInvoice(value[0] ?? undefined);
        } else {
            setSelectedInvoice(value ?? undefined);
        }
    };

    return {
        selectedInvoice,
        handleSelectionChange,
    };
}
