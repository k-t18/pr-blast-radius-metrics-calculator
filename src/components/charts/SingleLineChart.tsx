// eslint-disable-next-line import/no-extraneous-dependencies
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface SingleLineChartDataPoint {
    date: string;
    value: number;
}

export interface SingleLineChartProperties {
    data: SingleLineChartDataPoint[];
    title: string;
    lineKey: string;
    lineName: string;
    lineColor?: string;
    yAxisDomain?: [number, number];
    height?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatLegendText = (value: any) => value;

export default function SingleLineChart({
    data,
    title,
    lineKey,
    lineName,
    lineColor = Colors.brand[500],
    yAxisDomain = [0, 100_000],
    height = 500,
}: SingleLineChartProperties) {
    return (
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full flex flex-col rounded-lg">
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
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" stroke={Colors.gray[900]} strokeWidth={1.5} tickMargin={10} />
                        <YAxis domain={yAxisDomain} stroke={Colors.gray[900]} strokeWidth={1.5} tickMargin={10} />
                        <Tooltip />
                        <Legend iconType="circle" wrapperStyle={{ paddingLeft: 0, textAlign: 'left' }} formatter={formatLegendText} />
                        <Line
                            dataKey={lineKey}
                            stroke={lineColor}
                            strokeWidth={4}
                            dot={{ fill: lineColor, r: 5 }}
                            name={lineName}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
