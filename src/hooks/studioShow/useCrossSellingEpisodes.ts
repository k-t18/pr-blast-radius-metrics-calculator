import { useApiQuery } from '../useApiQuery';
import { getCrossSellingEpisodes, type GetCrossSellingEpisodesParameters } from '../../services/studioShow/getCrossSellingEpisodes.api';

export const useCrossSellingEpisodes = (parameters: GetCrossSellingEpisodesParameters, options?: { enabled?: boolean }) => {
    // Use sorted array for stable query key (same categories in different order should use same cache)
    const sortedCategories = [...parameters.sponsorship_category].sort().join(',');
    return useApiQuery({
        queryKey: ['crossSellingEpisodes', sortedCategories],
        queryFn: () => getCrossSellingEpisodes(parameters),
        enabled: options?.enabled ?? true,
        showErrorToast: false,
    });
};
