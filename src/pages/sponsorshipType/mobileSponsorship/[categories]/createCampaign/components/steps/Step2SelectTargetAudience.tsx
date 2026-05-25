import ActionButton from '../../../../../../../components/common/ActionButton';
import HierarchicalFilterPanel from '../../../../../../../components/form-fields/HierarchicalFilterPanel';
import useTargetAudienceFilterLogic from '../../hooks/useTargetAudienceFilterLogic';
import StepHeader from './StepHeader';
import '../../../../../../../styles/mobileSponsorshipStyles/step2SelectTargetAudience.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';
import { useTargetAudienceFilterData } from '../../../../../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import Step2SelectTargetAudienceSkeleton from '../../../../skeleton/step2SelectTargetAudienceSkeleton';

export default function Step2SelectTargetAudience() {
    // Fetch filter sections data from API
    const { targetAudienceFilterData, isLoading, error } = useTargetAudienceFilterData();

    // Use the campaign filter hook for filter logic and UI state
    const {
        selectedFilters,
        fieldValues,
        setFieldValues,
        isOptionFullySelected,
        isOptionPartiallySelected,
        handleFilterChange,
        expandedSections,
        expandedOptions,
        isCollapsed,
        isStepCompleted,
        toggleSection,
        toggleOption,
        handleSaveAndContinue,
        handleEdit,
    } = useTargetAudienceFilterLogic(targetAudienceFilterData);

    // Show loading state
    if (isLoading) {
        return <Step2SelectTargetAudienceSkeleton />;
    }

    // Show error state
    if (error) {
        return (
            <div className="step-container">
                <StepHeader title="Step 2. Select Target Audience" isCollapsed={false} onEdit={handleEdit} />
                <div className="step-content step-content-expanded">
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Error loading target audience filters. Please try again.</div>
                </div>
            </div>
        );
    }

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            <StepHeader title="Step 2. Select Target Audience" isCollapsed={isCollapsed} onEdit={handleEdit} />

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                <HierarchicalFilterPanel
                    filterSections={targetAudienceFilterData}
                    selectedFilters={selectedFilters}
                    fieldValues={fieldValues}
                    expandedSections={expandedSections}
                    expandedOptions={expandedOptions}
                    handleFilterChange={handleFilterChange}
                    setFieldValues={
                        setFieldValues as (value: Record<string, unknown> | ((previous: Record<string, unknown>) => Record<string, unknown>)) => void
                    }
                    toggleSection={toggleSection}
                    toggleOption={toggleOption}
                    isOptionFullySelected={isOptionFullySelected}
                    isOptionPartiallySelected={isOptionPartiallySelected}
                    emptyMessage="No target audience filters available."
                />

                {(!isStepCompleted || !isCollapsed) && (
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
