import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface VatCalculationItem {
    item_code: string;
    qty: number;
}

export interface VatCalculationPayload {
    items: VatCalculationItem[];
}

export type VatCalculationResponse = {
    status: 'success' | 'error';
    message?: string;
    data?: unknown;
};

export const getVatCalculation = (payload: VatCalculationPayload) => {
    const { folder, file, function: methodName } = apiRegistry.getVatCalculation;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.post<VatCalculationResponse>(url, payload);
};
