import { getStudioShowEpisodes, type StudioShowEpisode, type StudioShowEpisodesResponse } from '../../services/studioShow/getStudioShowEpisodes.api';
import { useApiQuery } from '../useApiQuery';

const useStudioShowEpisodes = (season?: string) => {
    const {
        data: episodesResponse,
        isLoading,
        error,
        refetch,
    } = useApiQuery<StudioShowEpisodesResponse>({
        queryKey: ['studio-show-episodes', season],
        queryFn: () => getStudioShowEpisodes(season),
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Studio show episodes fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching studio show episodes', error_);
        },
    });

    const episodesList: StudioShowEpisode[] = episodesResponse?.data?.data ?? [];

    return { episodesList, isLoading, error, refetch };
};

export default useStudioShowEpisodes;
