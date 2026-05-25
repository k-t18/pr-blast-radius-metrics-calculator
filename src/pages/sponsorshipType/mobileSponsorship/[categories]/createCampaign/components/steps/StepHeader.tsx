import { PencilSimpleIcon } from '@phosphor-icons/react';
import { Trash } from '../../../../../../../components/icons';

interface StepHeaderProperties {
    title: string;
    isCollapsed: boolean;
    onEdit: () => void;
    onDelete?: () => void;
    titleClassName?: string;
}

/**
 * Reusable step header component
 * Displays the step title and edit button
 *
 * @param title - The title text to display
 * @param isCollapsed - Whether the step is currently collapsed
 * @param onEdit - Callback function when edit button is clicked
 * @param onDelete - Optional callback for delete button
 * @param titleClassName - Optional class name for the title text
 */
export default function StepHeader({ title, isCollapsed, onEdit, onDelete, titleClassName }: StepHeaderProperties) {
    return (
        <div className="step-header">
            <div className="step-header-content">
                <h2 className={`step-title ${titleClassName || ''}`}>{title}</h2>
                <div className={`flex items-center gap-2 ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button type="button" className="edit-step-button edit-step-button-visible" onClick={onEdit} aria-label="Edit step">
                        <PencilSimpleIcon size={20} color="currentColor" />
                    </button>
                    {onDelete && (
                        <button
                            type="button"
                            className="edit-step-button edit-step-button-visible text-gray-400 hover:text-red-500"
                            onClick={onDelete}
                            aria-label="Delete step"
                        >
                            <Trash size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
