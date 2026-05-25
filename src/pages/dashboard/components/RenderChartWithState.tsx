import React from 'react';
import ChartSkeleton from './skeleton/ChartSkeleton';

export const getErrorMessage = (error: unknown) => {
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message?: string }).message || 'Something went wrong');
    }
    if (typeof error === 'string') return error;
    return 'Something went wrong';
};

interface RenderChartWithStateProperties {
    isLoading: boolean;
    error: unknown;
    dataLength: number;
    height?: number;
    children: React.ReactNode;
}

export const renderChartWithState = ({ isLoading, error, dataLength, height = 400, children }: RenderChartWithStateProperties) => {
    if (isLoading) {
        return <ChartSkeleton height={height} />;
    }

    if (error) {
        return (
            <div
                className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg flex items-center justify-center text-red-600 font-ubuntu"
                style={{ minHeight: height }}
            >
                Error: {getErrorMessage(error)}
            </div>
        );
    }

    if (!dataLength) {
        return (
            <div
                className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg flex items-center justify-center text-gray-500 font-ubuntu"
                style={{ minHeight: height }}
            >
                No Data Available
            </div>
        );
    }

    return children;
};
