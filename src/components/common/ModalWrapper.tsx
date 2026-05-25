/**
 * Reusable Modal Wrapper Component
 * --------------------------------
 * This component wraps the PrimeReact Dialog and provides:
 *
 * - Optional icon (center aligned)
 * - Optional title with dynamic size + weight
 * - Custom close (X) button inside the modal (disabled by default)
 * - Dynamic children content section
 * - Header elements (icon, title) rendered only if provided
 *
 * Props:
 *  - visible: boolean → Controls modal visibility
 *  - onHide: () => void → Called when the modal is closed
 *
 *  - showCloseButton?: boolean → If true, show custom close button (top-right)
 *
 *  - icon?: ReactNode → Optional header icon
 *
 *  - title?: string → Main header title
 *  - titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
 *  - titleWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
 *
 *  - modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' → Modal max width
 *
 *  - children?: ReactNode → Modal body content
 */

import { Dialog } from 'primereact/dialog';
import HeaderTitle from './HeaderTitle';
import { Cross } from '../icons';

interface ModalWrapperProperties {
    visible: boolean;
    onHide: () => void;
    showCloseButton?: boolean;

    icon?: React.ReactNode;

    title?: string;
    titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    titleWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    className?: string;
    children?: React.ReactNode;
    modalPadding?: string;
}

// Modal size mapping to pixel values
const modalSizeMap: Record<string, string> = {
    sm: '650px',
    md: '936px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
    '4xl': '2560px',
    '5xl': '3200px',
};

function ModalWrapper({
    visible,
    onHide,
    showCloseButton = false,
    icon,
    title,
    titleSize = '2xl',
    titleWeight = 'medium',
    modalSize = '5xl',
    className = '',
    children,
    modalPadding = 'p-6',
}: ModalWrapperProperties) {
    const maxWidth = modalSizeMap[modalSize] || modalSizeMap['5xl'];

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            dismissableMask
            closable={false}
            className={`w-full  rounded-2xl font-poppins ${className}`}
            style={{ maxWidth }}
            contentClassName="!p-0 rounded-2xl border border-border-gray-light"
        >
            <div className={`relative ${modalPadding} bg-white rounded-2xl flex flex-col gap-4`}>
                {showCloseButton && (
                    <button
                        type="button"
                        onClick={onHide}
                        className="absolute top-6 right-6 text-primary-text hover:opacity-80 transition cursor-pointer"
                    >
                        <Cross size={24} />
                    </button>
                )}

                {/* Header Section */}
                {(icon || title) && (
                    <div className="flex flex-col gap-4">
                        {icon && <div className="flex justify-center">{icon}</div>}

                        {title && (
                            <HeaderTitle text={title} size={titleSize} weight={titleWeight} color="text-primary-text" className="text-center mb-4" />
                        )}
                    </div>
                )}

                {/* Body */}
                {children}
            </div>
        </Dialog>
    );
}

export default ModalWrapper;
