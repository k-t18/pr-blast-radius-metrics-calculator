import { useApiQuery } from '../../useApiQuery';
import { getInvoicesList, type GetInvoicesListParameters } from '../../../services/transactions/invoices/getInvoicesList.api';

interface UseInvoicesParameters {
    id?: string;
    order_id?: string;
    quotation_id?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

const useInvoices = (parameters?: UseInvoicesParameters) => {
    const {
        data: invoiceData,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: [
            'invoices-list',
            parameters?.type,
            parameters?.id,
            parameters?.order_id,
            parameters?.quotation_id,
            parameters?.limit,
            parameters?.offset,
        ],
        queryFn: () => {
            const apiParameters: GetInvoicesListParameters = {};
            if (parameters?.id) {
                apiParameters.id = parameters.id;
            }
            if (parameters?.order_id) {
                apiParameters.order_id = parameters.order_id;
            }
            if (parameters?.quotation_id) {
                apiParameters.quotation_id = parameters.quotation_id;
            }
            if (parameters?.type) {
                apiParameters.type = parameters.type;
            }
            if (parameters?.limit !== undefined) {
                apiParameters.limit = parameters.limit;
            }
            if (parameters?.offset !== undefined) {
                apiParameters.offset = parameters.offset;
            }
            return getInvoicesList(Object.keys(apiParameters).length > 0 ? apiParameters : undefined);
        },
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Invoices fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching invoices', error_);
        },
    });

    const invoiceList = invoiceData?.data ?? [];
    const totalCount = invoiceData?.count ?? 0;

    return { invoiceList, totalCount, isLoading, error, refetch };
};

export default useInvoices;
