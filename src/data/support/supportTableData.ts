/**
 * Mock data for Support Tickets
 */

import type { SupportTicket } from '../../interfaces/support/support.types';

export const SUPPORT_TICKETS: SupportTicket[] = [
    {
        ticketId: 'ISS-2025-00001',
        dateRaised: '2025-12-10 09:00:00',
        sponsorshipType: 'Studio Show Booking',
        category: 'Creatives',
        subject: 'Not able to choose more than 7 squares for studio sponsorship',
        status: 'Open',
        remarks: 'Awaiting customer confirmation',
    },
    {
        ticketId: 'ISS-2025-00002',
        dateRaised: '2025-12-10 08:30:00',
        sponsorshipType: 'Mobile Chance Square',
        category: 'Ad Campaign',
        subject: 'Not able to choose more than 7 squares for studio sponsorship',
        status: 'Pending',
        remarks: 'Escalated to engineering',
    },
    {
        ticketId: 'ISS-2025-00003',
        dateRaised: '2025-12-09 14:10:00',
        sponsorshipType: 'Studio',
        category: 'Prize Agreement',
        subject: 'Not able to choose more than 7 squares for studio sponsorship',
        status: 'Resolved',
        remarks: 'Issue fixed in v1.2.3',
    },
];
