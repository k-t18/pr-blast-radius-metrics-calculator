/**
 * A simple reusable button to navigate to the previous page using React Router’s `useNavigate`.
 * Commonly used at the top of detail or nested pages for consistent navigation UX.
 *
 * @component
 * @param {string} [label='Back'] - Text label displayed next to the back arrow icon.
 * @param {string} [className] - Optional additional Tailwind CSS classes for custom styling.
 */

import { useNavigate } from 'react-router-dom';
import { Arrow } from '../icons';

interface BackButtonProperties {
    label?: string;
    className?: string;
    onClick?: () => void;
}

function BackButton({ label = 'Back', className, onClick }: BackButtonProperties) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(-1); // ⬅️ Navigate to previous route
        }
    };

    return (
        <button
            type="button"
            onClick={handleBack}
            className={`text-primary-text flex gap-1 items-center p-1 text-xs leading-5 w-fit font-normal cursor-pointer ${className ?? ''}`}
        >
            <Arrow size={16} />
            {label}
        </button>
    );
}

export default BackButton;
