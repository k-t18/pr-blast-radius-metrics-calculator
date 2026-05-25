import { useApiQuery } from '../../../hooks/useApiQuery';
import type { ApiResponse } from '../../../services/api/apiClient';
import type { NGOPartnershipItem, CsrShareData } from '../../../interfaces/csr/ngoPartnershipList.types';
import { getCsrShareData, transformToCsrShareData } from '../../../services/csr/getCsrShareData.api';

interface UseCsrShareDataOptions {
    csrId: string;
    enabled?: boolean;
}

/**
 * Constructs CSR share data from URL parameters
 * Used as fallback when the API call fails or data is passed via URL
 *
 * @param urlParameters - URL search parameters
 * @returns CSR share data or null
 */
export function getCsrShareDataFromUrl(urlParameters: URLSearchParams): CsrShareData | null {
    const csrId = urlParameters.get('id');

    if (!csrId) {
        return null;
    }

    return {
        csrId,
        ngoName: urlParameters.get('ngo') || 'NGO Partner',
        focusArea: urlParameters.get('focus') || 'Social Impact',
        imageUrl: urlParameters.get('img') || '',
        certificateUrl: urlParameters.get('cert') || undefined,
        companyName: urlParameters.get('company') || undefined,
        episode: urlParameters.get('episode') || undefined,
        csrAmount: urlParameters.get('amount') ? Number(urlParameters.get('amount')) : undefined,
        status: urlParameters.get('status') || undefined,
    };
}

/**
 * Generates a shareable URL for the frontend share page
 * The share page will fetch data from API and set OG meta tags dynamically
 *
 * @param data - CSR share data
 * @returns Complete shareable URL with CSR ID
 */
export function generateCsrShareUrl(data: CsrShareData): string {
    // Use frontend URL for sharing
    // The share page fetches data from API using the ID
    const baseUrl = window.location.origin;
    const url = new URL(`${baseUrl}/share/csr`);

    // Only pass the ID - the share page will fetch the rest from API
    url.searchParams.set('id', data.csrId);

    return url.toString();
}

/**
 * Custom hook to fetch CSR share data by CSR ID
 *
 * @param options - Configuration options
 * @param options.csrId - The CSR donation ID (e.g., "CSR-00008")
 * @param options.enabled - Whether the query should run (default: true)
 *
 * @returns Query result with CSR share data, loading state, and error
 *
 * @example
 * ```typescript
 * const { shareData, isLoading, error } = useCsrShareData({
 *   csrId: 'CSR-00008',
 *   enabled: true
 * });
 * ```
 */
const useCsrShareData = ({ csrId, enabled = true }: UseCsrShareDataOptions) => {
    const {
        data: apiResponse,
        isLoading,
        error,
    } = useApiQuery<ApiResponse<NGOPartnershipItem[]>>({
        queryKey: ['csr-share-data', csrId],
        queryFn: () => getCsrShareData(csrId),
        enabled: enabled && !!csrId,
        gcTime: 5 * 60 * 1000, // Cache for 5 minutes
        staleTime: 2 * 60 * 1000, // Consider fresh for 2 minutes
    });

    // Transform API response to CsrShareData format
    const shareData: CsrShareData | null = transformToCsrShareData(apiResponse);

    return {
        shareData,
        isLoading,
        error,
    };
};

export default useCsrShareData;
