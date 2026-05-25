/**
 * Props:
 * - number: Square number (1–100)
 * - usp: Unit Sales Price (string)
 * - rv: Reward Value (string)
 * - icon: Fully dynamic ReactNode (optional) → the parent passes any icon
 * - status:
 *      - "unavailable" → disabled, greyed out
 *      - "available" → normal selectable state
 *      - "selected" → highlighted, black text
 *      - "special" → PIT square (white on black)
 * - className: Additional styles for parent
 * - onClick: Triggered when user selects a square
 *
 * Accessibility:
 * - Each interactive card uses role="button"
 * - Tab focus is enabled (tabIndex={0})
 * - Keyboard activation supported (Enter/Space)
 */

import type { ReactNode } from 'react';
import DescriptionText from '../common/DescriptionText';

export type SquareStatus = 'unavailable' | 'available' | 'selected' | 'special' | 'reserved';

export interface SquareCardProperties {
    number: string | number | undefined;
    usp: string | number;
    rv: string | number;
    type?: string | undefined;
    icon?: ReactNode;
    status: SquareStatus;
    className?: string;
    onClick?: () => void;
}

function SquareCard({ number, usp, rv, type, icon, status, className, onClick }: SquareCardProperties) {
    // Border & background styles
    const stateStyles: Record<SquareStatus, string> = {
        unavailable: 'bg-border-gray-600 border border-border-gray-600 cursor-not-allowed opacity-50',
        available: 'bg-white border border-border-gray-600 cursor-pointer hover:border-brand-primary-500',
        selected: 'border border-brand-primary-800 bg-brand-primary-500/10 cursor-pointer',
        special: 'bg-black border border-black cursor-pointer',
        reserved: 'bg-border-gray-600 border border-border-gray-600 cursor-not-allowed opacity-50',
    };

    // Text color map
    const textColorMap: Record<SquareStatus, string> = {
        special: 'text-white',
        selected: 'text-primary-text',
        available: 'text-secondary-text',
        unavailable: 'text-secondary-text',
        reserved: 'text-secondary-text',
    };

    const textColor = textColorMap[status];

    const isInteractive = !(status === 'unavailable' || status === 'reserved');

    // Keyboard accessibility
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isInteractive || !onClick) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    };

    let middleContent: ReactNode;

    if (status !== 'special' && icon) {
        middleContent = (
            <div className={`flex justify-center items-center gap-1 ${textColor}`}>
                {icon}
                {type && <DescriptionText text={type} size="xxs" color={textColor} weight="normal" className="uppercase" />}
            </div>
        );
    } else if (status === 'special') {
        middleContent = <DescriptionText text={type || ''} size="xxs" color={textColor} weight="normal" className="uppercase" />;
    }

    return (
        <div
            role={isInteractive ? 'button' : undefined}
            tabIndex={isInteractive ? 0 : -1}
            onClick={isInteractive ? onClick : undefined}
            onKeyDown={handleKeyDown}
            className={`flex flex-col items-center justify-evenly p-4 rounded border text-center transition h-27 w-full 
                ${stateStyles[status]}
                ${className || ''}`}
        >
            {/* Number */}
            <DescriptionText text={number?.toString() ?? ''} size="sm" color={status === 'available' ? 'text-primary-text' : textColor} />

            {/* Dynamic icon or PIT */}
            {middleContent}

            {/* USP + RV */}
            <div className="">
                {usp && (
                    <div className="flex justify-center gap-1">
                        <DescriptionText text="USP = " size="xxs" color={textColor} weight="normal" />
                        <DescriptionText text={usp.toString()} size="xxs" color={textColor} weight="normal" />
                    </div>
                )}
                {rv && (
                    <div className="flex justify-center gap-1">
                        <DescriptionText text="RV ≥ " size="xxs" color={textColor} weight="normal" />
                        <DescriptionText text={rv.toString()} size="xxs" color={textColor} weight="normal" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SquareCard;
