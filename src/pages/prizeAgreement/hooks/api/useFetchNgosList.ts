import { getNGOsList } from '../../../../services/transactions/prize-agreement/getNgosList.api';
import { useApiQuery } from '../../../../hooks/useApiQuery';
import type { NGOItem } from '../../../../interfaces/ngo/ngo.types';
import type { ApiResponse } from '../../../../services/api/apiClient';

const useFetchNGOsList = () => {
    const {
        data: ngoListResponse,
        isLoading,
        error,
    } = useApiQuery<ApiResponse<NGOItem[]>>({
        queryKey: ['ngos'],
        queryFn: () => getNGOsList(),
    });

    return {
        ngoList: ngoListResponse?.data ?? [],
        isLoading,
        error,
    };
};

export default useFetchNGOsList;
