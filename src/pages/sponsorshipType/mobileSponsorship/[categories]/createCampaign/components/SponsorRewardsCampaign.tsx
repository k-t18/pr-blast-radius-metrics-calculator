import { useEffect } from 'react';
import { useCreateCampaignContext } from '../context/createCampaignContext';
import Step1SelectSquares from './steps/Step1SelectSquares';
import Step2SelectTargetAudience from './steps/Step2SelectTargetAudience';
import Step3SelectCampaignObjective from './steps/Step3SelectCampaignObjective';
import Step4SetBudget from './steps/Step4SetBudget';
import Step5SetSponsorshipPeriod from './steps/Step5SetSponsorshipPeriod';
import WeeklyLeaderBoard from './steps/WeeklyLeaderBoard';
import CampaignWrapper from './CampaignWrapper';
import { isWeeklyLeaderboardCategory } from '../constants/categoryIds';
import { sponsorRewardsCampaignObjectives } from '../../../dataset/mobileSponsorshipData';
import '../../../../../../styles/mobileSponsorshipStyles/sponsorRewardsCampaign.css';
import '../../../../../../styles/mobileSponsorshipStyles/step5SetSponsorshipPeriod.css';

/**
 * Hook to handle total steps synchronization for weekly leaderboard categories
 * Encapsulates the useEffect that sets total steps based on category type
 */
function useSyncTotalSteps(isWeeklyLeaderboard: boolean) {
    const { currentCategoryId, setTotalSteps } = useCreateCampaignContext();

    useEffect(() => {
        if (isWeeklyLeaderboard) {
            setTotalSteps(currentCategoryId, 1);
        } else {
            setTotalSteps(currentCategoryId, 5);
        }
    }, [currentCategoryId, isWeeklyLeaderboard, setTotalSteps]);
}

function SponsorRewardCampaign() {
    const { currentCategoryId } = useCreateCampaignContext();
    const isWeeklyLeaderboard = isWeeklyLeaderboardCategory(currentCategoryId);

    // Sync total steps for this category type
    useSyncTotalSteps(isWeeklyLeaderboard);

    return (
        <CampaignWrapper
            renderSteps={() => {
                // Render Weekly Leaderboard step if category is weekly-leaderboard
                if (isWeeklyLeaderboard) {
                    return <WeeklyLeaderBoard />;
                }

                // Standard 5-step flow for other sponsor rewards categories
                return (
                    <>
                        <Step1SelectSquares />
                        <Step2SelectTargetAudience />
                        <Step3SelectCampaignObjective objectives={sponsorRewardsCampaignObjectives} />
                        <Step4SetBudget />
                        <Step5SetSponsorshipPeriod />
                    </>
                );
            }}
        />
    );
}

export default SponsorRewardCampaign;
