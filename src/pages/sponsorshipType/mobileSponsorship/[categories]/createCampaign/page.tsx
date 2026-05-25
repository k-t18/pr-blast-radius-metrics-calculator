import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CreateCampaignLayout from './components/layout/CreateCampaignLayout';
import '../../../../../styles/mobileSponsorshipStyles/createCampaignLayout.css';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import SponsorRewardCampaign from './components/SponsorRewardsCampaign';
import AdsCampaign from './components/AdsCampaign';
import { useMobileSponsorshipCategoriesStore, useCategoriesData } from '../../../../../stores/mobileSponsorshipCategoriesStore';
import { mapCategoryToSponsorshipType } from '../../../../../hooks/mobileSponsorship/useMobileGameSponsorshipCategory';

export default function CreateCampaignPage() {
    const [searchParameters] = useSearchParams();

    // Get categories data from Zustand store
    const categoriesData = useCategoriesData();
    const { categoriesParameter } = useMobileSponsorshipCategoriesStore();

    // Get first category ID from URL as default step
    const firstCategoryId = useMemo(() => {
        const categoryIds = searchParameters.get('categories')?.split(',') || searchParameters.get('category')?.split(',') || [];
        return categoryIds[0]?.trim() || '';
    }, [searchParameters]);

    const [currentStep, setCurrentStep] = useState(firstCategoryId);

    // Check if category is a reward type based on sponsorship type
    // Sponsor rewards categories are those from 'sponsor-rewards' route, or main categories (isMain === true) from 'both-rewards-ads' route
    const isRewardCategory = useMemo(() => {
        if (!categoriesParameter || !currentStep) return false;

        const sponsorshipType = mapCategoryToSponsorshipType(categoriesParameter);

        // If the route is 'sponsor_rewards', all categories are reward categories
        if (sponsorshipType === 'sponsor_rewards') {
            return categoriesData.some(item => item.id === currentStep);
        }

        // If the route is 'both', check if the current category is a main category (reward) or normal category (ad)
        // Main categories (isMain === true) are reward categories, normal categories (isMain === false) are ad categories
        if (sponsorshipType === 'both') {
            const currentCategory = categoriesData.find(item => item.id === currentStep);
            return currentCategory?.isMain === true;
        }

        return false;
    }, [currentStep, categoriesData, categoriesParameter]);

    const renderStepContent = () => {
        // If it's a reward category, show SponsorRewardCampaign
        if (isRewardCategory) {
            return <SponsorRewardCampaign />;
        }

        // For ad categories, show AdsCampaign
        if (currentStep) {
            return <AdsCampaign />;
        }
    };

    return (
        <div className="create-campaign-page">
            <div className="create-campaign-page-header">
                <HeaderTitle text="Create Campaign" size="2xl" weight="medium" disabled={false} />
            </div>
            <CreateCampaignLayout currentStep={currentStep} onStepChange={setCurrentStep}>
                {renderStepContent()}
            </CreateCampaignLayout>
        </div>
    );
}
