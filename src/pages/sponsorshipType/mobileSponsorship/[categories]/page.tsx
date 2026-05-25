/**
 * Mobile Sponsorship Categories Page
 *
 * Displays categories based on the selected sponsorship type.
 */
import { useParams } from 'react-router-dom';
import SelectRewards from '../components/SelectRewards';
import SelectAds from '../components/SelectAds';
import SelectRewardsAndAdsBoth from '../components/SelectRewardsAndAdsBoth';
import { useMobileGameSponsorshipCategory } from '../../../../hooks/mobileSponsorship/useMobileGameSponsorshipCategory';
import LinkButton from '../../../../components/common/LinkButton';
import SelectRewardsAndAdsBothSkeleton from '../skeleton/selectRewardsAndAdsBoth';

export type { CategoryItem } from './createCampaign/utils/mobileSponsorshipCategoryUtils';

export default function SelectCategoriesPage() {
    const { categories } = useParams<{ categories: string }>();
    const { categoriesData, isLoading, error } = useMobileGameSponsorshipCategory(categories, true);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <h2 className="text-center text-xl font-semibold text-secondary-text">Error Loading Categories</h2>
                <p className="text-center text-lg font-medium text-secondary-text">{error.message}</p>
                <LinkButton
                    to="/sponsorship-type/mobile-sponsorship"
                    textColor="text-brand-primary-500"
                    fontSize="text-sm"
                    width="full"
                    align="center"
                    className="text-center text-lg font-medium text-brand-primary-500"
                >
                    Back to sponsorship types
                </LinkButton>
            </div>
        );
    }

    // Show loading state or render components
    if (isLoading) {
        return <SelectRewardsAndAdsBothSkeleton />;
    }

    // Render the appropriate component based on the sponsorship type
    if (categories === 'sponsor-rewards') {
        return <SelectRewards categoriesData={categoriesData} />;
    }

    if (categories === 'run-ad-campaigns') {
        return <SelectAds categoriesData={categoriesData} />;
    }

    if (categories === 'both-rewards-ads') {
        return <SelectRewardsAndAdsBoth categoriesData={categoriesData} />;
    }

    return (
        <>
            <p className="text-center text-lg font-medium text-secondary-text">No categories found</p>
            <LinkButton
                to="/sponsorship-type/mobile-sponsorship"
                textColor="text-brand-primary-500"
                fontSize="text-sm"
                width="full"
                align="center"
                className="text-center text-lg font-medium text-brand-primary-500"
            >
                Back to sponsorship types
            </LinkButton>
        </>
    );
}
