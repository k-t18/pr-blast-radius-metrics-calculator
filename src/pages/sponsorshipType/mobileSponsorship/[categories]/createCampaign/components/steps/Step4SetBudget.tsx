import ActionButton from '../../../../../../../components/common/ActionButton';
import InputField from '../../../../../../../components/form-fields/inputField/InputField';
import useStepCollapseLogic from '../../hooks/useStepCollapseLogic';
import { useCreateCampaignContext } from '../../context/createCampaignContext';
import StepHeader from './StepHeader';
import '../../../../../../../styles/mobileSponsorshipStyles/step4SetBudget.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';

const formatCurrency = (value: number) => {
    return value.toLocaleString();
};

const parseCurrency = (value: string) => {
    return Number.parseInt(value.replaceAll(',', ''), 10) || 0;
};

export default function Step4SetBudget() {
    const { budget, updateCategoryData, currentCategoryId, unmarkSubStepAsCompleted } = useCreateCampaignContext();
    const { isCollapsed, handleSaveAndContinue, handleEdit, isStepCompleted } = useStepCollapseLogic(4);

    const handleBudgetChange = (value: string) => {
        const parsed = parseCurrency(value);
        updateCategoryData(previous => ({ ...previous, budget: parsed }));
        // If budget is cleared and step was completed, unmark it
        if (parsed === 0 && isStepCompleted && currentCategoryId) {
            unmarkSubStepAsCompleted(currentCategoryId, 4);
        }
    };

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            <StepHeader title="Step 4. Set Budget" isCollapsed={isCollapsed} onEdit={handleEdit} />

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                <div className="budget-input-section">
                    <InputField
                        id="budget"
                        name="budget"
                        type="text"
                        value={budget > 0 ? formatCurrency(budget) : ''}
                        onChange={handleBudgetChange}
                        className="budget-input"
                        prefixIcon={<span className="currency-symbol">₦</span>}
                    />
                </div>

                {budget > 0 && (!isStepCompleted || !isCollapsed) && (
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
