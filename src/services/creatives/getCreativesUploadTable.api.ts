import type { SubmittedCreative } from '../../interfaces/creatives/creatives.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface GetCreativesUploadTableParameters {
    type: 'mobile-game' | 'studio-show';
    limit?: number;
    offset?: number;
    order_id?: string;
    creative_id?: string;
}

/**
 * @function creatives_upload_table
 * @description
 * Fetches the submitted creatives list for a given platform (mobile-game or studio-show)
 * used to populate the \"Submitted\" creatives tables.
 *
 * @route
 * GET {{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.creatives.creatives_upload_table?type={type}
 *
 * @param {string} type - Platform type: 'mobile-game' or 'studio-show'
 */
export const getCreativesUploadTable = async (parameters: GetCreativesUploadTableParameters): Promise<ApiResponse<SubmittedCreative[]>> => {
    const { folder, file, function: methodName } = apiRegistry.creativesUploadTable;
    const queryParameters = new URLSearchParams();
    queryParameters.append('type', parameters.type);
    if (parameters.limit !== undefined) {
        queryParameters.append('limit', parameters.limit.toString());
    }
    if (parameters.offset !== undefined) {
        queryParameters.append('offset', parameters.offset.toString());
    }
    if (parameters.order_id) {
        queryParameters.append('order_id', parameters.order_id);
    }
    if (parameters.creative_id) {
        queryParameters.append('creative_id', parameters.creative_id);
    }
    const url = `${buildFrappeMethodURL(folder, file, methodName)}?${queryParameters.toString()}`;
    return api.get<ApiResponse<SubmittedCreative[]>>(url);
};
