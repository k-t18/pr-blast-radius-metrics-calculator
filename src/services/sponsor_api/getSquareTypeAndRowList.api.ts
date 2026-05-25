import { api, type ApiResponse } from '../api/apiClient';

/**
 * @function get_square_type_and_row_list
 * @description
 * Retrieves the list of available square types and rows for sponsorship campaigns.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_square_type_and_row_list
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Square types and rows data
 * @returns {Array<{name: string}>} response.data.square_types - List of available square types
 * @returns {Array<{name: string}>} response.data.rows - List of available rows
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "square_types": [
 *       {"name": "Chance"},
 *       {"name": "jackpot"},
 *       {"name": "brainiac"},
 *       {"name": "neutral"},
 *       {"name": "Pit"},
 *       {"name": "Vantage"},
 *       {"name": "Gift"},
 *       {"name": "Braniac"},
 *       {"name": "Standard"}
 *     ],
 *     "rows": [
 *       {"name": "10"},
 *       {"name": "9"},
 *       {"name": "8"},
 *       {"name": "7"},
 *       {"name": "6"},
 *       {"name": "5"},
 *       {"name": "4"},
 *       {"name": "3"},
 *       {"name": "2"},
 *       {"name": "1"}
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-02 09:29:39"
 * }
 */

export interface SquareTypeItem {
    name: string;
}

export interface RowItem {
    name: string;
}

export interface PeriodItem {
    name: string;
}

export interface SquareTypeAndRowListResponse {
    square_types: SquareTypeItem[];
    rows: RowItem[];
    period: PeriodItem[];
}

export const getSquareTypeAndRowList = () => {
    return api.get<ApiResponse<SquareTypeAndRowListResponse>>(
        '/api/method/chances_game.api.sponsor_api.v1.target_audience.get_square_type_and_row_list'
    );
};
