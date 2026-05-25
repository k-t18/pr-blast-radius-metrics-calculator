import Step1ForAds from './steps/Step1ForAds';
import Step2SelectTargetAudience from './steps/Step2SelectTargetAudience';
import Step3SelectCampaignObjective from './steps/Step3SelectCampaignObjective';
import Step4SetBudget from './steps/Step4SetBudget';
import Step5SetSponsorshipPeriod from './steps/Step5SetSponsorshipPeriod';
import CampaignWrapper from './CampaignWrapper';
import { adsCampaignObjectives } from '../../../dataset/mobileSponsorshipData';
import '../../../../../../styles/mobileSponsorshipStyles/sponsorRewardsCampaign.css';

function AdsCampaign() {
    return (
        <CampaignWrapper
            renderSteps={() => (
                <>
                    <Step1ForAds />
                    <Step2SelectTargetAudience />
                    <Step3SelectCampaignObjective objectives={adsCampaignObjectives} />
                    <Step4SetBudget />
                    <Step5SetSponsorshipPeriod />
                </>
            )}
        />
    );
}

export default AdsCampaign;
