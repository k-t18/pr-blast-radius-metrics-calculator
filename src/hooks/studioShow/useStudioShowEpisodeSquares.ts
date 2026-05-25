import { getStudioShowEpisodeSquares, type EpisodeSquareItem } from '../../services/studioShow/getStudioShowEpisodeSquares.api';
import { useApiQuery } from '../useApiQuery';

const useStudioShowEpisodeSquares = (episodeName: string | undefined) => {
    const {
        data: squaresResponse,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['studio-show-episode-squares', episodeName],
        queryFn: () => {
            if (!episodeName) {
                throw new Error('Episode name is required');
            }
            return getStudioShowEpisodeSquares(episodeName);
        },
        enabled: Boolean(episodeName),
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Studio show episode squares fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching studio show episode squares', error_);
        },
    });

    const squaresList: EpisodeSquareItem[] = squaresResponse?.data?.squares ?? [];

    return { squaresList, isLoading, error, refetch };
};

export default useStudioShowEpisodeSquares;
