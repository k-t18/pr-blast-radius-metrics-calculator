import type { CertificateResponse } from '../../interfaces/csr/certificate.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * @function get_latest_certifcate
 * @description
 * Retrieves the latest CSR certificate for the logged-in customer including:
 * - Certificate PDF download URL
 * - Certificate image URL
 *
 * This API is useful for displaying the certificate in the CSR dashboard,
 * allowing users to download or share their CSR certificate.
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_latest_certifcate
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {CertificateResponse} response.data - Certificate data with PDF and image URLs.
 * @returns {string} response.message - Summary description.
 * @returns {string} response.timestamp - Server response time.
 *
 * @typedef {Object} CertificateResponse
 * @property {string} certificate - URL to download the certificate PDF.
 * @property {string} image - URL to the certificate image.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "certificate": "https://dev-chances.8848digitalerp.com/api/method/frappe.utils.print_format.download_pdf?doctype=CSR%20Donation&name=CSR-00032&format=Sponsor%20Donation",
 *     "image": "https://dev-chances.8848digitalerp.com/files/CSR-00032_certificate.png"
 *   },
 *   "message": "Latest Certificate Fetched Successfully",
 *   "timestamp": "2025-12-16 12:21:57"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Unauthorized access.",
 *   "timestamp": "2025-12-06 23:22:15",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_latest_certifcate' \
 * --header 'Authorization: token api_key:api_secret'
 */
export const getLatestCertificate = async (): Promise<ApiResponse<CertificateResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getLatestCertificate;
    const baseUrl = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}`;

    return api.get<ApiResponse<CertificateResponse>>(baseUrl);
};
