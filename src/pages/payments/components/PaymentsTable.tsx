import { useMemo, useState } from 'react';
import type { DataTablePageEvent } from 'primereact/datatable';
import { TabPanel, TabView } from 'primereact/tabview';
import { DataTableWrapper } from '../../../components/common/DataTable';
import type { PaymentCategory, PaymentRecord } from '../../../interfaces/payments/payments.types';
import { PAYMENT_TABS } from '../../../data/payments/paymentsTableData';
import { usePaymentsTable } from '../../../hooks/usePaymentsTable';
import { usePayments } from '../../../hooks/payments/usePayments';
import { PaymentSelectionSummary } from './PaymentSelectionSummary';
import { paidColumns, getUnpaidColumns } from '../dataset/paymentTableColumns';
import CustomTableFilter from '../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../interfaces/common/filter.types';
import { useFilterOptions } from '../../../hooks/transactions/useFilterOptions';

type PaymentsFilterType = 'invoice_id';

const paymentsTableFilterOptions: TableFilterOption<PaymentsFilterType>[] = [{ label: 'Invoice ID', value: 'invoice_id' }];

interface PaymentsTableProperties {
    onMakePayment?: (selectedPayments: PaymentRecord[]) => void;
    onMakePaymentFromRow?: (payment: PaymentRecord) => void;
    onTabChange?: (tab: PaymentCategory) => void;
}

export function PaymentsTable({ onMakePayment, onMakePaymentFromRow, onTabChange }: PaymentsTableProperties) {
    const { activeTab, activeTabIndex, selectedPayments, handleTabChange, handleSelectionChange, handleMakePayment } =
        usePaymentsTable(onMakePayment);

    // Pagination state - PrimeReact uses 0-based page index
    const [offset, setOffSet] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterParameters, setFilterParameters] = useState<{ invoice_id?: string }>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    // Track which fields are currently selected in the filter component
    const [selectedFields, setSelectedFields] = useState<Set<PaymentsFilterType>>(new Set());

    // Fetch payments for the active tab with pagination
    const { payments, isLoading, error, totalCount } = usePayments({
        type: activeTab,
        limit: rowsPerPage,
        offset,
        ...filterParameters,
    });

    // Only fetch filter options when the field is selected
    const { filterOptions: salesInvoiceOptions } = useFilterOptions({
        doctypeName: 'Sales Invoice',
        searchTerm,
        enabled: selectedFields.has('invoice_id'),
    });

    const handleTabChangeWithCallback = (index: number) => {
        handleTabChange(index);
        onTabChange?.(PAYMENT_TABS[index].value);
        // Reset to first page when switching tabs
        setOffSet(0);
        // Clear filters when switching tabs
        setFilterParameters({});
        setSearchTerm('');
        setSelectedFields(new Set());
    };

    const handlePageChange = (event: DataTablePageEvent) => {
        setOffSet(event.page ?? 0);
        setRowsPerPage(event.rows);
    };

    const handleApplyFilters = (filters: { field: PaymentsFilterType; value: string }[]) => {
        // Extract invoice_id filter
        const invoiceIdFilter = filters.find(filter => filter.field === 'invoice_id');

        if (invoiceIdFilter && invoiceIdFilter?.value) {
            setFilterParameters({ invoice_id: invoiceIdFilter.value });
        } else {
            setFilterParameters({});
        }
        // Reset to first page when filters are applied
        setOffSet(0);
    };

    const handleClearFilters = () => {
        // Reset filter params to fetch full list
        setFilterParameters({});
        // Reset to first page
        setOffSet(0);
        // Clear search terms
        setSearchTerm('');
        // Clear selected fields to stop API calls
        setSelectedFields(new Set());
    };

    const handleValueTextChange = (field: PaymentsFilterType, searchValue: string, _rowId: number) => {
        if (field === 'invoice_id') {
            // Track that this field is now selected
            setSelectedFields(previous => new Set(previous).add(field));
            setSearchTerm(searchValue);
        } else {
            // Reset search term when field changes
            setSearchTerm('');
        }
    };

    const valueOptions = useMemo(() => {
        return {
            invoice_id: salesInvoiceOptions,
        };
    }, [salesInvoiceOptions]);

    const isUnpaidTab = activeTab === 'unpaid';
    const unpaidCols = isUnpaidTab ? getUnpaidColumns({ onMakePaymentFromRow }) : [];
    const columns = isUnpaidTab ? [{ header: '', selectionMode: 'multiple' as const, style: { width: '3rem' } }, ...unpaidCols] : paidColumns;

    const dataTableProperties = {
        dataKey: 'invoice_id',
        lazy: true,
        paginator: true,
        rows: rowsPerPage,
        first: offset * rowsPerPage,
        totalRecords: totalCount,
        onPage: handlePageChange,
        rowsPerPageOptions: [5, 10, 20, 30],
        loading: isLoading,
        tableStyle: {
            minWidth: '1400px',
            ...(payments.length === 0 ? { minHeight: '400px' } : {}),
        },
        ...(isUnpaidTab && {
            selectionMode: 'multiple' as const,
            selection: selectedPayments,
            onSelectionChange: handleSelectionChange,
        }),
    };

    // Determine empty message based on state
    const emptyMessage = payments.length === 0 && `No ${activeTab} payments found`;

    return (
        <div>
            <TabView activeIndex={activeTabIndex} onTabChange={event => handleTabChangeWithCallback(event.index)} className="custom-tabview mb-6">
                {PAYMENT_TABS.map(tab => (
                    <TabPanel key={tab.value} header={tab.label}>
                        <CustomTableFilter
                            options={paymentsTableFilterOptions}
                            onClear={handleClearFilters}
                            valueOptions={valueOptions}
                            onApply={handleApplyFilters}
                            onValueTextChange={handleValueTextChange}
                            className="mt-6"
                        />
                        {error && <div className="p-4 text-red-600">Error: {error.message}</div>}
                        <DataTableWrapper
                            value={error ? [] : payments}
                            columns={columns}
                            className="custom-table payment-table"
                            stripedRows={false}
                            emptyMessage={emptyMessage}
                            dataTableProps={dataTableProperties}
                        />
                    </TabPanel>
                ))}
            </TabView>
            {isUnpaidTab && <PaymentSelectionSummary selectedPayments={selectedPayments} handleMakePayment={handleMakePayment} />}
        </div>
    );
}
