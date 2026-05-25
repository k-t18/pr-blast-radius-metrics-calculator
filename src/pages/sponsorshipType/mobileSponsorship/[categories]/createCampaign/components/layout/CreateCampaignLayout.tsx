import type { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import '../../../../../../../styles/mobileSponsorshipStyles/createCampaignLayout.css';
import { CreateCampaignProvider } from '../../context/createCampaignContext';
import { isWeeklyLeaderboardCategory } from '../../constants/categoryIds';

interface CreateCampaignLayoutProperties {
    children: ReactNode;
    currentStep: string;
    onStepChange: (step: string) => void;
}

export default function CreateCampaignLayout({ children, currentStep, onStepChange }: CreateCampaignLayoutProperties) {
    // Hide right sidebar for weekly leaderboard categories
    const isWeeklyLeaderboard = isWeeklyLeaderboardCategory(currentStep);

    return (
        <CreateCampaignProvider currentCategoryId={currentStep} onStepChange={onStepChange}>
            <div className="create-campaign-layout">
                <LeftSidebar currentStep={currentStep} onStepChange={onStepChange} />
                <div className="create-campaign-content" key={currentStep}>
                    {children}
                </div>
                {!isWeeklyLeaderboard && <RightSidebar />}
            </div>
        </CreateCampaignProvider>
    );
}
