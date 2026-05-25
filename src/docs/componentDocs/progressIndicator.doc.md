## Progress Indicator

A reusable circular progress indicator that changes color by value range.

- 0–24% → Red #ef4444
- 25–49% → Orange #f97316
- 50–74% → Blue #3b82f6
- 75–100% → Green #22c55e

### Props

| Prop             | Type      | Default | Description                                             |
| ---------------- | --------- | ------- | ------------------------------------------------------- |
| `progress`       | `number`  | 0       | Required. Value in range **0–100**. Values are clamped. |
| `size`           | `number`  | `50`    | SVG box size in pixels.                                 |
| `strokeWidth`    | `number`  | `6`     | Width of the progress stroke.                           |
| `showPercentage` | `boolean` | `true`  | Toggles the centered percentage text.                   |
| `className`      | `string`  | `""`    | Extra classes for the outer wrapper.                    |

Example

```
/**
 * ProgressIndicator Usage Examples
 *
 * This file demonstrates how to use the ProgressIndicator component
 * You can delete this file once you've integrated the component
 */

import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';

export const ProgressIndicatorExample: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Progress Indicator Examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 0-25% - Red */}
                <div className="flex flex-col items-center gap-2">
                    <ProgressIndicator progress={15} />
                    <p className="text-sm text-gray-600">0-25% (Red)</p>
                </div>

                {/* 25-50% - Orange */}
                <div className="flex flex-col items-center gap-2">
                    <ProgressIndicator progress={40} />
                    <p className="text-sm text-gray-600">25-50% (Orange)</p>
                </div>

                {/* 50-75% - Blue */}
                <div className="flex flex-col items-center gap-2">
                    <ProgressIndicator progress={65} />
                    <p className="text-sm text-gray-600">50-75% (Blue)</p>
                </div>

                {/* 75-100% - Green */}
                <div className="flex flex-col items-center gap-2">
                    <ProgressIndicator progress={90} />
                    <p className="text-sm text-gray-600">75-100% (Green)</p>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Different Sizes</h3>
                <div className="flex items-center gap-8 flex-wrap">
                    <ProgressIndicator progress={75} size={80} strokeWidth={6} />
                    <ProgressIndicator progress={75} size={120} strokeWidth={8} />
                    <ProgressIndicator progress={75} size={160} strokeWidth={10} />
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Without Percentage Text</h3>
                <div className="flex items-center gap-8 flex-wrap">
                    <ProgressIndicator progress={25} showPercentage={true} />
                    <ProgressIndicator progress={50} showPercentage={false} />
                    <ProgressIndicator progress={75} showPercentage={false} />
                </div>
            </div>
        </div>
    );
};

export default ProgressIndicatorExample;
```
