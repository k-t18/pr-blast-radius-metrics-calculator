import { TabPanel, TabView } from 'primereact/tabview';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DataTablePageEvent } from 'primereact/datatable';
import { DataTableWrapper } from '../../../../components/common/DataTable';
import type { FilterType } from '../../../../interfaces/common/table.types';
import { TRANSACTION_TABS } from '../../../../data/common/transactionTabs';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { useOrdersTable } from '../../../../hooks/useOrdersTable';
import { Drawer } from '../../../../components/common/Drawer';
import { OrderSidebar } from './OrderSidebar';
import useOrdersList from '../../../../hooks/transactions/orders/useOrders';
import ErrorBanner from '../../../../components/common/ErrorBanner';
import { TABLE_API_LIMIT } from '../../../../constants/apiConstants';
import { useFilterOptions } from '../../../../hooks/transactions/useFilterOptions';
import type { TableFilterOption } from '../../../../interfaces/common/filter.types';
import { mobileGameColumns, studioShowColumns } from './OrderTableColumns';
import CustomTableFilter from '../../../../components/common/tableFilter/CustomTableFilter';

const ordersTableFilterOptions: TableFilterOption<Exclude<FilterType, ''>>[] = [
    { label: 'Quotation ID', value: 'id' },
    { label: 'Order ID', value: 'order_id' },
];
export function OrdersTable() {
    const [filterParameters, setFilterParameters] = useState<{ id?: string; order_id?: string }>();
    const [searchParameters, setSearchParameters] = useSearchParams();
    const [offset, setOffset] = useState(0); // PrimeReact uses 0-based page index
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_API_LIMIT);
    const [isInitialized, setIsInitialized] = useState(false);
    const [searchTerms, setSearchTerms] = useState<{ id: string; order_id: string }>({ id: '', order_id: '' });
    // Track which fields are currently selected in the filter component
    const [selectedFields, setSelectedFields] = useState<Set<Exclude<FilterType, ''>>>(new Set());

    const activeIndex = Number(searchParameters.get('tab')) || 0;
    const activeTab = TRANSACTION_TABS[activeIndex]?.value || TRANSACTION_TABS[0].value;
    const columns = activeTab === 'mobile-game' ? mobileGameColumns : studioShowColumns;

    // fetch orders list based on filter parameters
    const { ordersList, totalCount, isLoading, error, refetch } = useOrdersList({
        ...filterParameters,
        type: activeTab,
        limit: rowsPerPage,
        offset,
    });

    // Only fetch filter options when the respective field is selected
    const { filterOptions: quotationOptions } = useFilterOptions({
        doctypeName: 'Quotation',
        searchTerm: searchTerms.id,
        enabled: selectedFields.has('id'),
        linkedDoctype: 'Sales Order',
        linkField: 'custom_quotation',
    });
    const { filterOptions: salesOrderOptions } = useFilterOptions({
        doctypeName: 'Sales Order',
        searchTerm: searchTerms.order_id,
        enabled: selectedFields.has('order_id'),
    });

    const {
        selectedOrder,
        isDrawerVisible,
        isFetchingDetail,
        detailError,
        retryFetchDetail,
        handleRowClick,
        handleSelectionChange,
        handleCloseSidebar,
    } = useOrdersTable();

    const handlePageChange = (event: DataTablePageEvent) => {
        setOffset(event.page ?? 0);
        setRowsPerPage(event.rows);
    };

    const handleApplyFilters = (filters: { field: Exclude<FilterType, ''>; value: string }[]) => {
        // Extract id and order_id filters
        const idFilter = filters.find(filter => filter.field === 'id');
        const orderIdFilter = filters.find(filter => filter.field === 'order_id');

        // Build filter params object
        const parameters: { id?: string; order_id?: string } = {};
        if (idFilter?.value) {
            parameters.id = idFilter.value;
        }
        if (orderIdFilter?.value) {
            parameters.order_id = orderIdFilter.value;
        }

        // If no filters, reset to full list
        if (Object.keys(parameters).length === 0) {
            setFilterParameters({});
            return;
        }

        // Set filter params to trigger API call
        setFilterParameters(parameters);
    };

    // Check URL for id/order_id parameter on mount and apply filter
    useEffect(() => {
        if (isInitialized) return; // Only run once on mount

        const idFromUrl = searchParameters.get('id');
        const orderIdFromUrl = searchParameters.get('order_id');

        if (orderIdFromUrl) {
            setSelectedFields(new Set(['order_id']));
            handleApplyFilters([{ field: 'order_id', value: orderIdFromUrl }]);
        } else if (idFromUrl) {
            setSelectedFields(new Set(['id']));
            handleApplyFilters([{ field: 'id', value: idFromUrl }]);
        }

        setIsInitialized(true);
    }, [searchParameters, isInitialized, handleApplyFilters]);

    const handleClearFilters = () => {
        // Reset filter params to fetch full list
        setFilterParameters({});
        // Reset to first page
        setOffset(0);
        // Clear search terms
        setSearchTerms({ id: '', order_id: '' });
        // Clear selected fields to stop API calls
        setSelectedFields(new Set());
    };

    const handleValueTextChange = (field: Exclude<FilterType, ''>, searchValue: string) => {
        if (field === 'id' || field === 'order_id') {
            // Track that this field is now selected
            setSelectedFields(previous => new Set(previous).add(field));
            setSearchTerms(previous => ({ ...previous, [field]: searchValue }));
        }
    };

    const valueOptions = useMemo(() => {
        return {
            id: quotationOptions,
            order_id: salesOrderOptions,
        };
    }, [quotationOptions, salesOrderOptions]);

    const initialFilters = useMemo(() => {
        const orderIdFromUrl = searchParameters.get('order_id');
        if (orderIdFromUrl) return [{ field: 'order_id' as Exclude<FilterType, ''>, value: orderIdFromUrl }];
        const idFromUrl = searchParameters.get('id');
        return idFromUrl ? [{ field: 'id' as Exclude<FilterType, ''>, value: idFromUrl }] : undefined;
    }, [searchParameters]);

    // Determine empty message based on state
    const emptyMessage = 'No orders found';

    const handleTabChangeWithUrlSync = (index: number) => {
        setSearchParameters({ tab: String(index) });
        setOffset(0);
        // Clear filters when switching tabs
        setFilterParameters({});
        setSearchTerms({ id: '', order_id: '' });
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
            <HeaderTitle text="Sales Order" size="2xl" weight="medium" disabled={false} className="mb-6" />
            {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
            <TabView activeIndex={activeIndex} onTabChange={event => handleTabChangeWithUrlSync(event.index)} className="custom-tabview">
                {TRANSACTION_TABS.map(tab => (
                    <TabPanel key={tab.value} header={tab.label}>
                        <CustomTableFilter
                            options={ordersTableFilterOptions}
                            onClear={handleClearFilters}
                            valueOptions={valueOptions}
                            onApply={handleApplyFilters}
                            onValueTextChange={handleValueTextChange}
                            initialFilters={initialFilters}
                            className="mt-6"
                        />
                        <DataTableWrapper
                            value={error ? [] : ordersList}
                            columns={columns}
                            className="custom-table orders-table"
                            emptyMessage={emptyMessage}
                            stripedRows={false}
                            onRowClick={handleRowClick}
                            dataTableProps={{
                                dataKey: 'name',
                                selectionMode: 'single',
                                selection: selectedOrder,
                                onSelectionChange: handleSelectionChange,
                                loading: isLoading,
                                tableStyle: {
                                    minWidth: '1400px',
                                    ...(ordersList.length === 0 ? { minHeight: '400px' } : {}),
                                },
                                ...paginationProperties,
                            }}
                        />
                    </TabPanel>
                ))}
            </TabView>
            <Drawer visible={isDrawerVisible} onHide={handleCloseSidebar} className="custom-detail-sidebar order-sidebar" width="700px">
                <OrderSidebar
                    order={selectedOrder ?? undefined}
                    onClose={handleCloseSidebar}
                    isFetchingDetail={isFetchingDetail}
                    detailError={detailError}
                    retryFetchDetail={retryFetchDetail}
                    activeIndex={activeIndex}
                />
            </Drawer>
        </div>
    );
}
