import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

export interface IssueListItem {
    name: string;
}

/**
 * Fetches document names for a given doctype (used for Support Ticket ID filter options).
 *
 * Example backend:
 * `/api/method/chances_game.chances_game.customization.issue.api.get_issue_list?doctype_name=Ticket`
 */
export const getIssueList = async (doctypeName: string): Promise<ApiResponse<IssueListItem[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getIssueList;
    const url = `/api/method/chances_game.chances_game.${folder}.${file}.${methodName}?doctype_name=${encodeURIComponent(doctypeName)}`;
    return api.get<ApiResponse<IssueListItem[]>>(url);
};
