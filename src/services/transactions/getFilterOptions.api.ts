import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface DocumentNameOption {
    name: string;
}

export interface GetFilterOptionsResponse extends ApiResponse<DocumentNameOption[]> {}

export interface GetFilterOptionsParameters {
    doctype_name: string;
    document_name: string;
    linked_doctype?: string;
    link_field?: string;
}

/**
 * Generic filter options API for transactions tables.
 * Returns a list of document names for the provided doctype and search term.
 */
export const getFilterOptions = (parameters: GetFilterOptionsParameters) => {
    const queryParameters = new URLSearchParams();
    queryParameters.append('doctype_name', parameters.doctype_name);
    queryParameters.append('document_name', parameters.document_name);
    if (parameters.linked_doctype) {
        queryParameters.append('linked_doctype', parameters.linked_doctype);
    }
    if (parameters.link_field) {
        queryParameters.append('link_field', parameters.link_field);
    }
    const queryString = queryParameters.toString();

    const { folder, file, function: methodName } = apiRegistry.transactionFilterList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;
    return api.get<GetFilterOptionsResponse>(endpoint);
};
