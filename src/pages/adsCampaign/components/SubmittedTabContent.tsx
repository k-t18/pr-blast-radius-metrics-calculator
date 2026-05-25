import { DataTableWrapper } from '../../../components/common/DataTable';
import { submittedColumns } from '../dataset/adsCampaignTableColumns';
import type { AdsCampaign } from '../../../interfaces/adsCampaign/adsCampaign.types';
import CustomTableFilter from '../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../interfaces/common/filter.types';
import type { CampaignFilterKey } from '../../../services/adsCampaign/getCampaignFilters.api';

interface SubmittedTabProperties {
    data?: AdsCampaign[];
    isLoading?: boolean;
    error?: string;
    totalRecords?: number;
    page?: number;
    rowsPerPage?: number;
    handlePageChange?: (page: number, rows?: number) => void;
    ROWS_PER_PAGE_OPTIONS?: number[];
    valueOptions?: Partial<Record<CampaignFilterKey, Array<{ name: string }>>>;
    onApplyFilters?: (filters: { field: CampaignFilterKey; value: string }[]) => void;
    onClearFilters?: () => void;
    onValueTextChange?: (field: CampaignFilterKey, searchTerm: string, rowId: number) => void;
}

const adsCampaignTableFilterOptions: TableFilterOption<CampaignFilterKey>[] = [{ label: 'Campaign Name', value: 'campaign_name' }];

function SubmittedTabContent({
    data = [], // This is 'campaigns' from parent
    isLoading = false,
    error,
    totalRecords = 0,
    page = 0,
    rowsPerPage = 10,
    handlePageChange = () => {},
    ROWS_PER_PAGE_OPTIONS = [10, 20, 50],
    valueOptions,
    onApplyFilters,
    onClearFilters = () => {},
    onValueTextChange,
}: SubmittedTabProperties) {
    return (
        <div>
            <CustomTableFilter
                options={adsCampaignTableFilterOptions}
                onClear={onClearFilters}
                valueOptions={valueOptions}
                onApply={onApplyFilters}
                onValueTextChange={onValueTextChange}
                className="mt-0 mb-4"
            />
            {error ? (
                <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                    <div className="mb-2 font-semibold">Failed to load submitted campaigns</div>
                    <div className="text-sm mb-3">{error}</div>
                </div>
            ) : (
                <DataTableWrapper
                    value={data}
                    columns={submittedColumns}
                    className="custom-table ads-campaign-table"
                    stripedRows={false}
                    dataTableProps={{
                        loading: isLoading,
                        paginator: true,
                        rows: rowsPerPage,
                        rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
                        first: page * rowsPerPage,
                        totalRecords,
                        lazy: true,
                        scrollable: true,
                        tableStyle: { minWidth: '1400px' },
                        onPage: event => handlePageChange(event.page ?? 0, event.rows),
                    }}
                />
            )}
        </div>
    );
}

export default SubmittedTabContent;
