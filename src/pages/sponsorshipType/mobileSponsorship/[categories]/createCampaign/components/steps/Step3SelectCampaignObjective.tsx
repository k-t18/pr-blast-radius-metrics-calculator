import { useEffect } from 'react';
import ActionButton from '../../../../../../../components/common/ActionButton';
import useStepCollapseLogic from '../../hooks/useStepCollapseLogic';
import { useCreateCampaignContext } from '../../context/createCampaignContext';
import StepHeader from './StepHeader';
import CampaignObjectiveCard from './CampaignObjectiveCard';
import { useTargetAudienceFilterData } from '../../../../../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import { extractTargetAudienceFilterValues } from '../../utils/extractTargetAudienceFilterValues';
import { useBaseRateLogic } from '../../hooks/useBaseRateLogic';
import '../../../../../../../styles/mobileSponsorshipStyles/step3SelectCampaignObjective.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';

export interface CampaignObjective {
    id: string;
    name: string;
    description: string;
    baseCpmRate?: number;
    baseCpcRate?: number;
    isDefault?: boolean;
    icon: React.ReactNode;
    badge?: string;
    rateLabel?: string;
    customRateDisplay?: string;
    itemCode?: string; // Item code for API calls
}

interface Step3SelectCampaignObjectiveProperties {
    objectives?: CampaignObjective[];
}

export default function Step3SelectCampaignObjective({ objectives = [] }: Step3SelectCampaignObjectiveProperties) {
    const {
        objective: selectedObjective,
        updateCategoryData,
        budget,
        selectedFilters,
        fieldValues,
        currentCategoryId,
        unmarkSubStepAsCompleted,
    } = useCreateCampaignContext();

    const { isCollapsed, handleSaveAndContinue, handleEdit, isStepCompleted } = useStepCollapseLogic(3);
    const { targetAudienceFilterData } = useTargetAudienceFilterData();

    // Set Visibility as default if no objective is selected
    useEffect(() => {
        const defaultObjective = objectives.find(objective => objective.isDefault) || objectives.find(objective => objective.id === 'visibility');
        if (!selectedObjective && defaultObjective) {
            updateCategoryData(previous => ({ ...previous, objective: defaultObjective.id }));
        }
    }, [selectedObjective, objectives, updateCategoryData]);

    // Handle objective change and unmark if cleared
    const handleObjectiveChange = (objectiveId: string) => {
        updateCategoryData(previous => ({ ...previous, objective: objectiveId }));
        // If objective is cleared and step was completed, unmark it
        if (!objectiveId && isStepCompleted && currentCategoryId) {
            unmarkSubStepAsCompleted(currentCategoryId, 3);
        }
    };

    // Extract all filter values (checkboxes, dropdowns, multiselects, radios) - comma-separated format
    // Format: "target_audience-0172,target_audience-0183,value1,value2"
    const targetAudience = extractTargetAudienceFilterValues(selectedFilters, fieldValues, targetAudienceFilterData);

    // Determine which objectives to fetch rates for
    const availableObjectiveIds = new Set(objectives.map(object => object.id));
    const objectivesToFetch: string[] = [];
    if (availableObjectiveIds.has('visibility')) {
        objectivesToFetch.push('visibility');
    }
    if (availableObjectiveIds.has('engagement')) {
        objectivesToFetch.push('engagement');
    }

    // Use shared hook for rate fetching
    const { visibilityRate, engagementRate } = useBaseRateLogic({
        targetAudience,
        budget,
        objective: selectedObjective,
        objectivesToFetch,
    });

    // Update objectives card base rate fetched rates from API
    const objectivesWithRates = objectives.map(objective => {
        if (objective.id === 'visibility' && visibilityRate) {
            return {
                ...objective,
                baseCpmRate: visibilityRate.old_base_rate,
                customRateDisplay: `Base CPM Rate: ₦ ${visibilityRate.old_base_rate}`,
            };
        }
        if (objective.id === 'engagement' && engagementRate) {
            return {
                ...objective,
                baseCpcRate: engagementRate.old_base_rate,
                rateLabel: 'Base CPC Rate:',
                customRateDisplay: `Base CPC Rate: ₦ ${engagementRate.old_base_rate}`,
            };
        }
        if (objective.id === 'both' && visibilityRate && engagementRate) {
            return {
                ...objective,
                baseCpmRate: visibilityRate.old_base_rate,
                baseCpcRate: engagementRate.old_base_rate,
                customRateDisplay: `Base CPM Rate: ₦ ${visibilityRate.old_base_rate} | Base CPC Rate: ₦ ${engagementRate.old_base_rate}`,
            };
        }
        return {
            ...objective,
            baseCpmRate: undefined,
            baseCpcRate: undefined,
            customRateDisplay: undefined,
        };
    });

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            <StepHeader title="Step 3. Select Campaign Objective" isCollapsed={isCollapsed} onEdit={handleEdit} />

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                <div className="objectives-section">
                    {objectivesWithRates.map(objective => (
                        <CampaignObjectiveCard
                            key={objective.id}
                            icon={objective.icon}
                            name={objective.name}
                            radioId={objective.id}
                            description={objective.description}
                            cpmRate={objective.baseCpmRate}
                            cpcRate={objective.baseCpcRate}
                            isSelected={selectedObjective === objective.id}
                            onClick={() => handleObjectiveChange(objective.id)}
                            isDefault={objective.isDefault}
                            badge={objective.badge}
                            rateLabel={objective.rateLabel}
                            customRateDisplay={objective.customRateDisplay}
                        />
                    ))}
                </div>

                {selectedObjective && (!isStepCompleted || !isCollapsed) && (
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
