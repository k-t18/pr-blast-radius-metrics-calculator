import { dateDashFormat } from './dateUtils';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface DaysLeftInfo {
    days: number;
    prefix: string;
    formattedDate: string;
}

/**
 * Calculates days left or overdue for a given due date.
 *
 * @param dueDate - The due date string to calculate from.
 * @returns An object containing days difference, prefix text, and formatted date in DD-MM-YYYY format.
 */
export function formatDaysLeft(dueDate: string | null | undefined): DaysLeftInfo {
    if (!dueDate) {
        return {
            days: 0,
            prefix: 'N/A',
            formattedDate: 'N/A',
        };
    }
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / MS_PER_DAY);
    const prefix = diff >= 0 ? `${diff} days left` : `${Math.abs(diff)} days overdue`;

    return {
        days: diff,
        prefix,
        formattedDate: dateDashFormat(due),
    };
}
