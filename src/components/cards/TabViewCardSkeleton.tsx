import { useMemo } from 'react';

interface TabViewCardSkeletonProperties {
    /**
     * Number of accordion rows to show in the skeleton.
     */
    rows?: number;
}

function SkeletonBar({ className = '' }: { className?: string }) {
    return <div className={`bg-gray-200 rounded ${className}`} aria-hidden="true" />;
}

function TabViewCardSkeleton({ rows = 3 }: TabViewCardSkeletonProperties) {
    const rowKeys = useMemo(
        () =>
            Array.from({ length: rows }, () =>
                typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
            ),
        [rows]
    );

    return (
        <div className="rounded-2xl border border-gray-600 bg-white shadow-sm mt-6 p-4 animate-pulse">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <SkeletonBar className="h-5 w-40" />
                    <div className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2">
                        <SkeletonBar className="h-4 w-4" />
                        <SkeletonBar className="h-4 w-32" />
                    </div>
                </div>
                <div className="self-start md:self-auto">
                    <SkeletonBar className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {rowKeys.map(key => (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                        <SkeletonBar className="h-4 w-24 mb-2" />
                        <SkeletonBar className="h-4 w-full" />
                    </div>
                ))}

                <div className="flex justify-end">
                    <SkeletonBar className="h-9 w-32 rounded" />
                </div>
            </div>
        </div>
    );
}

export default TabViewCardSkeleton;
