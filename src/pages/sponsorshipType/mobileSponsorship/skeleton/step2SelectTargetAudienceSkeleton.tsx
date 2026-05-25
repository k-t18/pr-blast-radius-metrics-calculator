/**
 * Skeleton loading component for Step2SelectTargetAudience
 *
 * Displays a loading skeleton that matches the layout of the Step2SelectTargetAudience component.
 */

// Skeleton for a checkbox
export function SkeletonCheckbox() {
    return (
        <div className="flex items-center gap-2 animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded-[4px]" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
    );
}

// Skeleton for audience reach number
export function SkeletonAudienceReach() {
    return (
        <div className="flex flex-col items-start justify-start animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded" />
        </div>
    );
}

// Skeleton for a filter option (checkbox)
function SkeletonFilterOption({ level = 0 }: { level?: number }) {
    return (
        <div className="filter-option" style={{ paddingLeft: `${level * 1.5}rem` }}>
            <div className="filter-option-row">
                <span className="filter-expand-spacer" />
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for a filter section
function SkeletonFilterSection() {
    return (
        <div className="filter-section">
            <div className="filter-section-header">
                <div className="filter-section-header-content">
                    <span className="filter-section-icon">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                    </span>
                    <div className="filter-section-title-group">
                        <div className="filter-section-title h-6 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="filter-section-subtitle h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="filter-section-content">
                <div className="flex flex-col gap-3 py-4">
                    <SkeletonFilterOption />
                    <SkeletonFilterOption />
                    <SkeletonFilterOption level={1} />
                    <SkeletonFilterOption level={1} />
                    <SkeletonFilterOption />
                    <div className="filter-special-field">
                        <div className="filter-field-label">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="filter-field-helper">
                            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Step2SelectTargetAudienceSkeleton() {
    return (
        <div className="step-container">
            <div className="step-content step-content-expanded">
                <SkeletonFilterSection />
                {/* <SkeletonFilterSection /> */}
            </div>
        </div>
    );
}
