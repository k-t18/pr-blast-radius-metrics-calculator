import { getGameSeasonList, type GameSeason } from '../../services/studioShow/getGameSeason.api';
import { useApiQuery } from '../useApiQuery';

const useGameSeasons = () => {
    const {
        data: seasonsResponse,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['game-seasons'],
        queryFn: () => getGameSeasonList(),
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Game seasons fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching game seasons', error_);
        },
    });

    const seasonsList: GameSeason[] = seasonsResponse?.data?.categories ?? [];

    return { seasonsList, isLoading, error, refetch };
};

export default useGameSeasons;
