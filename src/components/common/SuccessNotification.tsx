import { useState, useEffect } from 'react';
import { Check, X } from '../icons';
import '../../styles/mobileSponsorshipStyles/successNotification.css';

interface SuccessNotificationProperties {
    message?: string;
    className?: string;
    type?: 'success' | 'error';
}

export default function SuccessNotification({ message = 'Campaign saved', className = '', type = 'success' }: SuccessNotificationProperties) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Reset visibility when message changes (new notification)
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    const isError = type === 'error';
    const Icon = isError ? X : Check;
    const iconColor = isError ? 'var(--color-danger-500)' : 'var(--color-success-500)';
    const notificationClass = isError ? 'error-notification' : 'success-notification';
    const textClass = isError ? 'error-notification-text' : 'success-notification-text';

    return isVisible ? (
        <div className={`${notificationClass} ${className}`}>
            <Icon size={24} color={iconColor} />
            <span className={textClass}>{message}</span>
        </div>
    ) : undefined;
}
