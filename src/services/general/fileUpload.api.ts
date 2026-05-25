import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function upload_files_from_portal
 * @description
 * Uploads one or more creative files (images, documents, media) from the sponsor portal
 * into the ERPNext file system. The endpoint processes the uploaded file(s), stores
 * them on the server, and returns a reference file name or ID that applications
 * can use for further processing (e.g., linking to a doctype).
 *
 * This endpoint is commonly used in:
 * - Sponsor creative uploads
 * - Ad creatives
 * - Prize agreement attachments
 * - Media uploads in the sponsor portal
 *
 * @route
 * POST {{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.creatives.upload_files_from_portal
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @requires
 * Multipart Form Data:
 * @form {File} file - The file to be uploaded. (Required)
 *
 * @returns {Object} response - API response wrapper
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Array<UploadFileResponse>} response.data - List of uploaded file details.
 * @returns {string} response.message - Result description.
 * @returns {string} response.timestamp - Timestamp when API response was created.
 *
 * @typedef {Object} UploadFileResponse
 * @property {string} file_name - System-generated unique file identifier for the uploaded file.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "file_name": "c8c52b6984"
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-03 11:56:22"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Invalid file format. Only images are allowed.",
 *   "timestamp": "2025-12-03 11:57:40",
 *   "error_code": "INVALID_FILE"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.creatives.upload_files_from_portal' \
 * --header 'Authorization: token api_key:api_secret' \
 * --form 'file=@"/path/to/file.png"'
 */
export const fileUpload = async (file: File): Promise<ApiResponse<string[]>> => {
    const { folder, file: fileName, function: methodName } = apiRegistry.fileUpload;
    const url = buildFrappeMethodURL(folder, fileName, methodName);

    const formData = new FormData();
    formData.append('file', file);

    return api.post<ApiResponse<string[]>>(url, formData);
};
