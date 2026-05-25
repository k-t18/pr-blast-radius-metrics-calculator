// eslint-disable-next-line import/no-extraneous-dependencies
import { BarChart, Bar, Rectangle, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface VerticalBarChartDataPoint {
    name: string;
    [key: string]: string | number;
}

export interface VerticalSingleBarChartProperties {
    data: VerticalBarChartDataPoint[];
    title: string;
    barKey: string;
    barName: string;
    barColor?: string;
    xAxisDomain?: [number, number];
    height?: number;
    xAxisLabel?: string;
    currencySymbol?: string;
}

const formatTooltipValue = (value: number, currencySymbol = '₦') => {
    if (value >= 1_000_000) {
        return `${currencySymbol}${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${currencySymbol}${value.toLocaleString()}`;
};

export default function VerticalSingleBarChart({
    data,
    title,
    barKey,
    barName,
    barColor = Colors.brand[500],
    xAxisDomain,
    height = 500,
    xAxisLabel,
    currencySymbol = '₦',
}: VerticalSingleBarChartProperties) {
    return (
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg">
            <style>
                {`
                    .recharts-legend-wrapper .recharts-legend-item-text {
                        color: ${Colors.gray.slate} !important;
                    }
                    .recharts-legend-wrapper {
                        padding-left: 0 !important;
                    }
                    .recharts-default-legend {
                        text-align: left !important;
                        padding-top: 30px !important;
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
                    .recharts-bar-rectangle {
                        max-width: 60px !important;
                    }
                `}
            </style>
            <HeaderTitle text={title} size="xl" weight="medium" disabled={false} className="mb-6 font-ubuntu" />
            <div className="chart-container flex-1">
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{
                            top: 40,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis
                            type="number"
                            domain={xAxisDomain}
                            orientation="top"
                            stroke={Colors.gray[900]}
                            strokeWidth={1.5}
                            tickMargin={10}
                            tick={{ fontSize: 12 }}
                            label={xAxisLabel ? { value: xAxisLabel, position: 'insideTop', offset: -5 } : undefined}
                            tickFormatter={value => {
                                if (value >= 1_000_000) {
                                    return `${value / 1_000_000}M`;
                                }
                                return value.toString();
                            }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke={Colors.gray[900]}
                            strokeWidth={1.5}
                            tickMargin={10}
                            tick={{ fontSize: 12 }}
                            width={100}
                        />
                        <Tooltip
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any) => (typeof value === 'number' ? formatTooltipValue(value, currencySymbol) : value)}
                            labelStyle={{ color: Colors.text.black }}
                        />
                        <Bar
                            dataKey={barKey}
                            fill={barColor}
                            name={barName}
                            maxBarSize={60}
                            activeBar={<Rectangle fill={barColor} stroke={barColor} />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
