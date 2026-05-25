import { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import type { DataTablePageEvent } from 'primereact/datatable';
import { useSearchParams } from 'react-router-dom';
import { DataTableWrapper } from '../../../../components/common/DataTable';
import type { FilterType } from '../../../../interfaces/common/table.types';
import { useBlanketOrders } from '../../../../hooks/blanketSponsorship/useBlanketOrders';
import { useFilterOptions } from '../../../../hooks/transactions/useFilterOptions';
import { useRemarkModal } from '../../../../hooks/useRemarkModal';
import type { TableFilterOption } from '../../../../interfaces/common/filter.types';
import CustomTableFilter from '../../../../components/common/tableFilter/CustomTableFilter';
import ErrorBanner from '../../../../components/common/ErrorBanner';
import { TABLE_API_LIMIT } from '../../../../constants/apiConstants';
import { getColumns } from '../dataset/blanketOrdersTableColumns';

const RemarkModal = lazy(() => import('../../../../components/common/RemarkModal'));

const blanketOrdersTableFilterOptions: TableFilterOption<Exclude<FilterType, ''>>[] = [{ label: 'ID', value: 'id' }];

export function BlanketOrdersTable() {
    const [searchParameters] = useSearchParams();
    const [filterParameters, setFilterParameters] = useState<{ id?: string } | undefined>();
    const [offset, setOffset] = useState(0); // PrimeReact uses 0-based page index
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_API_LIMIT);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);
    // Track which fields are currently selected in the filter component
    const [selectedFields, setSelectedFields] = useState<Set<Exclude<FilterType, ''>>>(new Set());
    const { isVisible, selectedRemark, handleViewRemarks, handleClose } = useRemarkModal();

    const columns = useMemo(() => getColumns(handleViewRemarks), [handleViewRemarks]);

    // Only fetch filter options when the respective field is selected
    const { filterOptions } = useFilterOptions({
        doctypeName: 'Blanket Order',
        searchTerm,
        enabled: selectedFields.has('id'),
    });

    const { orders, isLoading, error, totalCount, refetch } = useBlanketOrders({
        ...filterParameters,
        limit: rowsPerPage,
        offset,
    });

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

    const emptyMessage = orders.length === 0 && 'No data available';

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
        <div className="mt-6">
            {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
            <CustomTableFilter
                options={blanketOrdersTableFilterOptions}
                onClear={handleClearFilters}
                valueOptions={valueOptions}
                onApply={handleApplyFilters}
                initialFilters={initialFilters}
                onValueTextChange={handleValueTextChange}
            />
            <DataTableWrapper
                value={error ? [] : orders}
                columns={columns}
                className="custom-table blanket-orders-table"
                stripedRows={false}
                emptyMessage={emptyMessage}
                dataTableProps={{
                    dataKey: 'id',
                    selectionMode: 'single',
                    loading: isLoading,
                    ...paginationProperties,
                    tableStyle: {
                        minWidth: '1400px',
                        ...(orders.length === 0 ? { minHeight: '400px' } : {}),
                    },
                }}
            />
            {isVisible && (
                <Suspense fallback={null}>
                    <RemarkModal visible={isVisible} onHide={handleClose} message={selectedRemark} title="Remarks" />
                </Suspense>
            )}
        </div>
    );
}
