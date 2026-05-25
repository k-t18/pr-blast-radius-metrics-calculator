import { api, type ApiResponse } from '../api/apiClient';

/**
 * @function get_game_board_cell
 * @description
 * Retrieves game board cell information for a specific square type and row position.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_game_board_cell
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @param {string} square_type - The square type (e.g., "Chance", "Vantage", "Gift")
 * @param {number} row_position - The row position (e.g., 1, 2, 3)
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Game board cell data
 * @returns {string} response.data.square_type - The square type
 * @returns {string} response.data.row_position - The row position
 * @returns {number} response.data.total_position - Total number of available positions
 * @returns {number} response.data.minimum_reward_rate - Minimum reward rate
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "square_type": "Chance",
 *     "row_position": "1",
 *     "total_position": 15.0,
 *     "minimum_reward_rate": 50000.0
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-02 09:29:58"
 * }
 */

export interface SquareTypeModalDataResponse {
    square_type: string;
    row_position: string;
    total_position: number;
    minimum_reward_rate: number;
}

export interface GetSquareTypeModalDataParameters {
    square_type: string;
    row_position: number;
}

export const getSquareTypeModalData = (parameters: GetSquareTypeModalDataParameters) => {
    const { square_type: squareType, row_position: rowPosition } = parameters;

    const queryParameters = new URLSearchParams({
        square_type: squareType,
        row_position: rowPosition.toString(),
    });

    return api.get<ApiResponse<SquareTypeModalDataResponse>>(
        `/api/method/chances_game.api.sponsor_api.v1.target_audience.get_game_board_cell?${queryParameters.toString()}`
    );
};
