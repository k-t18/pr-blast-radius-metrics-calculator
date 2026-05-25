import { DataTableWrapper } from '../../../components/common/DataTable';
import { usePeriodSelectionLogic } from '../../../hooks/period/usePeriodSelectionLogic';
import {
    liveColumns,
    // liveData,
    // creativePerformanceColumns,
    // creativePerformanceData,
    // utmTrackerColumns,
    // utmTrackerData,
} from '../dataset/adsCampaignTableColumns';
import type { AdsCampaign } from '../../../interfaces/adsCampaign/adsCampaign.types';
import { PerformanceMetricsCardContainer } from './PerformanceMetricsCardContainer';
// import HeaderTitle from '../../../components/common/HeaderTitle';
// import DoubleLineChart, { type ChartDataPoint } from '../../../components/charts/DoubleLineChart';

import DoubleBarChart, { type BarChartDataPoint } from '../../../components/charts/DoubleBarChart';
import useAdsCampaignMetricsData from '../../../hooks/adsCampaign/useAdsCampaignMetrics';
import type { ChartDataPoint } from '../../../components/charts/DoubleLineChart';
import { Colors } from '../../../styles/tokens/colors';
import CustomTableFilter from '../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../interfaces/common/filter.types';
import type { CampaignFilterKey } from '../../../services/adsCampaign/getCampaignFilters.api';

interface LiveTabProperties {
    data?: AdsCampaign[]; // The 'data' prop here acts as the 'campaigns' list passed from parent
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

const adsCampaignTableFilterOptions: TableFilterOption<CampaignFilterKey>[] = [
    { label: 'Creatives ID', value: 'creatives_id' },
    { label: 'Order ID', value: 'order_id' },
    { label: 'Campaign Name', value: 'campaign_name' },
];

// Impressions Trend Data
export const impressionsTrendData: ChartDataPoint[] = [
    { date: '09/10', greenTea: 50_000, toyota: 35_000 },
    { date: '09/10', greenTea: 40_000, toyota: 30_000 },
    { date: '09/10', greenTea: 25_000, toyota: 25_000 },
    { date: '09/10', greenTea: 15_000, toyota: 20_000 },
    { date: '09/10', greenTea: 95_000, toyota: 75_000 },
    { date: '09/10', greenTea: 100_000, toyota: 95_000 },
    { date: '09/10', greenTea: 85_000, toyota: 65_000 },
    { date: '09/10', greenTea: 50_000, toyota: 55_000 },
    { date: '09/10', greenTea: 65_000, toyota: 80_000 },
    { date: '09/10', greenTea: 45_000, toyota: 70_000 },
    { date: '09/10', greenTea: 25_000, toyota: 5000 },
    { date: '09/10', greenTea: 35_000, toyota: 15_000 },
    { date: '09/10', greenTea: 40_000, toyota: 25_000 },
    { date: '09/10', greenTea: 30_000, toyota: 35_000 },
    { date: '09/10', greenTea: 50_000, toyota: 45_000 },
    { date: '09/10', greenTea: 75_000, toyota: 50_000 },
    { date: '09/10', greenTea: 60_000, toyota: 65_000 },
    { date: '09/10', greenTea: 95_000, toyota: 100_000 },
];

// Clicks Trend Data - Based on the image description
export const clicksTrendData: ChartDataPoint[] = [
    { date: '09/10', greenTea: 48_000, toyota: 35_000 },
    { date: '09/10', greenTea: 52_000, toyota: 42_000 },
    { date: '09/10', greenTea: 58_000, toyota: 68_000 },
    { date: '09/10', greenTea: 62_000, toyota: 85_000 },
    { date: '09/10', greenTea: 70_000, toyota: 95_000 },
    { date: '09/10', greenTea: 78_000, toyota: 100_000 },
    { date: '09/10', greenTea: 85_000, toyota: 92_000 },
    { date: '09/10', greenTea: 95_000, toyota: 80_000 },
    { date: '09/10', greenTea: 88_000, toyota: 72_000 },
    { date: '09/10', greenTea: 75_000, toyota: 65_000 },
    { date: '09/10', greenTea: 60_000, toyota: 55_000 },
    { date: '09/10', greenTea: 45_000, toyota: 48_000 },
    { date: '09/10', greenTea: 30_000, toyota: 40_000 },
    { date: '09/10', greenTea: 18_000, toyota: 35_000 },
    { date: '09/10', greenTea: 12_000, toyota: 32_000 },
    { date: '09/10', greenTea: 5000, toyota: 30_000 },
    { date: '09/10', greenTea: 15_000, toyota: 38_000 },
    { date: '09/10', greenTea: 28_000, toyota: 52_000 },
    { date: '09/10', greenTea: 42_000, toyota: 68_000 },
    { date: '09/10', greenTea: 58_000, toyota: 78_000 },
    { date: '09/10', greenTea: 72_000, toyota: 85_000 },
    { date: '09/10', greenTea: 82_000, toyota: 92_000 },
    { date: '09/10', greenTea: 88_000, toyota: 96_000 },
    { date: '09/10', greenTea: 90_000, toyota: 98_000 },
];

function LiveTabContent({
    data = [], // This is 'campaigns' from the parent hook
    isLoading: isCampaignsLoading = false,
    error: campaignsError,
    totalRecords = 0,
    page = 0,
    rowsPerPage = 10,
    handlePageChange = () => {},
    ROWS_PER_PAGE_OPTIONS = [10, 20, 50],
    valueOptions,
    onApplyFilters,
    onClearFilters = () => {},
    onValueTextChange,
}: LiveTabProperties) {
    // Period filter logic
    const { handlePeriodChange, selectedDateFormat, periodData, isPeriodReady } = usePeriodSelectionLogic();

    const {
        overallPerformanceCards,
        isLoadingOverall,
        overallError,
        rewardCampaignCards,
        isLoadingRewards,
        rewardError,
        impressionsBarData,
        impressionsDomain,
        isLoadingImpressions,
        impressionsError,
        clicksBarData,
        clicksDomain,
        isLoadingClicks,
        clicksError,
    } = useAdsCampaignMetricsData({ dateFormat: selectedDateFormat, enabled: isPeriodReady });

    const isLoadingMetrics = isLoadingOverall || isLoadingRewards;
    const metricsError = overallError || rewardError;
    const chartsError = impressionsError || clicksError;
    const isLoadingCharts = isLoadingImpressions || isLoadingClicks;

    const renderEstimatedActualCharts = () => {
        if (chartsError) {
            return (
                <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700 lg:col-span-2">
                    <div className="mb-2 font-semibold">Failed to load estimated vs actual metrics</div>
                    <div className="text-sm mb-3">{chartsError}</div>
                </div>
            );
        }

        if (isLoadingCharts) {
            return (
                <>
                    <div className="h-[300px] rounded border border-gray-200 bg-gray-50" />
                    <div className="h-[300px] rounded border border-gray-200 bg-gray-50" />
                </>
            );
        }

        return (
            <>
                <DoubleBarChart
                    data={impressionsBarData as BarChartDataPoint[]}
                    title="Estimated vs. Actual Impressions"
                    firstBarKey="estimated"
                    secondBarKey="actual"
                    firstBarName="Estimated Impressions"
                    secondBarName="Actual Impressions"
                    firstBarColor={Colors.brand[50]}
                    secondBarColor={Colors.brand[500]}
                    yAxisDomain={impressionsDomain}
                    height={300}
                />
                <DoubleBarChart
                    data={clicksBarData as BarChartDataPoint[]}
                    title="Estimated vs. Actual Clicks"
                    firstBarKey="estimated"
                    secondBarKey="actual"
                    firstBarName="Estimated Clicks"
                    secondBarName="Actual Clicks"
                    firstBarColor={Colors.brand[50]}
                    secondBarColor={Colors.brand[500]}
                    yAxisDomain={clicksDomain}
                    height={300}
                />
            </>
        );
    };

    return (
        <div>
            <div className="mb-6">
                <CustomTableFilter
                    options={adsCampaignTableFilterOptions}
                    onClear={onClearFilters}
                    valueOptions={valueOptions}
                    onApply={onApplyFilters}
                    onValueTextChange={onValueTextChange}
                    className="mt-0"
                />
                {campaignsError ? (
                    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                        <div className="mb-2 font-semibold">Failed to load live campaigns</div>
                        <div className="text-sm mb-3">{campaignsError}</div>
                    </div>
                ) : (
                    <DataTableWrapper
                        value={data}
                        columns={liveColumns}
                        className="custom-table ads-campaign-table"
                        stripedRows={false}
                        dataTableProps={{
                            loading: isCampaignsLoading,
                            paginator: true,
                            rows: rowsPerPage,
                            rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
                            first: page * rowsPerPage,
                            totalRecords,
                            lazy: true,
                            scrollable: true,
                            tableStyle: { minWidth: '1600px' },
                            onPage: event => handlePageChange(event.page ?? 0, event.rows),
                        }}
                    />
                )}
            </div>
            <div className="mb-6">
                {metricsError ? (
                    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                        <div className="mb-2 font-semibold">Failed to load performance metrics</div>
                        <div className="text-sm mb-3">{metricsError}</div>
                    </div>
                ) : (
                    <PerformanceMetricsCardContainer
                        overallCards={overallPerformanceCards}
                        rewardCards={rewardCampaignCards}
                        isLoading={isLoadingMetrics}
                        periodData={periodData}
                        selectedValue={selectedDateFormat}
                        onPeriodChange={handlePeriodChange}
                    />
                )}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-1">{renderEstimatedActualCharts()}</div>
        </div>
    );
}

export default LiveTabContent;
