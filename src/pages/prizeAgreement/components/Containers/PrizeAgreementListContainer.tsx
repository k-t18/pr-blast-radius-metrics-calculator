import { useState, useMemo, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import type { DataTablePageEvent } from 'primereact/datatable';
import { DataTableWrapper } from '../../../../components/common/DataTable';
import type { DataTableWrapperColumn } from '../../../../interfaces/common/table.types';
import { HyphenatedDate } from '../../../../components/common/HyphenatedDate';
import StatusBadge from '../../../../components/common/StatusBadge';
import ActionButton from '../../../../components/common/ActionButton';
import Download from '../../../../components/icons/Download';
import type { PrizeAgreementDataTableTypes } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';
import { formatCurrency } from '../../../../utils/formatCurrency';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import ErrorBanner from '../../../../components/common/ErrorBanner';
import CustomTableFilter from '../../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../../interfaces/common/filter.types';
import { useFilterOptions } from '../../../../hooks/transactions/useFilterOptions';
import { usePrizeAgreementList } from '../../hooks/api/usePrizeAgreementList';
import { TABLE_API_LIMIT } from '../../../../constants/apiConstants';
import useDownloadDocuments from '../../../../hooks/useDownloadDocuments';
// Define prize agreement specific filter types
type PrizeAgreementFilterType = 'id' | 'quotation_id' | 'sales_order';

// Filter options configuration
const prizeAgreementFilterOptions: TableFilterOption<PrizeAgreementFilterType>[] = [
    { label: 'ID', value: 'id' },
    { label: 'Quote ID', value: 'quotation_id' },
    { label: 'Sales Order ID', value: 'sales_order' },
];

// Map filter field to doctype name for API calls
const filterFieldToDoctypeMap: Record<PrizeAgreementFilterType, string> = {
    id: 'Prize Agreement',
    quotation_id: 'Quotation',
    sales_order: 'Sales Order',
};

// Separate component for the download button to ensure proper re-rendering
interface DownloadButtonProperties {
    pdfLink: string;
    rowId: string;
    isDownloading: boolean;
    hasError: boolean;
    errorMessage: string | null;
    onDownload: (url: string, rowId: string) => void;
}

function DownloadButton({ pdfLink, rowId, isDownloading, hasError, errorMessage, onDownload }: DownloadButtonProperties) {
    return (
        <span className="flex items-center justify-end">
            <ActionButton
                bgColor="bg-white"
                textColor="text-primary-text"
                borderColor="#D6D6D6"
                borderRadius="rounded"
                width="auto"
                onClick={() => onDownload(pdfLink, rowId)}
                isDisabled={isDownloading}
                className="min-h-9 text-xs font-normal leading-5 border w-fit hover:bg-[#F9FAFB] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#D0D5DD]"
            >
                <Download size={16} />
                {isDownloading ? 'Downloading...' : 'Contract'}
                {hasError && <span className="text-red-500 ml-1">{errorMessage}</span>}
            </ActionButton>
        </span>
    );
}

const createColumns = (
    downloadingRowId: string | null,
    handleDownloadDocument: (url: string, rowId: string) => void,
    documentError: string | null,
    errorRowId: string | null
): DataTableWrapperColumn<PrizeAgreementDataTableTypes>[] => [
    {
        field: 'quotation_id',
        header: 'Quote ID',
        body: rowData => <span className="text-[#101828]">{rowData.quotation_id ?? ''}</span>,
        style: { width: '14%' },
    },
    {
        field: 'sales_order',
        header: 'Order ID',
        body: rowData => <span className="text-[#101828]">{rowData.sales_order ?? ''}</span>,
        style: { width: '14%' },
    },
    {
        field: 'name',
        header: 'Prize Agreement ID',
        body: rowData => <span className="text-[#101828]">{rowData.name}</span>,
        style: { width: '18%' },
    },
    {
        field: 'total_amount',
        header: 'Total Amount',
        body: rowData => (
            <span className="text-[#101828]">
                <CurrencySymbol />
                {formatCurrency(rowData.total_amount ?? 0)}
            </span>
        ),
        style: { width: '14%' },
    },
    {
        field: 'creation',
        header: 'Submitted On',
        body: rowData => <HyphenatedDate date={rowData.creation} className="text-[#101828]" />,
        style: { width: '14%' },
    },
    {
        field: 'workflow_state',
        header: 'Status',
        body: rowData => {
            if (!rowData.workflow_state) return <span />;
            return <StatusBadge statusKey={rowData.workflow_state} variant="filled" shape="square" className="text-[10px] font-normal" />;
        },
        style: { width: '20%' },
    },
    {
        header: '',
        body: rowData => {
            const status = rowData.workflow_state?.toLowerCase();
            if (status === 'approved') {
                const rowId = rowData.name;
                const isRowDownloading = downloadingRowId === rowId;
                const hasRowError = errorRowId === rowId && !!documentError;
                return (
                    <DownloadButton
                        pdfLink={rowData.pdf_link ?? ''}
                        rowId={rowId}
                        isDownloading={isRowDownloading}
                        hasError={hasRowError}
                        errorMessage={documentError}
                        onDownload={handleDownloadDocument}
                    />
                );
            }
            if (status === 'rejected') {
                return (
                    <span className="flex items-center justify-end">
                        <ActionButton
                            bgColor="bg-white"
                            textColor="text-primary-text"
                            borderColor="#D6D6D6"
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 text-xs font-normal leading-5 border w-fit hover:bg-[#F9FAFB] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#D0D5DD]"
                        >
                            View Remarks
                        </ActionButton>
                    </span>
                );
            }
            return null;
        },
        style: { width: '14%', textAlign: 'right' },
    },
];

function PrizeAgreementListContainer() {
    const [searchParameters] = useSearchParams();
    const [isInitialized, setIsInitialized] = useState(false);
    // Pagination state
    const [offset, setOffset] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_API_LIMIT);
    const { handleDownloadDocument: downloadDocument, documentError } = useDownloadDocuments();
    const [downloadingRowId, setDownloadingRowId] = useState<string | null>(null);
    const [errorRowId, setErrorRowId] = useState<string | null>(null);
    // Filter state
    const [filterParameters, setFilterParameters] = useState<{
        id?: string;
        quotation_id?: string;
        sales_order?: string;
    }>({});

    // Track active filter field and search term for dynamic options
    const [activeFilterField, setActiveFilterField] = useState<PrizeAgreementFilterType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Determine doctype for filter options API
    const activeDoctype = activeFilterField ? filterFieldToDoctypeMap[activeFilterField] : '';

    // Fetch filter options only when a field is selected
    const { filterOptions } = useFilterOptions({
        doctypeName: activeDoctype,
        searchTerm,
        enabled: !!activeFilterField,
    });

    // Fetch prize agreement list with filters
    const { prizeAgreementList, totalCount, isLoading, error, refetch } = usePrizeAgreementList({
        ...filterParameters,
        limit: rowsPerPage,
        offset,
    });

    // Wrapper to track which row is downloading
    const handleDownloadDocument = useCallback(
        async (url: string, rowId: string) => {
            // Use flushSync to ensure state update happens immediately before async work
            flushSync(() => {
                setDownloadingRowId(rowId);
                setErrorRowId(null);
            });

            // Ensure loading state is visible for at least 500ms
            const startTime = Date.now();

            try {
                await downloadDocument(url);
            } catch {
                // Error is already set by the hook, just track the row
                setErrorRowId(rowId);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const minimumLoadingTime = 500;

                if (elapsedTime < minimumLoadingTime) {
                    await new Promise<void>(resolve => {
                        setTimeout(resolve, minimumLoadingTime - elapsedTime);
                    });
                }
                setDownloadingRowId(null);
            }
        },
        [downloadDocument]
    );

    // Create columns with access to hook values
    const columns = useMemo(
        () => createColumns(downloadingRowId, handleDownloadDocument, documentError, errorRowId),
        [downloadingRowId, handleDownloadDocument, documentError, errorRowId]
    );

    const handlePageChange = useCallback((event: DataTablePageEvent) => {
        setOffset(event.page ?? 0);
        setRowsPerPage(event.rows);
    }, []);

    const handleApplyFilters = useCallback((filters: { field: PrizeAgreementFilterType; value: string }[]) => {
        const newFilterParameters: typeof filterParameters = {};

        // Extract filter values using array methods
        const idFilter = filters.find(f => f.field === 'id' && f.value);
        const quotationFilter = filters.find(f => f.field === 'quotation_id' && f.value);
        const salesOrderFilter = filters.find(f => f.field === 'sales_order' && f.value);

        if (idFilter) newFilterParameters.id = idFilter.value;
        if (quotationFilter) newFilterParameters.quotation_id = quotationFilter.value;
        if (salesOrderFilter) newFilterParameters.sales_order = salesOrderFilter.value;

        setFilterParameters(newFilterParameters);
        setOffset(0); // Reset to first page when applying filters
    }, []);

    // Apply ?id= query param from notification redirect on first mount
    useEffect(() => {
        if (isInitialized) return;
        const idFromUrl = searchParameters.get('id');
        if (idFromUrl) {
            setActiveFilterField('id');
            handleApplyFilters([{ field: 'id', value: idFromUrl }]);
        }
        setIsInitialized(true);
    }, [searchParameters, isInitialized, handleApplyFilters]);

    const initialFilters = useMemo(() => {
        const idFromUrl = searchParameters.get('id');
        return idFromUrl ? [{ field: 'id' as PrizeAgreementFilterType, value: idFromUrl }] : undefined;
    }, [searchParameters]);

    const handleClearFilters = useCallback(() => {
        setFilterParameters({});
        setOffset(0);
        setSearchTerm('');
        setActiveFilterField(null);
    }, []);

    const handleValueTextChange = useCallback((field: PrizeAgreementFilterType, searchValue: string) => {
        setActiveFilterField(field);
        setSearchTerm(searchValue);
    }, []);

    // Memoize valueOptions to prevent unnecessary re-renders
    const valueOptions = useMemo(
        () => ({
            id: activeFilterField === 'id' ? filterOptions : [],
            quotation_id: activeFilterField === 'quotation_id' ? filterOptions : [],
            sales_order: activeFilterField === 'sales_order' ? filterOptions : [],
        }),
        [activeFilterField, filterOptions]
    );

    const emptyMessage = 'No prize agreements found';

    const paginationProperties =
        isLoading || error
            ? { paginator: false }
            : {
                  paginator: true,
                  lazy: true,
                  rows: rowsPerPage,
                  first: offset * rowsPerPage,
                  totalRecords: totalCount,
                  rowsPerPageOptions: [5, 10, 20, 50],
                  onPage: handlePageChange,
              };

    return (
        <div className="mt-4">
            {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
            <CustomTableFilter
                options={prizeAgreementFilterOptions}
                onClear={handleClearFilters}
                valueOptions={valueOptions}
                onApply={handleApplyFilters}
                initialFilters={initialFilters}
                onValueTextChange={handleValueTextChange}
            />
            <DataTableWrapper
                key={`table-${downloadingRowId ?? 'none'}-${errorRowId ?? 'none'}`}
                value={error ? [] : prizeAgreementList}
                columns={columns}
                className="custom-table prize-agreement-list-table"
                stripedRows={false}
                emptyMessage={emptyMessage}
                dataTableProps={{
                    dataKey: 'name',
                    loading: isLoading,
                    tableStyle: {
                        minWidth: '1400px',
                        ...(prizeAgreementList.length === 0 ? { minHeight: '400px' } : {}),
                    },
                    ...paginationProperties,
                }}
            />
        </div>
    );
}

export default PrizeAgreementListContainer;
