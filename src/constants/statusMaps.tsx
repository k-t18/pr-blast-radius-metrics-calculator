/**
 * Centralized status configuration for all modules in the app.
 * Each status key maps to label, colors, and icon.
 */
import type { ReactNode } from 'react';
import { Check, Cross, Hourglass, SpinnerGap } from '../components/icons';

export interface StatusDefinition {
    label: string;
    bgColor?: string;
    textColor: string;
    borderColor?: string;
    icon?: ReactNode;
}

/**
 * Unified status registry — all status keys live here.
 */
export const STATUS_MAP: Record<string, StatusDefinition> = {
    // 🟢 custom-related
    approved: {
        label: 'Approved',
        bgColor: 'var(--color-success-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-success-100)',
        icon: <Check size={12} />,
    },
    pending_review: {
        label: 'Pending Review',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    rejected: {
        label: 'Rejected',
        bgColor: 'var(--color-danger-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-danger-100)',
        icon: <Cross size={12} />,
    },

    // 🎫 Support ticket-related
    resolved: {
        label: 'Resolved',
        bgColor: 'var(--color-success-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-success-100)',
        icon: <Check size={12} />,
    },
    completed: {
        label: 'Completed',
        bgColor: 'var(--color-success-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-success-100)',
        icon: <Check size={12} />,
    },
    open: {
        label: 'Open',
        bgColor: '#FFE5B0',
        textColor: '#000000',
        borderColor: '#FFE5B0',
        icon: <Hourglass size={12} />,
    },
    closed: {
        label: 'Closed',
        bgColor: '#C8E6C9',
        textColor: '#000000',
        borderColor: '#C8E6C9',
        icon: <Check size={12} />,
    },

    pending: {
        label: 'Pending',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    ongoing: {
        label: 'Ongoing',
        bgColor: 'var(--color-information-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-information-100)',
        icon: <SpinnerGap size={12} />,
    },
    paid: {
        label: 'Paid',
        bgColor: 'var(--color-success-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-success-100)',
        icon: <Check size={12} />,
    },
    partially_paid: {
        label: 'Partially Paid',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    overdue: {
        label: 'Over Due',
        bgColor: 'var(--color-danger-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-danger-100)',
        icon: <Cross size={12} />,
    },
    unpaid: {
        label: 'Unpaid',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    pending_for_approval: {
        label: 'Pending for Approval',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    head_of_bd_approval_pending: {
        label: 'Head of BD Approval Pending',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    reupload_pending: {
        label: 'Reupload Pending',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    coo_approval_pending: {
        label: 'COO Approval Pending',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
        icon: <Hourglass size={12} />,
    },
    // 🟣 Studio Show-related
    available: {
        label: 'Available',
        bgColor: 'var(--color-text-white)',
        textColor: 'var(--color-success-600)',
        borderColor: 'var(--color-success-500)',
    },
    sponsor_available: {
        label: 'Available',
        bgColor: 'var(--color-text-white)',
        textColor: 'var(--color-success-600)',
        borderColor: 'var(--color-success-500)',
    },
    draft: {
        label: 'Draft',
        bgColor: 'var(--color-warning-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-warning-100)',
    },
    cancelled: {
        label: 'Cancelled',
        bgColor: 'var(--color-danger-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-danger-100)',
        icon: <Cross size={12} />,
    },
    'filling-fast': {
        label: 'Filling Fast',
        bgColor: 'var(--color-text-white)',
        textColor: 'var(--color-warning-600)',
        borderColor: 'var(--color-warning-500)',
    },
    'sold-out': {
        label: 'Sold Out',
        bgColor: 'var(--color-text-white)',
        textColor: 'var(--color-gray-800)',
        borderColor: 'var(--color-gray-600)',
    },
    unavailable: {
        label: 'Unavailable',
        bgColor: 'var(--color-text-white)',
        textColor: 'var(--color-danger-700)',
        borderColor: 'var(--color-danger-700)',
    },
    upcoming: {
        label: 'Upcoming',
        bgColor: 'var(--color-text-white)',
        textColor: 'var(--color-success-600)',
        borderColor: 'var(--color-success-500)',
    },
    // general
    studio_show: {
        label: 'Studio Show',
        bgColor: 'var(--color-gray-600)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-gray-600)',
    },
    mobile_game: {
        label: 'Mobile Game',
        bgColor: 'var(--color-gray-600)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-gray-600)',
    },
    partially_ordered: {
        label: 'Partially Ordered',
        bgColor: '#FFE5B0',
        textColor: '#000000',
        borderColor: '#FFE5B0',
        icon: <Hourglass size={12} />,
    },
    ordered: {
        label: 'Ordered',
        bgColor: 'var(--color-success-100)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-success-100)',
        icon: <Check size={12} />,
    },
    expired: {
        label: 'Expired',
        bgColor: 'var(--color-gray-600)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-gray-600)',
    },
    // ⚪ Default fallback
    default: {
        label: 'Unknown',
        bgColor: 'var(--color-gray-600)',
        textColor: 'var(--color-text-black)',
        borderColor: 'var(--color-gray-600)',
    },
};

/**
 * Utility to safely get a status definition by key.
 */
export function getStatusDefinition(statusKey: string): StatusDefinition {
    const key = statusKey.toLowerCase().trim().replaceAll(/\s+/g, '_');

    return STATUS_MAP[key] || { ...STATUS_MAP.default, label: statusKey };
}
