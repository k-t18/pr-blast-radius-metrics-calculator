/**
 * Safely sums numeric values from an array.
 * Treats undefined, null, or non-numeric values as 0.
 *
 * @param values - An array of numbers or nullable/undefined values
 * @returns A finite number sum
 */
export const sumValues = (...values: (number | null | undefined)[]): number => {
    let total = 0;
    const { length } = values;

    for (let index = 0; index < length; index++) {
        const value = values[index];
        if (typeof value === 'number' && Number.isFinite(value)) {
            total += value;
        }
    }

    return total;
};
