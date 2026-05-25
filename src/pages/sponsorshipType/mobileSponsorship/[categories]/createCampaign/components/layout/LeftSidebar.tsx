import ProgressIndicator from '../../../../../../../components/common/ProgressIndicator';
import { Check } from '../../../../../../../components/icons';
import { useCreateCampaignContext } from '../../context/createCampaignContext';
import { useMobileSponsorshipCategoriesStore } from '../../../../../../../stores/mobileSponsorshipCategoriesStore';
import { useCampaignLeftSidebarCategoryLogic } from '../../hooks/useCampaignLeftSidebarCategoryLogic';
import '../../../../../../../styles/mobileSponsorshipStyles/leftSidebar.css';

interface LeftSidebarProperties {
    currentStep: string;
    onStepChange: (step: string) => void;
}

export default function LeftSidebar({ currentStep, onStepChange }: LeftSidebarProperties) {
    const { isCategoryEnabled } = useCreateCampaignContext();
    const { isLoading } = useMobileSponsorshipCategoriesStore();

    const { leftSidebarCategories, effectiveCurrentStep, getStepProgress, handleCategoryClick } = useCampaignLeftSidebarCategoryLogic(
        currentStep,
        onStepChange
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg text-secondary-text">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="left-sidebar">
            <nav className="left-sidebar-nav">
                {leftSidebarCategories.map(category => {
                    const progress = getStepProgress(category.id);
                    const isComplete = progress === 100;
                    const isEnabled = isCategoryEnabled(category.id);
                    const isDisabled = !isEnabled;
                    return (
                        <button
                            key={category.id}
                            type="button"
                            className={`left-sidebar-step ${effectiveCurrentStep === category.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!isDisabled) {
                                    handleCategoryClick(category.id, category.itemCode);
                                }
                            }}
                            disabled={isDisabled}
                            title={isDisabled ? 'Complete previous categories to unlock' : ''}
                        >
                            {isComplete ? (
                                <div className="left-sidebar-step-check-container" style={{ width: 44, height: 44, position: 'relative' }}>
                                    <svg width={44} height={44} className="left-sidebar-step-check-circle">
                                        {/* Dark green outer ring */}
                                        <circle cx={22} cy={22} r={18} fill="none" stroke="var(--color-success-700)" strokeWidth={4} />
                                        {/* Lighter green inner circle */}
                                        <circle cx={22} cy={22} r={15} fill="var(--color-success-100)" />
                                    </svg>
                                    <div
                                        className="left-sidebar-step-check"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Check size={18} color="var(--color-success-700)" />
                                    </div>
                                </div>
                            ) : (
                                <ProgressIndicator
                                    progress={progress}
                                    size={42}
                                    strokeWidth={4}
                                    showPercentage
                                    isActive={effectiveCurrentStep === category.id}
                                />
                            )}
                            <span className="left-sidebar-step-label">{category.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
