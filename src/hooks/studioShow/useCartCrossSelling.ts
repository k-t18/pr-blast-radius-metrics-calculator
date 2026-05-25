import { useMemo } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useCrossSellingEpisodes } from './useCrossSellingEpisodes';
import type { StudioShowCartEpisode, AddCartItemInput } from '../../stores/studioShowCartStore';
import type { SquareItem, CategoryItem } from '../../services/studioShow/getCrossSellingEpisodes.api';
import { getStudioShowCategoryMetadata } from '../../utils/studioShowCategoryMetadata';
import { formatCurrency } from '../../utils/formatCurrency';
import type { ItemRowProperties } from '../../pages/cart/components/CartItemRow';

interface UseCartCrossSellingOptions {
    navigate: NavigateFunction;
    addItem: (item: AddCartItemInput) => void;
    isItemInCart: (episodeName: string, itemTitle: string) => boolean;
}

/**
 * Hook to extract unique sponsorship categories from cart episodes and fetch cross-selling data
 * @param episodes - Array of cart episodes containing items with sponsorship_category
 * @param options - Navigation and cart functions needed for transformation
 * @returns Cross-selling data, loading state, and transformed items ready for rendering
 */
export const useCartCrossSelling = (episodes: StudioShowCartEpisode[], options: UseCartCrossSellingOptions) => {
    const { navigate, addItem, isItemInCart } = options;

    // Get all unique sponsorship categories from cart items
    const sponsorshipCategories = useMemo(() => {
        const allCategories = episodes
            .flatMap(ep => ep.items)
            .map(item => item.sponsorship_category)
            .filter(Boolean) as string[];

        // Get unique categories using Set
        const uniqueCategories = [...new Set(allCategories)];
        return uniqueCategories;
    }, [episodes]);

    // Fetch cross-selling data
    const { data: crossSellingData, isLoading: isLoadingCrossSelling } = useCrossSellingEpisodes(
        { sponsorship_category: sponsorshipCategories },
        { enabled: episodes.length > 0 }
    );

    // Transform cross-selling data into ItemRow format
    const crossSellingItems = useMemo<ItemRowProperties[]>(() => {
        if (!crossSellingData?.data) {
            return [];
        }

        const { square_items: squareItems, category_items: categoryItems } = crossSellingData.data;
        const items: ItemRowProperties[] = [];

        // Process square items
        squareItems.forEach((squareItem: SquareItem, index: number) => {
            const metadata = getStudioShowCategoryMetadata({
                title: squareItem.square_item || squareItem.sponsorship_category,
                type: 'square',
                episodeName: squareItem.episode_name,
            });

            items.push({
                id: `square-${squareItem.episode_name}-${index}`,
                variant: 'recommended',
                icon: metadata.icon,
                iconBgColor: metadata.iconBgColor,
                name: `Square ${squareItem?.square_lable || ''} - ${squareItem?.square_type}`,
                // subtitle: squareItem.episode_name,
                subtitle: squareItem?.episode_title,
                price: '0',
                episodeName: squareItem.episode_name,
                buttonText: 'View',
                onAddToCart: () => {
                    const parameters = new URLSearchParams({
                        episode_name: squareItem.episode_name,
                    });
                    if (squareItem.square_id) {
                        parameters.append('square_id', squareItem.square_id);
                    }
                    navigate(`/sponsorship-type/studio-show/select-squares?${parameters.toString()}`);
                },
            });
        });

        // Process category items
        categoryItems.forEach((categoryItem: CategoryItem, index: number) => {
            const metadata = getStudioShowCategoryMetadata({
                title: categoryItem.item || categoryItem.sponsorship_category,
                type: 'category',
                episodeName: categoryItem.episode_name,
            });

            // Total price = Unit Sales Price + Reward Value
            const categoryRate = categoryItem?.category_rate ?? 0;
            const rewardRate = categoryItem?.custom_minimum_reward_rate ?? 0;
            const totalPrice = categoryRate + rewardRate;

            const episodeName = categoryItem.episode_name;
            const episodeTitle = categoryItem?.episode_title;
            const itemTitle = categoryItem?.sponsorship_category;
            const addedToCart = isItemInCart(episodeName, itemTitle);

            items.push({
                id: `category-${categoryItem.episode_name}-${index}`,
                variant: 'recommended',
                icon: metadata.icon,
                iconBgColor: metadata.iconBgColor,
                name: categoryItem.sponsorship_category || categoryItem.item,
                // subtitle: categoryItem?.episode_name,
                subtitle: episodeTitle,
                price: formatCurrency(totalPrice),
                isAddedToCart: addedToCart,
                onAddToCart: () => {
                    addItem({
                        episodeName,
                        episodeTitle,
                        title: itemTitle,
                        price: totalPrice,
                        sponsorship_category: categoryItem.sponsorship_category,
                        iconKey: metadata.iconKey,
                        iconBgColor: metadata.iconBgColor,
                        item_code: categoryItem.item || '',
                        usp: categoryItem.category_rate,
                        rv: categoryItem.custom_minimum_reward_rate,
                    });
                },
            });
        });

        return items;
    }, [crossSellingData, navigate, addItem, isItemInCart]);

    return {
        crossSellingData,
        isLoadingCrossSelling,
        sponsorshipCategories,
        crossSellingItems,
    };
};
