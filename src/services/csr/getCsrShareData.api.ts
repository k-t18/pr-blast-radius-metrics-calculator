/**
 * CSR Share Data API Service
 *
 * Fetches CSR donation data for sharing purposes using the public
 * get_ngo_patnership_social API with ID and public parameters.
 *
 * @module getCsrShareData
 */

import type { CsrShareData, NGOPartnershipItem } from '../../interfaces/csr/ngoPartnershipList.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * @function get_ngo_patnership_social
 * @description
 * Retrieves CSR donation data by ID for sharing purposes.
 * Uses the public get_ngo_patnership_social API with id and public parameters.
 * This endpoint does not require authentication and is designed for public sharing.
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_ngo_patnership_social?id=CSR-00032&public=1
 *
 * @authentication
 * Not required — This is a public endpoint.
 *
 * @param {string} csrId - The CSR donation ID (e.g., "CSR-00032")
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {NGOPartnershipItem[]} response.data - List containing the CSR donation record.
 * @returns {string} response.message - Summary description.
 * @returns {string} response.timestamp - Server response time.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "ngo_name": "Lagos Food Bank Initiative",
 *       "csr_amount": 5000.0,
 *       "episode": "1-2-Battle of Brains",
 *       "name": "CSR-00032",
 *       "certificate_image": "/files/CSR-00032-028b5603e0c24f808f7ecbc47508b92b.png",
 *       "focus_area ": "Education",
 *       "paid_amount": 5000.0,
 *       "status": "Completed",
 *       "certificate": "https://dev-chances.8848digitalerp.com/api/method/frappe.utils.print_format.download_pdf?doctype=CSR%20Donation&name=CSR-00032&format=Sponsor%20Donation",
 *       "image": "https://dev-chances.8848digitalerp.com/files/CSR-00032-028b5603e0c24f808f7ecbc47508b92b.png"
 *     }
 *   ],
 *   "message": "CSR NGO partnerships fetched successfully",
 *   "count": 1,
 *   "timestamp": "2025-12-22 15:16:28"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_ngo_patnership_social?id=CSR-00032&public=1' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 */
export const getCsrShareData = async (csrId: string): Promise<ApiResponse<NGOPartnershipItem[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getNgoPartnershipSocial;
    const baseUrl = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}`;

    const queryParameters = new URLSearchParams();
    queryParameters.append('id', csrId);
    queryParameters.append('public', '1');
    const queryString = queryParameters.toString();
    const url = `${baseUrl}?${queryString}`;

    return api.get<ApiResponse<NGOPartnershipItem[]>>(url);
};

/**
 * Transforms API response to CsrShareData format
 *
 * @param apiResponse - The API response from get_ngo_patnership_social
 * @returns CsrShareData or null if no data
 */
export function transformToCsrShareData(apiResponse: ApiResponse<NGOPartnershipItem[]> | undefined): CsrShareData | null {
    if (!apiResponse?.data || apiResponse.data.length === 0) {
        return null;
    }

    const item = apiResponse.data[0];

    return {
        csrId: item.name,
        ngoName: item.ngo_name,
        focusArea: item.focus_area ?? item['focus_area '] ?? 'Social Impact',
        imageUrl: item.image || '',
        certificateUrl: item.certificate,
        episode: item.episode ?? undefined,
        csrAmount: item.csr_amount,
        status: item.status,
    };
}
