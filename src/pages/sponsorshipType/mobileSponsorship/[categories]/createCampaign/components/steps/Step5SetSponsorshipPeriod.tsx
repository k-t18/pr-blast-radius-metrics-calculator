import { useMemo } from 'react';
import ActionButton from '../../../../../../../components/common/ActionButton';
import DateInput from '../../../../../../../components/common/DateInput';
import { CustomDropdown, type DropdownOption } from '../../../../../../../components/common/Dropdown';
import useStepCollapseLogic from '../../hooks/useStepCollapseLogic';
import { useCreateCampaignContext } from '../../context/createCampaignContext';
import StepHeader from './StepHeader';
import { useSquareTypeAndRowList } from '../../../../../../../hooks/mobileSponsorship/useSquareTypeAndRowList';
import { type PeriodItem } from '../../../../../../../services/sponsor_api/getSquareTypeAndRowList.api';
import '../../../../../../../styles/mobileSponsorshipStyles/step5SetSponsorshipPeriod.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';

export default function Step5SetSponsorshipPeriod() {
    const { startDate, duration, updateCategoryData, currentCategoryId, unmarkSubStepAsCompleted } = useCreateCampaignContext();
    const { isCollapsed, handleSaveAndContinue, handleEdit, isStepCompleted } = useStepCollapseLogic(5);
    const { squareTypeAndRowListData, isLoading } = useSquareTypeAndRowList();

    const durationOptions: DropdownOption[] = useMemo(() => {
        if (!squareTypeAndRowListData?.period) return [];
        return squareTypeAndRowListData.period.map((item: PeriodItem) => ({
            label: item.name,
            value: item.name,
        }));
    }, [squareTypeAndRowListData]);

    const handleDateChange = (value: string) => {
        updateCategoryData(previous => ({ ...previous, startDate: value }));
        // If date is cleared and step was completed, unmark it
        if (!value && isStepCompleted && currentCategoryId) {
            unmarkSubStepAsCompleted(currentCategoryId, 5);
        }
    };

    const handleDurationChange = (value: DropdownOption | undefined) => {
        updateCategoryData(previous => ({ ...previous, duration: value }));
        // If duration is cleared and step was completed, unmark it
        if (!value && isStepCompleted && currentCategoryId) {
            unmarkSubStepAsCompleted(currentCategoryId, 5);
        }
    };

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            <StepHeader title="Step 5. Set sponsorship period" isCollapsed={isCollapsed} onEdit={handleEdit} />

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                <div className="period-inputs-section">
                    <div className="period-input-group">
                        <DateInput
                            id="start-date"
                            name="start-date"
                            label="Select start date"
                            value={startDate}
                            onChange={handleDateChange}
                            dateFormat="dd-mm-yy"
                            className="period-date-input"
                            labelClassName="sponsor-period-label"
                            placeholder="dd-mm-yyyy"
                        />
                    </div>

                    <div className="period-input-group">
                        <CustomDropdown
                            id="duration"
                            label="Select Duration (in Days)"
                            options={durationOptions}
                            value={duration}
                            onChange={handleDurationChange}
                            placeholder={isLoading ? 'Loading...' : 'Select'}
                            width="100%"
                            className="period-duration-input"
                            labelClassName="sponsor-period-label"
                        />
                    </div>
                </div>

                {startDate && duration && (!isStepCompleted || !isCollapsed) && (
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
