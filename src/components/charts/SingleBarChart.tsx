// eslint-disable-next-line import/no-extraneous-dependencies
import { BarChart, Bar, Rectangle, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface BarChartDataPoint {
    name: string;
    [key: string]: string | number;
}

export interface SingleBarChartProperties {
    data: BarChartDataPoint[];
    title: string;
    barKey: string;
    barName: string;
    barColor?: string;
    yAxisDomain?: [number, number];
    height?: number;
    yAxisLabel?: string;
    currencySymbol?: string;
}

const formatTooltipValue = (value: number, currencySymbol = '₦') => {
    const prefix = currencySymbol || '';
    if (value >= 1_000_000) {
        return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${prefix}${value.toLocaleString()}`;
};

export default function SingleBarChart({
    data,
    title,
    barKey,
    barName,
    barColor = Colors.brand[500],
    yAxisDomain,
    height = 500,
    yAxisLabel,
    currencySymbol = '₦',
}: SingleBarChartProperties) {
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
                `}
            </style>
            <HeaderTitle text={title} size="xl" weight="medium" disabled={false} className="mb-6 font-ubuntu" />
            <div className="chart-container flex-1">
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis dataKey="name" stroke={Colors.gray[900]} strokeWidth={1.5} tickMargin={10} tick={{ fontSize: 12 }} />
                        <YAxis
                            domain={yAxisDomain}
                            stroke={Colors.gray[900]}
                            strokeWidth={1.5}
                            tickMargin={10}
                            tick={{ fontSize: 20 }}
                            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                            tickFormatter={value => {
                                if (value >= 1_000_000) {
                                    return `${value / 1_000_000}M`;
                                }
                                return value.toString();
                            }}
                        />
                        <Tooltip
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any) => (typeof value === 'number' ? formatTooltipValue(value, currencySymbol) : value)}
                            labelStyle={{ color: Colors.text.black }}
                        />
                        {/* <Legend iconType="circle" wrapperStyle={{ paddingLeft: 0, textAlign: 'left' }} formatter={formatLegendText} /> */}
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
