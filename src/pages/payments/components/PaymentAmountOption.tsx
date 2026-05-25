import type { ReactNode } from 'react';
import DescriptionText from '../../../components/common/DescriptionText';
import ActionButton from '../../../components/common/ActionButton';

interface PaymentAmountOptionProperties {
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: ReactNode;
    childClass?: string;
    disabled?: boolean;
}

export function PaymentAmountOption({ label, isActive, onClick, children, childClass = '', disabled = false }: PaymentAmountOptionProperties) {
    // Calculate border color based on state
    const getBorderColor = (): string => {
        if (isActive) {
            return 'border-brand-primary-500';
        }
        if (disabled) {
            return 'border-gray-300';
        }
        return 'border-gray-600';
    };

    // Calculate background color based on state
    const getBgColor = (): string => {
        if (isActive) {
            return 'bg-brand-50';
        }
        if (disabled) {
            return 'bg-gray-50';
        }
        return 'bg-white';
    };

    const borderColor = getBorderColor();
    const bgColor = getBgColor();

    return (
        <ActionButton
            borderRadius="rounded"
            width="auto"
            borderColor={borderColor}
            bgColor={bgColor}
            textColor={disabled ? 'text-gray-400' : 'text-primary-text'}
            onClick={disabled ? undefined : onClick}
            isDisabled={disabled}
            className={`flex flex-col items-start rounded border p-2  ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
            <DescriptionText
                text={label}
                size="xs"
                color={disabled ? 'text-gray-400 text-left' : 'text-primary-text text-left'}
                weight="normal"
                className="leading-5"
            />
            <div className={childClass}>{children}</div>
        </ActionButton>
    );
}
