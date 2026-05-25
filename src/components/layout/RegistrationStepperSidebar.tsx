/**
 * RegistrationStepperSidebar Component
 *
 * A vertical stepper component for the sponsor registration flow.
 * Shows 8 steps with icons, allows navigation back to completed steps only.
 */

import { Building, LocationPin, Contact, HandHeart, BookOpenText, Check, Images, Target as _Target } from '../icons';
import '../../styles/registrationStepperSidebar.css';

interface Step {
    number: number;
    title: string;
    icon: React.ElementType;
}

const STEPS: Step[] = [
    { number: 1, title: 'Company Overview', icon: Building },
    { number: 2, title: 'Addresses & Locations', icon: LocationPin },
    { number: 3, title: 'Primary Contact', icon: Contact },
    { number: 4, title: 'Bank Details', icon: Building },
    { number: 5, title: 'Sponsorship & CSR', icon: HandHeart },
    { number: 6, title: 'Upload Documents', icon: Images },
    // TODO: Temporarily hidden - uncomment when Target Audience feature is ready
    // { number: 7, title: 'Target Audience', icon: Target },
    { number: 8, title: 'Review and Consent', icon: BookOpenText },
];

export interface RegistrationStepperSidebarProperties {
    /** Current active step (1-8) */
    currentStep: number;
    /** Array of completed step numbers */
    completedSteps: number[];
    /** Callback when a step is clicked */
    onStepClick: (step: number) => void;
}

function RegistrationStepperSidebar({ currentStep, completedSteps, onStepClick }: RegistrationStepperSidebarProperties) {
    const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
    const isStepCurrent = (stepNumber: number) => currentStep === stepNumber;
    const isStepClickable = (stepNumber: number) => {
        // Can click on completed steps or current step
        const maxAllowedStep = Math.max(...completedSteps, 0) + 1;
        return stepNumber <= maxAllowedStep;
    };

    const handleStepClick = (stepNumber: number) => {
        if (isStepClickable(stepNumber) && stepNumber <= currentStep) {
            onStepClick(stepNumber);
        }
    };

    const handleKeyActivate = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleStepClick(Number((event.currentTarget as HTMLElement)?.dataset?.step ?? 0));
        }
    };

    return (
        <div className="registration-stepper">
            <div className="stepper-header" />

            <div className="stepper-steps">
                {STEPS.map((step, _index) => {
                    const Icon = step.icon;
                    const completed = isStepCompleted(step.number);
                    const current = isStepCurrent(step.number);
                    const clickable = isStepClickable(step.number) && step.number <= currentStep;

                    return (
                        <div key={step.number} className="step-wrapper">
                            <div
                                className={`step-item ${current ? 'step-current' : ''} ${completed ? 'step-completed' : ''} ${clickable ? 'step-clickable' : 'step-disabled'}`}
                                onClick={() => handleStepClick(step.number)}
                                role="button"
                                tabIndex={clickable ? 0 : -1}
                                aria-label={`Step ${step.number}: ${step.title}`}
                                aria-current={current ? 'step' : undefined}
                                data-step={step.number}
                                onKeyDown={handleKeyActivate}
                            >
                                {/* Step Indicator */}
                                <div className="step-indicator">
                                    <div className="step-number-circle">
                                        {completed ? <Check size={18} /> : <span className="step-number">{step.number}</span>}
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div className="step-content-registration-sidebar">
                                    <div className="step-icon-wrapper">
                                        <Icon size={18} weight="regular" className="step-icon" />
                                    </div>
                                    <span className="step-title">{step.title}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RegistrationStepperSidebar;
