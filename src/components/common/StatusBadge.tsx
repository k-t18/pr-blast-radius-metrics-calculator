/**
 * A reusable, theme-aware badge for displaying status information such as
 * “Approved”, “Pending”, or “Rejected”.
 *
 * - Fetches label, color, and icon automatically from a centralized STATUS_MAP
 *    using `statusKey`, or allows custom overrides via props.
 * - Supports “filled” and “outlined” variants with “pill” or “square” shapes.
 * - Ensures consistent visual design across the app’s modules.
 *
 * -----------------------------------------------------------------------------
 * 🧩 Props:
 * @param {string} [statusKey] - Key to fetch predefined status styles & label from STATUS_MAP.
 * @param {string} [label] - Optional manual label override (used if not deriving from map).
 * @param {string} [bgColor] - Optional background color override.
 * @param {string} [textColor] - Optional text color override.
 * @param {string} [borderColor] - Optional border color override.
 * @param {'filled' | 'outlined'} [variant='filled'] - Whether the badge is filled or outlined.
 * @param {'pill' | 'square'} [shape='pill'] - Shape of the badge.
 * @param {string} [className] - Additional class names for styling.
 * @param {ReactNode} [icon] - Optional icon displayed before the label.
 *
 */

import type { ReactNode } from 'react';
import { getStatusDefinition } from '../../constants/statusMaps';

interface StatusBadgeProperties {
    statusKey?: string;
    label?: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    variant?: 'filled' | 'outlined';
    shape?: 'pill' | 'square';
    className?: string;
    icon?: ReactNode;
    showIcon?: boolean;
}

function StatusBadge({
    statusKey,
    label,
    bgColor,
    textColor,
    borderColor,
    variant = 'filled',
    shape = 'pill',
    className = '',
    icon,
    showIcon = true,
}: StatusBadgeProperties) {
    const status = statusKey ? getStatusDefinition(statusKey) : undefined;

    const finalLabel = label || status?.label || '';
    const finalBg = bgColor || status?.bgColor || '#F3F4F6';
    const finalText = textColor || status?.textColor || '#374151';
    const finalBorder = borderColor || status?.borderColor || '#D1D5DB';
    const finalIcon = icon || status?.icon;

    const baseClasses = `
    inline-flex items-center gap-1 justify-center text-xs font-medium 
    border rounded-${shape === 'pill' ? 'full px-4 py-1 leading-5 font-normal' : 'lg p-1.5'}
  `;

    const style =
        variant === 'filled'
            ? { backgroundColor: finalBg, color: finalText, borderColor: finalBorder }
            : { backgroundColor: 'transparent', color: finalText, borderColor: finalBorder };

    return (
        <span className={`${baseClasses} ${className}`} style={style}>
            {finalIcon && showIcon && <span className="flex items-center">{finalIcon}</span>}
            {finalLabel}
        </span>
    );
}

export default StatusBadge;
