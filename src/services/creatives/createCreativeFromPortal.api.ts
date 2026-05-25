import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface PortalCreativeAttachment {
    filename: string;
    asset_type: string;
}

export interface PortalCreativeQuestion {
    question: string;
    answer: string;
    // Supports dynamic number of options: option1, option2, option3, ...
    [key: `option${number}`]: string;
}

export interface PortalCreativeEntry {
    sales_order_item: string;
    sales_order: string;
    item: string | undefined;
    sponsorship_category?: string;
    game_format: string;
    attachments: PortalCreativeAttachment[];
    qa?: PortalCreativeQuestion[];
}

export interface CreateCreativeFromPortalRequest {
    portal_creatives: PortalCreativeEntry[];
}

export const createCreativeFromPortal = async (payload: CreateCreativeFromPortalRequest): Promise<ApiResponse<unknown>> => {
    const { folder, file, function: methodName } = apiRegistry.createCreativeFromPortal;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.post<ApiResponse<unknown>>(url, payload);
};
