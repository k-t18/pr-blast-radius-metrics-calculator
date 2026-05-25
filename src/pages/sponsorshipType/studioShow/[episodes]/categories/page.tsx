import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import BackButton from '../../../../../components/common/BackButton';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import CategoryCard from '../../../../../components/cards/CategoryCard';
import DescriptionText from '../../../../../components/common/DescriptionText';
import LinkButton from '../../../../../components/common/LinkButton';
import { ShoppingCart } from '../../../../../components/icons';
import FloatingContainer from '../../../../../components/common/FloatingContainer';
import useStudioShowEpisodeCategories from '../../../../../hooks/studioShow/useStudioShowEpisodeCategories';
import type { EpisodeCategoryItem } from '../../../../../services/studioShow/getStudioShowEpisodeCategories.api';
import type { getStudioShowCategoryMetadata } from '../../../../../utils/studioShowCategoryMetadata';
import { useStudioShowCart } from '../../../../../hooks/studioShow/useStudioShowCart';

function SponsorshipStudioShowCategoriesPage() {
    const { episode } = useParams<{ episode: string }>();
    const [searchParameters] = useSearchParams();
    // Decode episode name in case it's URL-encoded
    const episodeName = episode ? decodeURIComponent(episode) : undefined;
    const episodeTitle = searchParameters.get('episode_title') || episodeName || '';
    const { categoriesList, mainCategories, normalCategories, isLoading, error } = useStudioShowEpisodeCategories(episodeName);
    const { addItem, isItemInCart } = useStudioShowCart();
    const navigate = useNavigate();

    // Store the current episode name in sessionStorage when visiting this page
    useEffect(() => {
        if (episodeName) {
            sessionStorage.setItem('lastVisitedEpisode', episodeName);
        }
    }, [episodeName]);

    // Handle back button click - navigate to studio show episodes page
    const handleBackClick = () => {
        navigate('/sponsorship-type/studio-show');
    };
    const handleAddToCart = (category: EpisodeCategoryItem, metadata: ReturnType<typeof getStudioShowCategoryMetadata>) => {
        if (!episodeName) {
            return;
        }
        if (category.type === 'square') {
            navigate(`/sponsorship-type/studio-show/select-squares?episode_name=${encodeURIComponent(episodeName)}`);
            return;
        }
        // Total price = Unit Sales Price + Reward Value
        const categoryRate = category?.category_rate ?? category?.rate ?? 0;
        const rewardRate = category?.custom_minimum_reward_rate ?? category?.minimum_reward_rate ?? 0;
        const totalPrice = categoryRate + rewardRate;

        addItem({
            episodeName,
            episodeTitle,
            title: category?.sponsorship_category,
            price: totalPrice,
            sponsorship_category: category.sponsorship_category,
            row: category?.row,
            status: category.status || category?.square_status,
            iconKey: metadata.iconKey,
            iconBgColor: metadata.iconBgColor,
            showSelectSquareBtn: category.type === 'square',
            item_code: category.item || '',
            usp: category?.category_rate || category?.rate,
            rv: category?.custom_minimum_reward_rate || category?.minimum_reward_rate,
            custom_minimum_reward_rate: category?.custom_minimum_reward_rate,
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <BackButton onClick={handleBackClick} />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Categories" size="2xl" weight="medium" disabled={false} />
                    <DescriptionText text="Add to cart categories you would like to sponsor" color="text-secondary-text" size="sm" weight="medium" />
                </div>
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="Loading categories..." color="text-secondary-text" size="md" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-6">
                <BackButton onClick={handleBackClick} />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Categories" size="2xl" weight="medium" disabled={false} />
                    <DescriptionText text="Add to cart categories you would like to sponsor" color="text-secondary-text" size="sm" weight="medium" />
                </div>
                <div className="flex items-center justify-center py-12">
                    <DescriptionText
                        text={error instanceof Error ? error.message : 'Failed to load categories. Please try again.'}
                        color="text-red-600"
                        size="md"
                    />
                </div>
            </div>
        );
    }

    if (categoriesList.length === 0) {
        return (
            <div className="flex flex-col gap-6">
                <BackButton onClick={handleBackClick} />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Categories" size="2xl" weight="medium" disabled={false} />
                    <DescriptionText text="Add to cart categories you would like to sponsor" color="text-secondary-text" size="sm" weight="medium" />
                </div>
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="No categories available" color="text-secondary-text" size="md" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                <BackButton onClick={handleBackClick} />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Categories" size="2xl" weight="medium" disabled={false} />
                    <DescriptionText text="Add to cart categories you would like to sponsor" color="text-secondary-text" size="sm" weight="medium" />
                </div>

                {/* Main categories: 2-column grid */}
                {mainCategories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {mainCategories.map(({ category, metadata, displayPrice }) => (
                            <CategoryCard
                                key={category?.name}
                                title={category?.sponsorship_category}
                                price={displayPrice}
                                tag={category?.status || category?.square_status || ''}
                                type={category?.type}
                                description={category?.description || ''}
                                showAddToCartButton
                                isAddedToCart={isItemInCart(episodeName, category.sponsorship_category)}
                                onAddToCart={() => handleAddToCart(category, metadata)}
                                episodeName={episodeName}
                                viewDetailsLabel={metadata.detailsLabel}
                                viewDetailsLink={metadata.detailsLink}
                            />
                        ))}
                    </div>
                )}

                {/* Normal categories: 3-column grid */}
                {normalCategories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {normalCategories.map(({ category, metadata, displayPrice }) => (
                            <CategoryCard
                                key={category?.name}
                                title={category?.sponsorship_category}
                                price={displayPrice}
                                tag={category?.status || category?.square_status || ''}
                                type={category?.type}
                                description={category?.description || ''}
                                showAddToCartButton
                                isAddedToCart={isItemInCart(episodeName, category.sponsorship_category)}
                                onAddToCart={() => handleAddToCart(category, metadata)}
                                episodeName={episodeName}
                                viewDetailsLabel={metadata.detailsLabel}
                                viewDetailsLink={metadata.detailsLink}
                            />
                        ))}
                    </div>
                )}
            </div>
            <FloatingContainer className="flex justify-end border-0! px-6! py-3.5! shadow-none!" borderRadius="0" bottom="-8px" zIndex={2}>
                <LinkButton
                    to="/cart"
                    textColor="text-white"
                    width="auto"
                    className="py-2! px-7 border flex gap-2 items-center bg-brand-primary-500 rounded-lg"
                >
                    <ShoppingCart size={24} />
                    View Cart
                </LinkButton>
            </FloatingContainer>
        </>
    );
}

export default SponsorshipStudioShowCategoriesPage;
