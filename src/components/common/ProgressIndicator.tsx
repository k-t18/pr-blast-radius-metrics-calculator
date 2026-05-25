/**
 * ProgressIndicator Component
 *
 * A reusable circular progress indicator that changes color based on progress value:
 * - 0-25%: Red
 * - 25-50%: Orange
 * - 50-75%: Blue
 * - 75-100%: Green
 */

import '../../styles/progressIndicator.css';

interface ProgressIndicatorProperties {
    /** Progress value between 0 and 100 */
    progress: number;
    /** Size of the progress circle in pixels (default: 120) */
    size?: number;
    /** Width of the progress stroke in pixels (default: 8) */
    strokeWidth?: number;
    /** Whether to show the percentage text (default: true) */
    showPercentage?: boolean;
    /** Custom className for additional styling */
    className?: string;
    /** Whether the indicator is in active state (for left sidebar) */
    isActive?: boolean;
}

// Determine color based on progress ranges
const getProgressColor = (value: number): string => {
    if (value >= 0 && value < 25) {
        return '#ef4444'; // Red
    }
    if (value >= 25 && value < 50) {
        return '#f97316'; // Orange
    }
    if (value >= 50 && value < 75) {
        return '#3b82f6'; // Blue
    }
    return '#22c55e'; // Green
};
function ProgressIndicator({
    progress = 0,
    size = 50,
    strokeWidth = 6,
    showPercentage = true,
    className = '',
    isActive = false,
}: ProgressIndicatorProperties) {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    const color = getProgressColor(clampedProgress);

    // Calculate circle properties
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
        <div className={`inline-flex items-center justify-center relative ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle - transparent when active */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke={isActive ? '#ffffff' : '#F6F6F6'} strokeWidth={strokeWidth} />
                {/* Progress circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
                    }}
                />
            </svg>
            {/* Percentage text */}
            {showPercentage && (
                <div className="absolute flex flex-col items-center justify-center text-black">
                    <span className="text-xs font-medium">{Math.round(clampedProgress)}%</span>
                </div>
            )}
        </div>
    );
}

export default ProgressIndicator;
