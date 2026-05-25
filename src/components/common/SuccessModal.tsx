/**
 * Reusable Success Modal Component
 * ---------------------------------
 * A flexible, composable modal for displaying success states across the application.
 *
 * Sections:
 * 1. Status Badge - Shows current status (e.g., "Pending Review", "Under Review")
 * 2. Description - Main confirmation message
 * 3. "What happens next?" - Optional section with steps/info (supports icons, bullets, or plain text)
 * 4. Action Buttons - Primary and secondary actions (supports both links and buttons)
 *
 * @example
 * <SuccessModal
 *   visible={showModal}
 *   onHide={() => setShowModal(false)}
 *   title="Registration Submitted Successfully"
 *   statusKey="pending_review"
 *   description="Your information has been submitted for verification."
 *   nextSteps={[
 *     { id: 'step-1', icon: <Clock />, text: "Verification takes 2-3 business days." },
 *     { id: 'step-2', text: "We'll notify you by email once approved." }
 *   ]}
 *   actions={[
 *     { id: 'action-1', label: "Go to Dashboard", to: "/dashboard", variant: "secondary" },
 *     { id: 'action-2', label: "Submit Again", onClick: handleSubmit, variant: "primary" }
 *   ]}
 * />
 */

import type { ReactNode } from 'react';
import ModalWrapper from './ModalWrapper';
import StatusBadge from './StatusBadge';
import DescriptionText from './DescriptionText';
import HeaderTitle from './HeaderTitle';
import ActionButton from './ActionButton';
import LinkButton from './LinkButton';
import { Confetti } from '../icons';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface NextStep {
    /** Unique identifier for the step */
    id: string;
    /** Optional icon to display before the text */
    icon?: ReactNode;
    /** The step/info text */
    text: string;
    /** Text weight for emphasis */
    weight?: 'normal' | 'medium' | 'semibold';
}

export interface SuccessModalAction {
    /** Unique identifier for the action */
    id: string;
    /** Button label */
    label: string;
    /** Navigation path (renders as LinkButton) */
    to?: string;
    /** Click handler (renders as ActionButton) */
    onClick?: () => void;
    /** Button style variant */
    variant: 'primary' | 'secondary';
}

export interface SuccessModalProperties {
    /** Controls modal visibility */
    visible: boolean;
    /** Called when modal is closed */
    onHide: () => void;

    // Header
    /** Custom icon (defaults to Confetti) */
    icon?: ReactNode;
    /** Modal title */
    title: string;
    /** Title text size */
    titleSize?: 'lg' | 'xl' | '2xl';
    /** Title font weight */
    titleWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    /** Modal width */
    modalSize?: 'sm' | 'md' | 'lg' | 'xl';
    /** Show close button */
    showCloseButton?: boolean;

    // Status Badge
    /** Status key for StatusBadge (e.g., 'pending_review', 'under_review') */
    statusKey?: string;
    /** Custom status label (overrides statusKey label) */
    statusLabel?: string;
    /** Status badge shape */
    statusShape?: 'pill' | 'square';

    // Description
    /** Main description text */
    description: string;

    // What happens next section
    /** Title for next steps section (defaults to "What happens next?") */
    nextStepsTitle?: string;
    /** Array of next step items */
    nextSteps?: NextStep[];
    /** Display style for next steps */
    nextStepsStyle?: 'icons' | 'bullets' | 'text';
    /** Additional info text below next steps */
    additionalInfo?: string;
    /** Additional info text weight */
    additionalInfoWeight?: 'normal' | 'medium' | 'semibold';

    // Actions
    /** Array of action buttons */
    actions?: SuccessModalAction[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

function SuccessModal({
    visible,
    onHide,
    icon,
    title,
    titleSize = '2xl',
    titleWeight = 'medium',
    modalSize = 'lg',
    showCloseButton = false,
    statusKey = 'pending_review',
    statusLabel,
    statusShape = 'square',
    description,
    nextStepsTitle = 'What happens next?',
    nextSteps,
    nextStepsStyle = 'text',
    additionalInfo,
    additionalInfoWeight = 'medium',
    actions,
}: SuccessModalProperties) {
    const defaultIcon = <Confetti size={32} color="#111827" />;

    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            showCloseButton={showCloseButton}
            icon={icon ?? defaultIcon}
            title={title}
            titleSize={titleSize}
            titleWeight={titleWeight}
            modalSize={modalSize}
        >
            {/* Section 1: Status Badge + Description */}
            <div className="flex flex-col gap-3">
                <StatusBadge statusKey={statusKey} label={statusLabel} shape={statusShape} className="text-[10px] w-fit p-1.5" />
                <DescriptionText text={description} size="sm" color="text-primary-text" weight="normal" />
            </div>

            {/* Section 2: What happens next? */}
            {nextSteps && nextSteps.length > 0 && (
                <div className="flex flex-col gap-3 pt-4 border-t border-border-gray-light">
                    <HeaderTitle text={nextStepsTitle} size="md" color="text-primary-text" weight="medium" />

                    {/* Render next steps based on style */}
                    {nextStepsStyle === 'icons' && (
                        <div className="flex flex-col gap-2">
                            {nextSteps.map(step => (
                                <div key={step.id} className="flex items-start gap-2">
                                    {step.icon && <span className="shrink-0 mt-0.5">{step.icon}</span>}
                                    <DescriptionText text={step.text} size="sm" color="text-primary-text" weight={step.weight ?? 'normal'} />
                                </div>
                            ))}
                        </div>
                    )}

                    {nextStepsStyle === 'bullets' && (
                        <ul className="list-disc list-inside flex flex-col gap-2 text-sm text-primary-text">
                            {nextSteps.map(step => (
                                <li key={step.id} className={`font-${step.weight ?? 'normal'}`}>
                                    {step.text}
                                </li>
                            ))}
                        </ul>
                    )}

                    {nextStepsStyle === 'text' && (
                        <div className="flex flex-col gap-2">
                            {nextSteps.map(step => (
                                <DescriptionText
                                    key={step.id}
                                    text={step.text}
                                    size="sm"
                                    color="text-primary-text"
                                    weight={step.weight ?? 'normal'}
                                />
                            ))}
                        </div>
                    )}

                    {/* Additional info text */}
                    {additionalInfo && <DescriptionText text={additionalInfo} size="sm" color="text-primary-text" weight={additionalInfoWeight} />}
                </div>
            )}

            {/* Section 3: Action Buttons */}
            {actions && actions.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mt-4">
                    {actions.map(action => {
                        const isSecondary = action.variant === 'secondary';

                        // Link-based action
                        if (action.to) {
                            const linkClassName = isSecondary
                                ? 'p-2 gap-2 flex items-center text-sm rounded bg-transparent border border-border-gray-600'
                                : 'p-2 gap-2 flex items-center text-sm rounded bg-brand-primary-500 border border-brand-primary-500';

                            return (
                                <LinkButton
                                    key={action.id}
                                    to={action.to}
                                    textColor={isSecondary ? 'text-primary-text' : 'text-white'}
                                    width="auto"
                                    className={linkClassName}
                                    onClick={onHide}
                                >
                                    {action.label}
                                </LinkButton>
                            );
                        }

                        // Button-based action
                        return (
                            <ActionButton
                                key={action.id}
                                bgColor={isSecondary ? 'bg-white' : 'bg-brand-primary-500'}
                                textColor={isSecondary ? 'text-primary-text' : 'text-white'}
                                borderColor={isSecondary ? 'border-gray-600' : 'border-brand-primary-500'}
                                borderRadius="rounded"
                                width="auto"
                                onClick={action.onClick}
                                className="min-h-9 text-sm font-normal leading-[22px] border w-fit"
                            >
                                {action.label}
                            </ActionButton>
                        );
                    })}
                </div>
            )}
        </ModalWrapper>
    );
}

export default SuccessModal;
