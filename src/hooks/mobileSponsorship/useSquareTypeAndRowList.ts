import { useApiQuery } from '../useApiQuery';
import { getSquareTypeAndRowList, type SquareTypeAndRowListResponse } from '../../services/sponsor_api/getSquareTypeAndRowList.api';
import type { ApiResponse } from '../../services/api/apiClient';

export const useSquareTypeAndRowList = (enabled: boolean = true) => {
    const { data, isLoading, error } = useApiQuery<ApiResponse<SquareTypeAndRowListResponse>>({
        queryKey: ['square-type-and-row-list'],
        queryFn: () => getSquareTypeAndRowList(),
        enabled,
    });

    return {
        squareTypeAndRowListData: data?.data,
        isLoading,
        error,
    };
};

export default useSquareTypeAndRowList;
