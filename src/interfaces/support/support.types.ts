/**
 * Support Ticket Types
 */

import type { DropdownOption } from '../../components/common/Dropdown';

export interface IssueCategory {
    name: string;
    label: string;
}

export interface SponsorshipCategory {
    name: string;
    label: string;
}

export interface SupportTicketApiItem {
    ticket: string;
    date: string;
    sponsorship_type: string;
    category: string;
    subject: string;
    status: string;
    remarks: string;
}

export interface SupportTicket {
    ticketId: string;
    dateRaised: string;
    sponsorshipType: string;
    category: string;
    subject: string;
    status: string;
    remarks: string;
}

export interface SupportFormData {
    category: DropdownOption | undefined; // API-driven category
    sponsorshipType: DropdownOption | undefined; // fixed sponsorship type
    issueCategory: DropdownOption | undefined;
    subject: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    attachments: File[];
    uploadedFileNames?: string[];
}
