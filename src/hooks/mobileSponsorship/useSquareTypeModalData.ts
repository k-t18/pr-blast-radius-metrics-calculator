import { useApiQuery } from '../useApiQuery';
import {
    getSquareTypeModalData,
    type GetSquareTypeModalDataParameters,
    type SquareTypeModalDataResponse,
} from '../../services/sponsor_api/getSquareTypeModalData.api';
import type { ApiResponse } from '../../services/api/apiClient';

export const useSquareTypeModalData = (parameters: GetSquareTypeModalDataParameters | undefined, enabled: boolean = true) => {
    const { data, isLoading, error } = useApiQuery<ApiResponse<SquareTypeModalDataResponse>>({
        queryKey: ['square-type-modal-data', parameters],
        queryFn: () => {
            if (!parameters) {
                throw new Error('Square type modal data parameters are required');
            }
            return getSquareTypeModalData(parameters);
        },
        enabled: enabled && parameters !== undefined,
    });

    return {
        squareTypeModalData: data?.data,
        isLoading,
        error,
    };
};

export default useSquareTypeModalData;
