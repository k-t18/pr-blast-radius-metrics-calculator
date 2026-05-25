import { useMemo } from 'react';
import type { DataTableValue } from 'primereact/datatable';
import { DataTableWrapper } from '../../../components/common/DataTable';
import ErrorBanner from '../../../components/common/ErrorBanner';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import CustomTableFilter from '../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../interfaces/common/filter.types';
import type { WinnersFilterKey } from '../hooks/useWinnersFilterOptions';
import type { WinnersTabValue } from '../dataset/winnersInfoTableColumns';

interface WinnersTabContentProperties {
    tab: WinnersTabValue;
    data: DataTableValue[];
    columns: DataTableWrapperColumn<DataTableValue>[];
    isLoading: boolean;
    error?: string;
    onRetry: () => void;
    totalCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number, rows?: number) => void;
    valueOptions?: Partial<Record<WinnersFilterKey, Array<{ name: string }>>>;
    onApplyFilters?: (filters: { field: WinnersFilterKey; value: string }[]) => void;
    onClearFilters?: () => void;
    onValueTextChange?: (field: WinnersFilterKey, searchTerm: string, rowId: number) => void;
}

const STUDIO_SHOW_FILTER_OPTIONS: TableFilterOption<WinnersFilterKey>[] = [
    { label: 'Episode', value: 'episode' },
    { label: 'Reward Type', value: 'reward_type' },
    { label: 'Status', value: 'status' },
];

const MOBILE_GAME_FILTER_OPTIONS: TableFilterOption<WinnersFilterKey>[] = [{ label: 'Reward Type', value: 'reward_type' }];

function WinnersTabContent({
    tab,
    data,
    columns,
    isLoading,
    error,
    onRetry,
    totalCount,
    page,
    rowsPerPage,
    onPageChange,
    valueOptions,
    onApplyFilters,
    onClearFilters,
    onValueTextChange,
}: WinnersTabContentProperties) {
    const filteredData = useMemo(() => {
        return data;
    }, [data]);

    const filterOptions = tab === 'mobile-game' ? MOBILE_GAME_FILTER_OPTIONS : STUDIO_SHOW_FILTER_OPTIONS;

    return (
        <div>
            {error && <ErrorBanner message={error} onRetry={onRetry} className="mb-4" />}
            <CustomTableFilter
                options={filterOptions}
                onClear={onClearFilters ?? (() => {})}
                valueOptions={valueOptions}
                onApply={onApplyFilters}
                onValueTextChange={onValueTextChange}
                className="mb-4"
            />
            <div className="overflow-x-auto">
                <DataTableWrapper
                    value={filteredData}
                    columns={columns}
                    className="custom-table ads-campaign-table"
                    dataTableProps={{
                        loading: isLoading,
                        paginator: true,
                        lazy: true,
                        rows: rowsPerPage,
                        first: page * rowsPerPage,
                        totalRecords: totalCount ?? filteredData.length,
                        rowsPerPageOptions: [10, 20, 30, 50],
                        onPage: event => onPageChange(event.page ?? 0, event.rows),
                    }}
                    stripedRows={false}
                />
            </div>
        </div>
    );
}

export default WinnersTabContent;
