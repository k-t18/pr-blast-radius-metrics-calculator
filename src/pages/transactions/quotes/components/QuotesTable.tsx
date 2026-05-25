import { TabPanel, TabView } from 'primereact/tabview';
import { useMemo, useState, useEffect } from 'react';
import type { DataTablePageEvent } from 'primereact/datatable';
import { useSearchParams } from 'react-router-dom';
import { TRANSACTION_TABS } from '../../../../data/common/transactionTabs';
import { DataTableWrapper } from '../../../../components/common/DataTable';
import type { FilterType } from '../../../../interfaces/common/table.types';
import { Drawer } from '../../../../components/common/Drawer';
import { QuoteSidebar } from './QuoteSidebar';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { useQuotesTable } from '../../../../hooks/useQuotesTable';
import useQuotesList from '../../../../hooks/transactions/quotes/useQuotes';
import ErrorBanner from '../../../../components/common/ErrorBanner';
import { TABLE_API_LIMIT } from '../../../../constants/apiConstants';
import { useFilterOptions } from '../../../../hooks/transactions/useFilterOptions';
import type { TableFilterOption } from '../../../../interfaces/common/filter.types';
import { mobileGameColumns, studioShowColumns } from './QuoteTableColumns';
import CustomTableFilter from '../../../../components/common/tableFilter/CustomTableFilter';

const quotesTableFilterOptions: TableFilterOption<Exclude<FilterType, ''>>[] = [{ label: 'ID', value: 'id' }];

function QuotesTable() {
    const [searchParameters, setSearchParameters] = useSearchParams();
    const [filterParameters, setFilterParameters] = useState<{ id?: string } | undefined>();
    const [offset, setOffset] = useState(0); // PrimeReact uses 0-based page index
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_API_LIMIT);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);
    // Track which fields are currently selected in the filter component
    const [selectedFields, setSelectedFields] = useState<Set<Exclude<FilterType, ''>>>(new Set());

    // Only fetch filter options when the respective field is selected
    const { filterOptions } = useFilterOptions({
        doctypeName: 'Quotation',
        searchTerm,
        enabled: selectedFields.has('id'),
    });

    const activeIndex = Number(searchParameters.get('tab')) || 0;
    const activeTab = TRANSACTION_TABS[activeIndex]?.value || TRANSACTION_TABS[0].value;
    const columns = activeTab === 'mobile-game' ? mobileGameColumns : studioShowColumns;

    const { quotesList, totalCount, isLoading, error, refetch } = useQuotesList({
        ...filterParameters,
        type: activeTab,
        limit: rowsPerPage,
        offset,
    });

    const {
        selectedQuote,
        isDrawerVisible,
        handleRowClick,
        handleSelectionChange,
        handleCloseSidebar,
        isFetchingDetail,
        detailError,
        retryFetchDetail,
    } = useQuotesTable();

    const handlePageChange = (event: DataTablePageEvent) => {
        setOffset(event.page ?? 0);
        setRowsPerPage(event.rows);
    };

    const handleApplyFilters = (filters: { field: Exclude<FilterType, ''>; value: string }[]) => {
        // Extract id filter
        const idFilter = filters.find(filter => filter.field === 'id');

        // Set filter params for API call
        if (idFilter && idFilter.value) {
            setFilterParameters({ id: idFilter.value });
        } else {
            setFilterParameters({});
        }
        // Reset to first page when applying filters
        setOffset(0);
    };

    const handleClearFilters = () => {
        // Reset filter params to show full list
        setFilterParameters({});
        // Reset to first page
        setOffset(0);
        // Reset search term
        setSearchTerm('');
        // Clear selected fields to stop API calls
        setSelectedFields(new Set());
    };

    // Handle value text change for dynamic filter options
    const handleValueTextChange = (field: Exclude<FilterType, ''>, searchValue: string) => {
        if (field === 'id') {
            // Track that this field is now selected
            setSelectedFields(previous => new Set(previous).add(field));
            setSearchTerm(searchValue);
        } else {
            // Reset search term when field changes
            setSearchTerm('');
        }
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

    // Memoize valueOptions to update when filterOptions change
    const valueOptions = useMemo(() => {
        return {
            id: filterOptions,
        };
    }, [filterOptions]);

    // Determine empty message based on state
    const emptyMessage = 'No quotes found';

    const handleTabChangeWithUrlSync = (index: number) => {
        setSearchParameters({ tab: String(index) });
        setOffset(0);
        // Clear filters when switching tabs
        setFilterParameters({});
        setSearchTerm('');
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
            <HeaderTitle text="Quotes" size="2xl" weight="medium" disabled={false} className="mb-6" />
            {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
            <TabView activeIndex={activeIndex} onTabChange={event => handleTabChangeWithUrlSync(event.index)} className="custom-tabview">
                {TRANSACTION_TABS.map(tab => (
                    <TabPanel key={tab.value} header={tab.label}>
                        <CustomTableFilter
                            options={quotesTableFilterOptions}
                            onClear={handleClearFilters}
                            valueOptions={valueOptions}
                            onApply={handleApplyFilters}
                            initialFilters={initialFilters}
                            onValueTextChange={handleValueTextChange}
                            className="mt-6"
                        />
                        <DataTableWrapper
                            value={error ? [] : quotesList}
                            columns={columns}
                            className="custom-table quotes-table"
                            emptyMessage={emptyMessage}
                            stripedRows={false}
                            onRowClick={handleRowClick}
                            dataTableProps={{
                                dataKey: 'name',
                                selectionMode: 'single',
                                selection: selectedQuote,
                                onSelectionChange: handleSelectionChange,
                                loading: isLoading,
                                tableStyle: {
                                    minWidth: '1400px',
                                    ...(quotesList.length === 0 ? { minHeight: '400px' } : {}),
                                },
                                ...paginationProperties,
                            }}
                        />
                    </TabPanel>
                ))}
            </TabView>

            <Drawer visible={isDrawerVisible} onHide={handleCloseSidebar} className="custom-detail-sidebar" width="700px">
                <QuoteSidebar
                    quote={selectedQuote ?? undefined}
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

export default QuotesTable;
