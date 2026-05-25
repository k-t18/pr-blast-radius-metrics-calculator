// eslint-disable-next-line import/no-extraneous-dependencies
import { BarChart, Bar, Rectangle, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface BarChartDataPoint {
    name: string;
    [key: string]: string | number;
}

export interface DoubleBarChartProperties {
    data: BarChartDataPoint[];
    title: string;
    firstBarKey: string;
    secondBarKey: string;
    firstBarName: string;
    secondBarName: string;
    firstBarColor?: string;
    secondBarColor?: string;
    yAxisDomain?: [number, number];
    height?: number;
    minHeight?: number;
    /** Minimum horizontal space per category before enabling horizontal scroll */
    minCategoryWidth?: number;
}

const formatLegendText = (value: string) => value;

const formatTooltipValue = (value: number) => {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)} M`;
    }
    return value.toLocaleString();
};

export default function DoubleBarChart({
    data,
    title,
    firstBarKey,
    secondBarKey,
    firstBarName,
    secondBarName,
    firstBarColor = Colors.brand[50],
    secondBarColor = Colors.brand[500],
    yAxisDomain,
    height = 500,
    minHeight = 400,
    minCategoryWidth = 80,
}: DoubleBarChartProperties) {
    const minWidth = Math.max(600, data.length * minCategoryWidth);
    const chartHeight = Math.max(height, minHeight);

    // Check if data is empty or has no meaningful data
    const hasData =
        data &&
        data.some(item => {
            const firstValue = Number(item[firstBarKey]) || 0;
            const secondValue = Number(item[secondBarKey]) || 0;
            return firstValue > 0 || secondValue > 0;
        });

    return (
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm rounded-lg">
            <style>
                {`
                    .recharts-legend-wrapper .recharts-legend-item-text {
                        color: ${Colors.gray.slate} !important;
                    }
                    .recharts-legend-wrapper {
                        padding-left: 0 !important;
                        bottom: 0 !important;
                        top: auto !important;
                        overflow: visible !important;
                    }
                    .recharts-default-legend {
                        text-align: left !important;
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                        padding-bottom: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    .recharts-legend-item {
                        overflow: visible !important;
                    }
                    .recharts-legend-item-icon {
                        overflow: visible !important;
                    }
                    .chart-container,
                    .chart-container:focus,
                    .chart-container:focus-visible,
                    .chart-container:active,
                    .chart-container *:focus,
                    .chart-container *:focus-visible,
                    .chart-container *:active {
                        outline: none !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .recharts-cartesian-axis-line {
                        stroke: ${Colors.text.black} !important;
                        stroke-width: 1.71px !important;
                    }
                    .recharts-cartesian-axis-tick {
                        overflow: visible !important;
                    }
                    .recharts-xAxis {
                        overflow: visible !important;
                    }
                    .recharts-wrapper {
                        overflow: visible !important;
                    }
                    .recharts-surface {
                        overflow: visible !important;
                    }
                    .chart-container {
                        padding-bottom: 20px !important;
                        overflow-y: visible !important;
                    }
                `}
            </style>
            <HeaderTitle text={title} size="xl" weight="medium" disabled={false} className="mb-6 font-ubuntu" />
            {hasData ? (
                <div className="chart-container overflow-x-auto">
                    <div style={{ minWidth }}>
                        <ResponsiveContainer width="100%" height={chartHeight}>
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 60,
                                    bottom: 130,
                                }}
                            >
                                <XAxis
                                    dataKey="name"
                                    stroke={Colors.gray[900]}
                                    strokeWidth={1.5}
                                    tickMargin={10}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                />
                                <YAxis
                                    domain={yAxisDomain}
                                    stroke={Colors.gray[900]}
                                    strokeWidth={1.5}
                                    tickMargin={10}
                                    tickFormatter={value => {
                                        if (value >= 1_000_000) {
                                            return `${value / 1_000_000}M`;
                                        }
                                        return value.toString();
                                    }}
                                />
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <Tooltip formatter={(value: any) => formatTooltipValue(value)} labelStyle={{ color: Colors.text.black }} />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingLeft: 0,
                                        textAlign: 'left',
                                        paddingTop: '10px',
                                        paddingBottom: '0px',
                                        marginBottom: '0px',
                                    }}
                                    formatter={formatLegendText}
                                    verticalAlign="bottom"
                                />
                                <Bar
                                    dataKey={secondBarKey}
                                    fill={secondBarColor}
                                    name={secondBarName}
                                    barSize={18}
                                    activeBar={<Rectangle fill={secondBarColor} stroke={secondBarColor} />}
                                />
                                <Bar
                                    dataKey={firstBarKey}
                                    fill={firstBarColor}
                                    name={firstBarName}
                                    barSize={18}
                                    activeBar={<Rectangle fill={firstBarColor} stroke={firstBarColor} />}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center" style={{ minHeight: chartHeight }}>
                    <div className="text-center">
                        <p className="text-gray-500 text-lg">No data available</p>
                    </div>
                </div>
            )}
        </div>
    );
}
