import { lazy, Suspense, useMemo, useState } from 'react';
import type { DataTablePageEvent } from 'primereact/datatable';
import { DataTableWrapper } from '../../../components/common/DataTable';
import { getMobileGameColumns, getStudioShowColumns } from '../dataset/creativesTableColumns';
import type { SubmittedCreativesTableProperties } from '../../../interfaces/creatives/creatives.types';
import { useSubmittedCreatives } from '../../../hooks/creatives/useSubmittedCreatives';
import { useRemarkModal } from '../../../hooks/useRemarkModal';
import CustomTableFilter from '../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../interfaces/common/filter.types';
import { useFilterOptions } from '../../../hooks/transactions/useFilterOptions';

const RemarkModal = lazy(() => import('../../../components/common/RemarkModal'));

type CreativesFilterType = 'order_id' | 'creative_id';

const creativesTableFilterOptions: TableFilterOption<CreativesFilterType>[] = [
    { label: 'Order ID', value: 'order_id' },
    { label: 'Creatives ID', value: 'creative_id' },
];

function SubmittedCreativesTable({ platform, isActive = false }: SubmittedCreativesTableProperties) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterParameters, setFilterParameters] = useState<{ order_id?: string; creative_id?: string }>();
    const [searchTerms, setSearchTerms] = useState<{ order_id: string; creative_id: string }>({ order_id: '', creative_id: '' });
    // Track which fields are currently selected in the filter component
    const [selectedFields, setSelectedFields] = useState<Set<CreativesFilterType>>(new Set());
    const { isVisible, selectedRemark, handleViewRemarks, handleClose } = useRemarkModal();

    const { creatives, totalCount, isLoading, error } = useSubmittedCreatives({
        type: platform,
        limit: rowsPerPage,
        offset: page,
        enabled: isActive,
        ...filterParameters,
    });

    // Only fetch filter options when the respective field is selected
    const { filterOptions: salesOrderOptions } = useFilterOptions({
        doctypeName: 'Sales Order',
        searchTerm: searchTerms.order_id,
        enabled: selectedFields.has('order_id'),
        linkedDoctype: 'Creatives',
        linkField: 'custom_sales_order',
    });
    const { filterOptions: creativesOptions } = useFilterOptions({
        doctypeName: 'Creatives',
        searchTerm: searchTerms.creative_id,
        enabled: selectedFields.has('creative_id'),
    });

    const columns = useMemo(() => {
        return platform === 'mobile-game' ? getMobileGameColumns(handleViewRemarks) : getStudioShowColumns(handleViewRemarks);
    }, [platform, handleViewRemarks]);

    const handlePageChange = (event: DataTablePageEvent) => {
        setPage(event.page ?? 0);
        setRowsPerPage(event.rows);
    };

    const handleApplyFilters = (filters: { field: CreativesFilterType; value: string }[]) => {
        // Extract order_id and creative_id filters
        const orderIdFilter = filters.find(filter => filter.field === 'order_id');
        const creativesIdFilter = filters.find(filter => filter.field === 'creative_id');

        // Build filter params object
        const parameters: { order_id?: string; creative_id?: string } = {};
        if (orderIdFilter?.value) {
            parameters.order_id = orderIdFilter.value;
        }
        if (creativesIdFilter?.value) {
            parameters.creative_id = creativesIdFilter.value;
        }

        // If no filters, reset to full list
        if (Object.keys(parameters).length === 0) {
            setFilterParameters({});
            return;
        }

        // Set filter params to trigger API call
        setFilterParameters(parameters);
        // Reset to first page when filters are applied
        setPage(0);
    };

    const handleClearFilters = () => {
        // Reset filter params to fetch full list
        setFilterParameters({});
        // Reset to first page
        setPage(0);
        // Clear search terms
        setSearchTerms({ order_id: '', creative_id: '' });
        // Clear selected fields to stop API calls
        setSelectedFields(new Set());
    };

    const handleValueTextChange = (field: CreativesFilterType, searchValue: string, _rowId: number) => {
        if (field === 'order_id' || field === 'creative_id') {
            // Track that this field is now selected
            setSelectedFields(previous => new Set(previous).add(field));
            setSearchTerms(previous => ({ ...previous, [field]: searchValue }));
        }
    };

    const valueOptions = useMemo(() => {
        return {
            order_id: salesOrderOptions,
            creative_id: creativesOptions,
        };
    }, [salesOrderOptions, creativesOptions]);

    const emptyMessage = creatives.length === 0 && 'No data available';

    return (
        <div className="mt-6">
            <CustomTableFilter
                options={creativesTableFilterOptions}
                onClear={handleClearFilters}
                valueOptions={valueOptions}
                onApply={handleApplyFilters}
                onValueTextChange={handleValueTextChange}
            />
            {error && <div className="p-4 text-red-600">Error: {error.message}</div>}
            <DataTableWrapper
                value={error ? [] : creatives}
                columns={columns}
                className="custom-table creatives-table"
                stripedRows={false}
                emptyMessage={emptyMessage}
                dataTableProps={{
                    dataKey: 'id',
                    lazy: true,
                    paginator: true,
                    rows: rowsPerPage,
                    first: page * rowsPerPage,
                    totalRecords: totalCount,
                    onPage: handlePageChange,
                    rowsPerPageOptions: [5, 10, 20, 30],
                    loading: isLoading,
                    tableStyle: {
                        minWidth: '1400px',
                        ...(creatives.length === 0 ? { minHeight: '400px' } : {}),
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

export default SubmittedCreativesTable;
