import { TabPanel, TabView } from 'primereact/tabview';
import { useMemo, useState, useEffect } from 'react';
import type { DataTablePageEvent } from 'primereact/datatable';
import { useSearchParams } from 'react-router-dom';
import { DataTableWrapper } from '../../../../components/common/DataTable';
import type { FilterType } from '../../../../interfaces/common/table.types';
import { TRANSACTION_TABS } from '../../../../data/common/transactionTabs';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { useInvoicesTable } from '../../../../hooks/useInvoicesTable';
import useInvoices from '../../../../hooks/transactions/invoices/useInvoices';
import ErrorBanner from '../../../../components/common/ErrorBanner';
import { TABLE_API_LIMIT } from '../../../../constants/apiConstants';
import { useFilterOptions } from '../../../../hooks/transactions/useFilterOptions';
import type { TableFilterOption } from '../../../../interfaces/common/filter.types';
import { mobileGameColumns, studioShowColumns } from './InvoiceTableColumns';
import CustomTableFilter from '../../../../components/common/tableFilter/CustomTableFilter';

const invoiceTableFilterOptions: TableFilterOption<Exclude<FilterType, ''>>[] = [
    { label: 'ID', value: 'id' },
    { label: 'Order ID', value: 'order_id' },
    { label: 'Quote ID', value: 'quotation_id' },
];

export function InvoicesTable() {
    const [filterParameters, setFilterParameters] = useState<{ id?: string; order_id?: string; quotation_id?: string } | undefined>();
    const [searchParameters, setSearchParameters] = useSearchParams();
    const [offset, setOffset] = useState(0); // PrimeReact uses 0-based page index
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_API_LIMIT);
    const [isInitialized, setIsInitialized] = useState(false);
    const [searchTerms, setSearchTerms] = useState<{ id: string; order_id: string; quotation_id: string }>({
        id: '',
        order_id: '',
        quotation_id: '',
    });
    // Track which fields are currently selected in the filter component
    const [selectedFields, setSelectedFields] = useState<Set<Exclude<FilterType, ''>>>(new Set());

    const activeIndex = Number(searchParameters.get('tab')) || 0;
    const activeTab = TRANSACTION_TABS[activeIndex]?.value || TRANSACTION_TABS[0].value;
    const columns = activeTab === 'mobile-game' ? mobileGameColumns : studioShowColumns;

    const { invoiceList, totalCount, isLoading, error, refetch } = useInvoices({
        ...filterParameters,
        type: activeTab,
        limit: rowsPerPage,
        offset,
    });
    const { selectedInvoice, handleSelectionChange } = useInvoicesTable();
    // Only fetch filter options when the respective field is selected
    const { filterOptions: salesInvoiceOptions } = useFilterOptions({
        doctypeName: 'Sales Invoice',
        searchTerm: searchTerms.id,
        enabled: selectedFields.has('id'),
    });
    const { filterOptions: salesOrderOptions } = useFilterOptions({
        doctypeName: 'Sales Order',
        searchTerm: searchTerms.order_id,
        enabled: selectedFields.has('order_id'),
        linkedDoctype: 'Sales Invoice',
        linkField: 'custom_sales_order',
    });
    const { filterOptions: quotationOptions } = useFilterOptions({
        doctypeName: 'Quotation',
        searchTerm: searchTerms.quotation_id,
        enabled: selectedFields.has('quotation_id'),
        linkedDoctype: 'Sales Invoice',
        linkField: 'custom_quotation',
    });

    const handlePageChange = (event: DataTablePageEvent) => {
        setOffset(event.page ?? 0);
        setRowsPerPage(event.rows);
    };
    const handleApplyFilters = (filters: { field: Exclude<FilterType, ''>; value: string }[]) => {
        // Extract id, order_id, and quotation_id filters
        const idFilter = filters.find(filter => filter.field === 'id');
        const orderIdFilter = filters.find(filter => filter.field === 'order_id');
        const quotationIdFilter = filters.find(filter => filter.field === 'quotation_id');

        // Build filter params object
        const parameters: { id?: string; order_id?: string; quotation_id?: string } = {};
        if (idFilter?.value) {
            parameters.id = idFilter.value;
        }
        if (orderIdFilter?.value) {
            parameters.order_id = orderIdFilter.value;
        }
        if (quotationIdFilter?.value) {
            parameters.quotation_id = quotationIdFilter.value;
        }

        // If no filters, reset to full list
        if (Object.keys(parameters).length === 0) {
            setFilterParameters({});
            return;
        }

        // Set filter params to trigger API call
        setFilterParameters(parameters);
    };

    // Apply ?id= query param from notification redirect on first mount
    useEffect(() => {
        if (isInitialized) return;
        const idFromUrl = searchParameters.get('id');
        if (idFromUrl) {
            setSelectedFields(new Set(['id']));
            handleApplyFilters([{ field: 'id', value: idFromUrl }]);
        }
        setIsInitialized(true);
    }, [searchParameters, isInitialized, handleApplyFilters]);

    const initialFilters = useMemo(() => {
        const idFromUrl = searchParameters.get('id');
        return idFromUrl ? [{ field: 'id' as Exclude<FilterType, ''>, value: idFromUrl }] : undefined;
    }, [searchParameters]);

    const handleClearFilters = () => {
        // Reset filter params to fetch full list
        setFilterParameters({});
        // Reset to first page
        setOffset(0);
        // Clear search terms
        setSearchTerms({ id: '', order_id: '', quotation_id: '' });
        // Clear selected fields to stop API calls
        setSelectedFields(new Set());
    };

    const handleValueTextChange = (field: Exclude<FilterType, ''>, searchValue: string) => {
        if (field === 'id' || field === 'order_id' || field === 'quotation_id') {
            // Track that this field is now selected
            setSelectedFields(previous => new Set(previous).add(field));
            setSearchTerms(previous => ({ ...previous, [field]: searchValue }));
        }
    };

    const valueOptions = useMemo(() => {
        return {
            id: salesInvoiceOptions,
            order_id: salesOrderOptions,
            quotation_id: quotationOptions,
        };
    }, [salesInvoiceOptions, salesOrderOptions, quotationOptions]);

    // Determine empty message based on state
    const emptyMessage = 'No invoices found';

    const handleTabChangeWithUrlSync = (index: number) => {
        setSearchParameters({ tab: String(index) });
        setOffset(0);
        // Clear filters when switching tabs
        setFilterParameters({});
        setSearchTerms({ id: '', order_id: '', quotation_id: '' });
        setSelectedFields(new Set());
    };

    const paginationProperties =
        isLoading || error
            ? { paginator: false }
            : {
                  paginator: true,
                  lazy: true, // Enable server-side pagination
                  rows: rowsPerPage,
                  first: offset * rowsPerPage,
                  totalRecords: totalCount,
                  rowsPerPageOptions: [5, 10, 20, 50],
                  onPage: handlePageChange,
              };

    return (
        <div className="">
            <HeaderTitle text="Invoices" size="2xl" weight="medium" disabled={false} className="mb-6" />
            {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
            <TabView activeIndex={activeIndex} onTabChange={event => handleTabChangeWithUrlSync(event.index)} className="custom-tabview">
                {TRANSACTION_TABS.map(tab => (
                    <TabPanel key={tab.value} header={tab.label}>
                        <CustomTableFilter
                            options={invoiceTableFilterOptions}
                            onClear={handleClearFilters}
                            valueOptions={valueOptions}
                            onApply={handleApplyFilters}
                            initialFilters={initialFilters}
                            onValueTextChange={handleValueTextChange}
                            className="mt-6"
                        />
                        <DataTableWrapper
                            value={error ? [] : invoiceList}
                            columns={columns}
                            className="custom-table invoices-table"
                            stripedRows={false}
                            emptyMessage={emptyMessage}
                            dataTableProps={{
                                dataKey: 'name',
                                selectionMode: 'single',
                                selection: selectedInvoice,
                                onSelectionChange: handleSelectionChange,
                                loading: isLoading,
                                tableStyle: {
                                    minWidth: '1400px',
                                    ...(invoiceList.length === 0 ? { minHeight: '400px' } : {}),
                                },
                                ...paginationProperties,
                            }}
                        />
                    </TabPanel>
                ))}
            </TabView>
        </div>
    );
}
