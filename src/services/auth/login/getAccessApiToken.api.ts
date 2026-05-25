import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponseData {
    token: string;
    csrf_token: string;
    sid: string;
    user: string;
}

export type GetAccessApiTokenResponse = ApiResponse<LoginResponseData>;

/**
 * Request access API token for the sponsor portal.
 * Endpoint: chances_game.api.sponsor_api.v1.login.get_access_api_token
 */
export const getAccessApiToken = ({ email, password }: LoginPayload) => {
    const { folder, file, function: methodName } = apiRegistry.getAccessApiToken;
    const baseUrl = buildFrappeMethodURL(folder, file, methodName);
    const parameters = new URLSearchParams({ usr: email, pwd: password });
    const queryString = parameters.toString();
    const finalUrl = `${baseUrl}?${queryString}`;
    return api.get<GetAccessApiTokenResponse>(finalUrl, { credentials: 'include' });
};
