import { useMemo } from 'react';
import { formatDaysLeft } from '../../utils/formatDaysLeft';
import { Colors } from '../../styles/tokens/colors';
import { useSponsorPortalSettingsData } from '../../stores/useSponsorPortalSettingsData';
import type { TimelineEventNameTypes } from '../../interfaces/common/timelineEventName.types';

interface DeadlineStatusChipProperties {
    creationDate?: string;
    className?: string;
    showBackground?: boolean;
    showDate?: boolean;
    dateClassName?: string;
    timelineEventName?: TimelineEventNameTypes[keyof TimelineEventNameTypes];
}

/**
 * Displays days left or overdue for a due date with appropriate styling.
 *
 * Color logic:
 * - < 7 days: Danger colors (Red background + Red text)
 * - <= 15 days: Warning colors (Yellow background + Yellow text)
 * - > 15 days: Success colors (Green background + Green text)
 *
 * @param creationDate - The creation date string (will be used to calculate due date if timelineEventName is provided).
 * @param timelineEventName - The timeline event name to map to window days from store.
 * @param className - Additional CSS classes.
 * @param showBackground - Whether to show colored background (default: false).
 * @param showDate - Whether to show the formatted date below days left (default: false).
 */
function DeadlineStatusChip({
    creationDate,
    className = '',
    dateClassName = '',
    showBackground = false,
    showDate = false,
    timelineEventName,
}: DeadlineStatusChipProperties) {
    const { sponsorPortalSettings } = useSponsorPortalSettingsData();

    // Memoize the mapping of timeline event names to window days
    const windowDaysMap = useMemo(() => {
        if (!sponsorPortalSettings) {
            return null;
        }

        return {
            mobileGamePrizeAgreement: sponsorPortalSettings.mobile_game_prize_agreement_window_days,
            mobileGameCreativesUpload: sponsorPortalSettings.mobile_game_creatives_upload_window_days,
            mobileGameCashRewardTransfer: sponsorPortalSettings.mobile_game_cash_reward_transfer_window_days,
            studioShowPrizeAgreement: sponsorPortalSettings.studio_show_prize_agreement_window_days,
            studioShowCreativesUpload: sponsorPortalSettings.studio_show_creatives_upload_window_days,
            studioShowCashRewardTransfer: sponsorPortalSettings.studio_show_cash_reward_transfer_window_days,
            ticketReopen: sponsorPortalSettings.ticket_reopen_window_days,
        };
    }, [sponsorPortalSettings]);

    // Calculate the due date: creationDate + window days
    const dueDate = useMemo(() => {
        if (!timelineEventName || !windowDaysMap) {
            // If no timeline event name or settings not loaded, use creationDate as-is
            return creationDate;
        }

        const windowDays = windowDaysMap[timelineEventName as keyof typeof windowDaysMap];
        if (windowDays === undefined || windowDays === null) {
            return creationDate;
        }

        // Calculate due date = creationDate + windowDays
        const creation = new Date(creationDate as string);
        const due = new Date(creation);
        due.setDate(due.getDate() + windowDays);

        // Format as YYYY-MM-DD in local timezone to avoid timezone issues
        const year = due.getFullYear();
        const month = String(due.getMonth() + 1).padStart(2, '0');
        const day = String(due.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [creationDate, timelineEventName, windowDaysMap]);

    const { days, prefix, formattedDate } = formatDaysLeft(dueDate);

    // Determine colors based on days left using color tokens
    const getColors = () => {
        if (days < 7) {
            return {
                bgColor: Colors.danger[50], // light red
                textColor: Colors.danger[600], // red
            };
        }
        if (days <= 15) {
            return {
                bgColor: Colors.warning[50], // light yellow
                textColor: Colors.warning[700], // yellow/orange
            };
        }
        return {
            bgColor: Colors.success[50], // light green
            textColor: Colors.success[700], // green
        };
    };

    const { bgColor, textColor } = getColors();

    // Base classes following StatusBadge pattern
    const baseClasses = showDate
        ? 'inline-flex flex-col items-start justify-center rounded-lg px-3 py-2'
        : 'inline-flex items-center justify-center rounded-lg px-3 py-1';

    const style = showBackground
        ? {
              backgroundColor: bgColor,
              color: textColor,
              border: 'none',
          }
        : {
              backgroundColor: 'transparent',
              color: textColor,
              border: 'none',
          };

    return (
        <span className={`${baseClasses} ${className}`} style={style}>
            <span className={showDate ? 'text-xs font-medium leading-tight pb-2' : 'text-xs font-medium'}>{prefix}</span>
            {showDate && <span className={`text-xs leading-tight mt-0.5 ${dateClassName}`}>{formattedDate}</span>}
        </span>
    );
}
export default DeadlineStatusChip;
