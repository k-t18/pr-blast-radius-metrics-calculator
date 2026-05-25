/**
 * Skeleton loading component for SelectRewardsAndAdsBoth
 *
 * Displays a loading skeleton that matches the layout of the SelectRewardsAndAdsBoth component.
 */

// Skeleton card component
function SkeletonCard() {
    return (
        <div className="relative border border-border-gray-600 rounded-lg p-4 flex flex-col justify-between gap-4 animate-pulse">
            <div className="flex flex-col" style={{ gap: '8px' }}>
                {/* Header with badge */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded" />
                        <div className="h-5 w-24 bg-gray-200 rounded" />
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />

                {/* Description */}
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>
        </div>
    );
}

export default function SelectRewardsAndAdsBothSkeleton() {
    return (
        <div className="flex flex-col gap-6 px-6">
            {/* BackButton skeleton */}
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />

            {/* Header section skeleton */}
            <div className="flex flex-col gap-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Select Ad Category section skeleton */}
            <div className="flex flex-col gap-2">
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Main categories: 2-column grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map(item => (
                    <SkeletonCard key={item} />
                ))}
            </div>

            {/* Select Ad Category section skeleton (duplicate) */}
            <div className="flex flex-col gap-2">
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Normal categories: 3-column grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(item => (
                    <SkeletonCard key={item} />
                ))}
            </div>
        </div>
    );
}
