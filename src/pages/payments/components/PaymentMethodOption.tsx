import type { ReactNode } from 'react';
import DescriptionText from '../../../components/common/DescriptionText';
import ActionButton from '../../../components/common/ActionButton';

interface PaymentMethodOptionProperties {
    label?: string | '';
    icon: ReactNode;
    isActive: boolean;
    onClick: () => void;
}

export function PaymentMethodOption({ label, icon, isActive, onClick }: PaymentMethodOptionProperties) {
    return (
        <ActionButton
            borderRadius="rounded"
            width="auto"
            borderColor={isActive ? 'border-brand-primary-500' : 'border-gray-600'}
            bgColor={isActive ? 'bg-brand-50' : 'bg-white'}
            textColor={isActive ? 'text-primary-text' : 'text-gray-900'}
            onClick={onClick}
            className="flex flex-col items-start gap-[10px] rounded border p-2 w-[215px] font-ubuntu"
        >
            <span className="text-lg">{icon}</span>
            <DescriptionText
                text={label || ''}
                size="md"
                weight="semibold"
                color={isActive ? 'text-primary-text' : 'text-gray-900'}
                className="font-ubuntu"
            />
        </ActionButton>
    );
}
