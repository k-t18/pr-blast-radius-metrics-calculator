import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_document_size
 * @description
 * Retrieves the maximum file size limits for different document types (Image, Video, etc.)
 * This is used to restrict file uploads across the application.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.document_size.get_document_size
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {DocumentSizeData[]} response.data - Array of document size limits.
 * @returns {string} response.message - Result message from server.
 * @returns {string} response.timestamp - Response time.
 *
 * @typedef {Object} DocumentSizeData
 * @property {number} Image - Maximum file size for images in MB (e.g., 5.0)
 * @property {number} Video - Maximum file size for videos in MB (e.g., 10.0)
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     { "Image": 5.0 },
 *     { "Video": 10.0 }
 *   ],
 *   "message": "File Size Details fetched successfully",
 *   "timestamp": "2026-01-08 10:01:06"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.document_size.get_document_size' \
 * --header 'Authorization: token api_key:api_secret'
 */

export interface DocumentSizeData {
    Image?: number;
    Video?: number;
    [key: string]: number | undefined;
}

export interface DocumentSizeResponse {
    Image: number;
    Video: number;
}

export const getDocumentSize = async (): Promise<ApiResponse<DocumentSizeData[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getDocumentSize;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<DocumentSizeData[]>>(url);
};
