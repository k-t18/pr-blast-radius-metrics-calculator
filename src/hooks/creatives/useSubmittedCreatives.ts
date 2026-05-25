import { useApiQuery } from '../useApiQuery';
import type { SubmittedCreative } from '../../interfaces/creatives/creatives.types';
import { getCreativesUploadTable, type GetCreativesUploadTableParameters } from '../../services/creatives/getCreativesUploadTable.api';

interface UseSubmittedCreativesParameters {
    type: GetCreativesUploadTableParameters['type'];
    limit?: number;
    offset?: number;
    enabled?: boolean;
    order_id?: string;
    creative_id?: string;
}

export function useSubmittedCreatives({ type, limit = 10, offset = 0, enabled = true, order_id, creative_id }: UseSubmittedCreativesParameters) {
    const { data, isLoading, error, refetch } = useApiQuery({
        queryKey: ['submitted-creatives', type, limit, offset, order_id, creative_id],
        queryFn: () => {
            const apiParameters: GetCreativesUploadTableParameters = { type, limit, offset };
            if (order_id) {
                apiParameters.order_id = order_id;
            }
            if (creative_id) {
                apiParameters.creative_id = creative_id;
            }
            return getCreativesUploadTable(apiParameters);
        },
        enabled,
        gcTime: 0,
        staleTime: 0,
    });

    const creatives: SubmittedCreative[] = data?.data ?? [];
    const totalCount: number = data?.count ?? 0;

    return {
        creatives,
        totalCount,
        isLoading,
        error,
        refetch,
    };
}
