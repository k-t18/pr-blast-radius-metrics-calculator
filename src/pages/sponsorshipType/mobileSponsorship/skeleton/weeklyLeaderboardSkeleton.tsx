/**
 * Skeleton loading component for WeeklyLeaderBoard
 *
 * Displays a loading skeleton that matches the layout of the WeeklyLeaderBoard component.
 */

// Skeleton for a ranking row
function SkeletonRankingRow() {
    return (
        <div className="ranking-row animate-pulse">
            <div className="ranking-row-field">
                <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
            <div className="ranking-row-field">
                <div className="h-5 w-8 bg-gray-200 rounded" />
            </div>
            <div className="ranking-row-field">
                <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
            <div className="ranking-row-field">
                <div className="ranking-reward-field-wrapper">
                    <div className="h-10 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-200 rounded mt-1" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for rankings table
export function SkeletonRankingsTable() {
    return (
        <div className="leaderboard-rankings-section mt-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="leaderboard-rankings-table">
                {/* Table Header */}
                <div className="leaderboard-rankings-table-header">
                    <div className="leaderboard-rankings-header-checkbox">
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Ranking Rows */}
                {[1, 2, 3, 4, 5].map(item => (
                    <SkeletonRankingRow key={item} />
                ))}
            </div>
        </div>
    );
}

// Skeleton for date inputs section
export function SkeletonDateInputs() {
    return (
        <>
            <div className="leaderboard-period-input-group">
                <div className="h-5 w-full bg-gray-200 rounded mb-2" />
            </div>
            <div className="leaderboard-period-inputs-section animate-pulse ">
                <div className="leaderboard-period-input-group">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div className="leaderboard-period-input-group">
                    <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
            </div>
        </>
    );
}

// Skeleton for summary section
export function SkeletonSummary() {
    return (
        <div className="leaderboard-summary mt-4 animate-pulse">
            <div className="leaderboard-summary-row">
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
                <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
            </div>
            <div className="leaderboard-summary-row leaderboard-summary-total-row">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="leaderboard-summary-spacer" />
                <div className="h-6 w-24 bg-gray-200 rounded ml-auto" />
            </div>
        </div>
    );
}

// Skeleton for a week card
export function SkeletonWeekCard() {
    return (
        <div className="p-4 mb-4 bg-white">
            <div className="flex justify-between items-center mb-4 animate-pulse">
                <div className="h-5 w-64 bg-gray-200 rounded" />
                <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>

            <SkeletonDateInputs />

            <SkeletonRankingsTable />

            <SkeletonSummary />

            {/* Save Button Skeleton */}
            <div className="flex justify-start mt-4">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

// Main skeleton component for initial loading
export default function WeeklyLeaderboardSkeleton() {
    return (
        <div className="step-container step-active">
            <div className="step-header">
                <div className="step-header-content">
                    <div className="h-6 w-80 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            <div className="step-content step-content-expanded">
                <SkeletonWeekCard />
            </div>
        </div>
    );
}
