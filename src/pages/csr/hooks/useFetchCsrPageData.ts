import { getCardsData } from '../../../services/csr/getCardsData.api';
import { getNgoPartnershipList } from '../../../services/csr/getNgoPartnershipList.api';
import { useApiQuery } from '../../../hooks/useApiQuery';
import type { ApiResponse } from '../../../services/api/apiClient';
import type { RankValue } from '../../../interfaces/csr/rankValue.types';
import { getRankingList } from '../../../services/csr/getRankingList.api';
import type { NGOChartData } from '../../../interfaces/csr/ngosChartData.types';
import type { NGOPartnershipItem } from '../../../interfaces/csr/ngoPartnershipList.types';
import type { RankingList } from '../../../interfaces/csr/rankList.types';
import type { CSRFundsAllocationResponse } from '../../../interfaces/csr/fundsAllocation.types';
import { getRankValue } from '../../../services/csr/getRankValue.api';
import { getCsrFundsAllocation } from '../../../services/csr/getCsrFundsAllocation.api';
import type { CSRCardSummary } from '../../../interfaces/csr/cardSummary.types';
import { getNgosChartData } from '../../../services/csr/getNgosChartData.api';
import { getLatestCertificate } from '../../../services/csr/getLatestCertificate.api';
import type { CertificateResponse } from '../../../interfaces/csr/certificate.types';

interface PaginationOptions {
    rankingLimit?: number;
    rankingOffset?: number;
    ngoLimit?: number;
    ngoOffset?: number;
    dateFormat?: number;
    enabled?: boolean;
}

const useFetchCsrPageData = ({
    rankingLimit = 10,
    rankingOffset = 0,
    ngoLimit = 10,
    ngoOffset = 0,
    dateFormat,
    enabled = true,
}: PaginationOptions = {}) => {
    const { data, isLoading, error } = useApiQuery<ApiResponse<CSRCardSummary>>({
        queryKey: ['csr-cards-data', dateFormat],
        queryFn: () => getCardsData(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });
    const {
        data: fundsAllocationData,
        isLoading: isLoadingFundsAllocation,
        error: errorFundsAllocation,
    } = useApiQuery<ApiResponse<CSRFundsAllocationResponse>>({
        queryKey: ['funds-allocation-data', dateFormat],
        queryFn: () => getCsrFundsAllocation(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });
    const {
        data: ngoWiseTotalDonationData,
        isLoading: isLoadingNgoWiseTotalDonation,
        error: errorNgoWiseTotalDonation,
    } = useApiQuery<ApiResponse<NGOChartData>>({
        queryKey: ['ngo-wise-total-donation-data', dateFormat],
        queryFn: () => getNgosChartData(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });
    const {
        data: ngoPartnershipListData,
        isLoading: isLoadingNgoPartnershipList,
        error: errorNgoPartnershipList,
    } = useApiQuery<ApiResponse<NGOPartnershipItem[]>>({
        queryKey: ['ngo-partnership-list-data', ngoLimit, ngoOffset],
        // Wrap to avoid TanStack query passing context as the first arg (was being treated as `limit`)
        queryFn: () => getNgoPartnershipList(ngoLimit, ngoOffset),
    });
    const {
        data: rankValueData,
        isLoading: isLoadingRankValue,
        error: errorRankValue,
    } = useApiQuery<ApiResponse<RankValue>>({
        queryKey: ['rank-value-data', dateFormat],
        queryFn: () => getRankValue(dateFormat),
    });
    const {
        data: rankingListData,
        isLoading: isLoadingRankingList,
        error: errorRankingList,
    } = useApiQuery<ApiResponse<RankingList>>({
        queryKey: ['ranking-list-data', rankingLimit, rankingOffset],
        queryFn: () => getRankingList(rankingLimit, rankingOffset),
    });
    const {
        data: certificateData,
        isLoading: isLoadingCertificate,
        error: errorCertificate,
    } = useApiQuery<ApiResponse<CertificateResponse>>({
        queryKey: ['latest-certificate'],
        queryFn: () => getLatestCertificate(),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });

    // Normalize ranking list response which can come as either:
    // - ApiResponse<{ data: RankingItem[] }>
    // - ApiResponse<RankingItem[]>
    const rankingListItems: RankingList['data'] = Array.isArray(rankingListData?.data) ? rankingListData?.data : (rankingListData?.data?.data ?? []);

    return {
        csrCardSummary: data?.data as unknown as
            | Array<{ label: string; value: number; changePercentage: number; changeType: string; suffix: string; currency: string }>
            | undefined, // API returns an array, but the type expects an object
        isLoading,
        error,
        ngoWiseTotalDonationData: ngoWiseTotalDonationData?.data,
        isLoadingNgoWiseTotalDonation,
        errorNgoWiseTotalDonation,
        ngoPartnershipListData: ngoPartnershipListData?.data,
        ngoPartnershipCount: ngoPartnershipListData?.count ?? 0,
        isLoadingNgoPartnershipList,
        errorNgoPartnershipList,
        rankValueData: rankValueData?.data,
        isLoadingRankValue,
        errorRankValue,
        rankingListData: rankingListItems,
        rankingListCount: rankingListData?.count ?? 0,
        isLoadingRankingList,
        errorRankingList,
        fundsAllocationData: fundsAllocationData?.data,
        isLoadingFundsAllocation,
        errorFundsAllocation,
        certificateData: certificateData?.data,
        isLoadingCertificate,
        errorCertificate,
    };
};

export default useFetchCsrPageData;
