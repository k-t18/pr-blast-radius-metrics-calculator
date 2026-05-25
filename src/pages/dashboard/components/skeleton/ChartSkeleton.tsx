interface ChartSkeletonProperties {
    height?: number;
}

// Simple animated skeleton placeholder for chart containers
export default function ChartSkeleton({ height = 400 }: ChartSkeletonProperties) {
    return (
        <div
            className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg animate-pulse"
            style={{ minHeight: height }}
            aria-hidden="true"
        >
            <div className="flex flex-col gap-6 h-full">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="flex flex-col gap-3">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex-1 rounded bg-gray-100" />
                <div className="grid grid-cols-4 gap-3">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}
