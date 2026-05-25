import { useMemo } from 'react';
import { getStudioShowEpisodeCategories, type EpisodeCategoryItem } from '../../services/studioShow/getStudioShowEpisodeCategories.api';
import { useApiQuery } from '../useApiQuery';
import { getStudioShowCategoryMetadata } from '../../utils/studioShowCategoryMetadata';
import { formatCurrency } from '../../utils/formatCurrency';

const useStudioShowEpisodeCategories = (episodeName: string | undefined) => {
    const {
        data: categoriesResponse,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['studio-show-episode-categories', episodeName],
        queryFn: () => {
            if (!episodeName) {
                throw new Error('Episode name is required');
            }
            return getStudioShowEpisodeCategories(episodeName);
        },
        enabled: Boolean(episodeName),
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Studio show episode categories fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching studio show episode categories', error_);
        },
    });

    const categoriesList: EpisodeCategoryItem[] = categoriesResponse?.data?.categories ?? [];

    const mappedCategories = useMemo(() => {
        return categoriesList.map(category => {
            const metadata = getStudioShowCategoryMetadata({
                title: category?.sponsorship_category,
                status: category.status || category?.square_status,
                type: category.type,
                episodeName,
            });
            return {
                category,
                metadata,
                displayPrice: formatCurrency(category?.category_rate || category?.rate),
            };
        });
    }, [categoriesList, episodeName]);

    // Filter and sort main categories — squares first then powered by
    const mainCategories = mappedCategories
        .filter(({ category }) => category.type === 'square' || category.sponsorship_category.toLowerCase().includes('powered by'))
        .sort((a, b) => {
            // Prioritize type === 'square'
            const isSquareA = a.category.type === 'square';
            const isSquareB = b.category.type === 'square';
            if (isSquareA && !isSquareB) return -1;
            if (!isSquareA && isSquareB) return 1;
            return 0; // Keep original order if both same type
        });

    // Remaining categories
    const normalCategories = mappedCategories.filter(
        ({ category }) => !(category.type === 'square' || category.sponsorship_category.toLowerCase().includes('powered by'))
    );

    return {
        categoriesList,
        mappedCategories,
        mainCategories,
        normalCategories,
        isLoading,
        error,
        refetch,
    };
};

export default useStudioShowEpisodeCategories;
