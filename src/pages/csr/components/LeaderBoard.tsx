import { Trophy } from '../../../components/icons';
import { DataTableWrapper } from '../../../components/common/DataTable';
import { leaderBoardColumns } from '../dataset/csrColumn';
import HeaderTitle from '../../../components/common/HeaderTitle';
import PerformanceMetricsCard from '../../../components/cards/PerformanceMetricsCard';
import type { RankValue } from '../../../interfaces/csr/rankValue.types';
import type { RankingList } from '../../../interfaces/csr/rankList.types';
import type { ApiError } from '../../../services/api/apiClient';

type RankingListItem = RankingList['data'][number];

interface LeaderBoardProperties {
    rankValueData: RankValue;
    rankingListData: RankingListItem[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    isLoading: boolean;
    error: ApiError | null;
    onPageChange: (page: number, rows: number) => void;
}

function LeaderBoard({ rankValueData, rankingListData, totalCount, page, rowsPerPage, isLoading, error, onPageChange }: LeaderBoardProperties) {
    const totalRecords = totalCount ?? rankingListData.length;

    // Safely extract rank data
    const rankData =
        typeof rankValueData?.rank === 'object' && rankValueData.rank !== null
            ? (rankValueData.rank as unknown as { value: number; changePercentage: number; changeType: string })
            : { value: rankValueData?.rank ?? 0, changePercentage: 0, changeType: '' };

    return (
        <div>
            <HeaderTitle text="Leader Board" size="2xl" weight="medium" className="mb-4" />
            {error && <div className="p-4 text-red-600">Error: {error.message}</div>}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 h-full">
                    {isLoading ? (
                        <div className="h-full min-h-[150px] w-full animate-pulse rounded border border-gray-200 bg-gray-50" />
                    ) : (
                        <div className="h-full">
                            <PerformanceMetricsCard
                                label="Sponsor Ranking"
                                value={rankData.value?.toString() ?? '0'}
                                icon={<Trophy size={24} color="currentColor" />}
                                changePercentage={rankData.changePercentage}
                                changeType={rankData.changeType as 'increase' | 'decrease' | undefined}
                            />
                        </div>
                    )}
                </div>
                <div className="lg:col-span-3 h-full">
                    <div className="bg-white">
                        <DataTableWrapper
                            value={
                                rankingListData?.map((item: RankingListItem) => ({
                                    ranking: item.rank,
                                    sponsor_name: item.sponsor_name,
                                    amount_donated: item.amount_donated,
                                })) ?? []
                            }
                            columns={leaderBoardColumns}
                            className="custom-table leader-board-table"
                            stripedRows={false}
                            dataTableProps={{
                                lazy: true,
                                paginator: true,
                                rows: rowsPerPage,
                                first: page * rowsPerPage,
                                totalRecords,
                                onPage: event => onPageChange(event.page ?? 0, event.rows ?? rowsPerPage),
                                rowsPerPageOptions: [5, 10, 20, 30, 50],
                                loading: isLoading,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaderBoard;
