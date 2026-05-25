// eslint-disable-next-line import/no-extraneous-dependencies
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface StackedBarChartDataPoint {
    name: string;
    [key: string]: string | number;
}

export interface StackedBarChartProperties {
    data: StackedBarChartDataPoint[];
    title: string;
    stackKeys: { key: string; name: string; color: string }[];
    yAxisDomain?: [number, number];
    height?: number;
}

export default function StackedBarChart({ data, title, stackKeys, yAxisDomain, height = 500 }: StackedBarChartProperties) {
    return (
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg">
            <style>
                {`
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
                    .recharts-legend-wrapper {
                        padding-left: 0 !important;
                    }
                    .recharts-default-legend {
                        text-align: left !important;
                        padding-top: 20px !important;
                    }
                    .recharts-legend-wrapper .recharts-legend-item-text {
                        color: ${Colors.text.black} !important;
                        font-size: 12px !important;
                    }
                    .recharts-legend-item {
                        margin-right: 24px !important;
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke={Colors.gray[900]} strokeWidth={1.5} tickMargin={10} tick={{ fontSize: 12 }} />
                        <YAxis
                            domain={yAxisDomain}
                            width="auto"
                            stroke={Colors.gray[900]}
                            strokeWidth={1.5}
                            tickMargin={10}
                            tick={{ fontSize: 12 }}
                            tickFormatter={value => {
                                if (value >= 1_000_000) {
                                    return `${value / 1_000_000}M`;
                                }
                                if (value >= 1000) {
                                    return `${value / 1000}K`;
                                }
                                return value.toString();
                            }}
                        />
                        <Tooltip labelStyle={{ color: Colors.text.black }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingLeft: 0, textAlign: 'left' }} />
                        {stackKeys?.length > 0 &&
                            stackKeys?.map(stack => (
                                <Bar key={stack.key} dataKey={stack.key} stackId="a" fill={stack.color} name={stack.name} maxBarSize={60} />
                            ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
