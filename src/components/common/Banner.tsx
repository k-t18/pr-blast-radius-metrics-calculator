import type { ReactNode } from 'react';

/**
 * Banner Component
 *
 * A lightweight container for drawing attention to important content blocks.
 * Common uses: announcements, outstanding payment reminders, contextual actions.
 *
 * - Accepts arbitrary children content so callers can compose their own layouts.
 * - Allows optional `className` overrides for spacing or layout adjustments.
 */

interface BannerProperties {
    /** Content to display inside the banner.  */
    children: ReactNode;
    /** Optional additional class names for custom layout overrides. */
    className?: string;
}

export function Banner({ children, className }: BannerProperties) {
    return <div className={`rounded-lg bg-brand-50 py-4 ${className ?? ''}`}>{children}</div>;
}
