import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import type { ApiResponse } from '../../../services/api/apiClient';
import { getIssueCategory } from '../../../services/support/getIssueCategory.api';
import { getSponsorshipCategory } from '../../../services/support/getSponsorshipCategory.api';
import { getSupportTickets } from '../../../services/support/getSupportTickets.api';
import { createSupportTicket } from '../../../services/support/createSupportTicket.api';
import { fileUpload } from '../../../services/general/fileUpload.api';
import type { IssueCategory, SponsorshipCategory, SupportTicketApiItem, SupportFormData } from '../../../interfaces/support/support.types';

interface SupportPaginationOptions {
    ticketLimit?: number;
    ticketOffset?: number;
    ticketId?: string;
}

const useFetchSupportData = ({ ticketLimit = 10, ticketOffset = 0, ticketId }: SupportPaginationOptions = {}) => {
    const queryClient = useQueryClient();

    const {
        data: issueCategoryData,
        isLoading: isLoadingIssueCategory,
        error: errorIssueCategory,
    } = useApiQuery<ApiResponse<IssueCategory[]>>({
        queryKey: ['support', 'issue-category'],
        queryFn: getIssueCategory,
    });

    const {
        data: sponsorshipCategoryData,
        isLoading: isLoadingSponsorshipCategory,
        error: errorSponsorshipCategory,
    } = useApiQuery<ApiResponse<SponsorshipCategory[]>>({
        queryKey: ['support', 'sponsorship-category'],
        queryFn: getSponsorshipCategory,
    });

    const {
        data: supportTicketsData,
        isLoading: isLoadingSupportTickets,
        error: errorSupportTickets,
    } = useApiQuery<ApiResponse<SupportTicketApiItem[]>>({
        queryKey: ['support', 'tickets', ticketLimit, ticketOffset, ticketId],
        queryFn: () => getSupportTickets(ticketLimit, ticketOffset, ticketId),
    });

    const uploadAttachmentMutation = useApiMutation<ApiResponse<string[]>, File>({
        mutationFn: file => fileUpload(file),
    });

    const normalizeDropdown = (value: SupportFormData['category'] | SupportFormData['issueCategory'] | SupportFormData['sponsorshipType']) =>
        typeof value === 'string' ? value : value?.value;

    const createTicketMutation = useApiMutation<ApiResponse<unknown>, SupportFormData>({
        mutationFn: formData => {
            const attachments =
                formData.uploadedFileNames && formData.uploadedFileNames.length > 0
                    ? formData.uploadedFileNames.map(fileName => ({ filename: fileName }))
                    : (formData.attachments ?? []).map(file => ({ filename: file.name }));

            return createSupportTicket({
                subject: formData.subject,
                description: formData.description,
                category: normalizeDropdown(formData.category) as string,
                issue_type: normalizeDropdown(formData.issueCategory) as string,
                user_type: 'Sponsor',
                sponsorship_type: normalizeDropdown(formData.sponsorshipType) as string,
                // priority: formData.priority,
                attachments: attachments.length > 0 ? attachments : undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
        },
    });

    return {
        issueCategories: issueCategoryData?.data ?? [],
        isLoadingIssueCategory,
        errorIssueCategory,
        sponsorshipCategories: sponsorshipCategoryData?.data ?? [],
        isLoadingSponsorshipCategory,
        errorSponsorshipCategory,
        supportTickets: supportTicketsData?.data ?? [],
        supportTicketsCount: supportTicketsData?.count ?? 0,
        isLoadingSupportTickets,
        errorSupportTickets,
        createTicketMutation,
        uploadAttachmentMutation,
    };
};

export default useFetchSupportData;
