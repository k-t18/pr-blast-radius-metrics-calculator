import ActionButton from '../../../../../../../components/common/ActionButton';
import InputField from '../../../../../../../components/form-fields/inputField/InputField';
import useStepCollapseLogic from '../../hooks/useStepCollapseLogic';
import { useCreateCampaignContext } from '../../context/createCampaignContext';
import StepHeader from './StepHeader';
import '../../../../../../../styles/mobileSponsorshipStyles/step1ForAds.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';

export default function Step1ForAds() {
    const { campaignName, updateCategoryData, currentCategoryId, unmarkSubStepAsCompleted } = useCreateCampaignContext();
    const { isCollapsed, handleSaveAndContinue, handleEdit, isStepCompleted } = useStepCollapseLogic(1);

    const handleCampaignNameChange = (value: string) => {
        updateCategoryData(previous => ({ ...previous, campaignName: value }));
        // If field is cleared and step was completed, unmark it
        if (value.trim().length === 0 && isStepCompleted && currentCategoryId) {
            unmarkSubStepAsCompleted(currentCategoryId, 1);
        }
    };

    // Show Save & Continue button if:
    // 1. Field has value AND
    // 2. (Step is not completed OR step is expanded/not collapsed)
    // This allows saving when switching categories and coming back with data
    const showSaveButton = campaignName.trim().length > 0 && (!isStepCompleted || !isCollapsed);

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            <StepHeader title="Step 1. Name the Campaign" isCollapsed={isCollapsed} onEdit={handleEdit} />

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                <div className="campaign-name-input-section">
                    <InputField
                        id="campaignName"
                        name="campaignName"
                        type="text"
                        value={campaignName}
                        onChange={handleCampaignNameChange}
                        className="campaign-name-input"
                        style={{ width: '100%' }}
                        placeholder="Enter campaign name"
                    />
                </div>

                {showSaveButton && (
                    <div className="step-actions">
                        <ActionButton
                            bgColor="bg-brand-500"
                            textColor="text-white"
                            width="auto"
                            className="save-continue-button font-ubuntu"
                            onClick={handleSaveAndContinue}
                        >
                            Save & Continue
                        </ActionButton>
                    </div>
                )}
            </div>
        </div>
    );
}
