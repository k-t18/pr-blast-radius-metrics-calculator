import type { TableFilterOption } from '../../interfaces/common/filter.types';
import type { FilterType } from '../../interfaces/common/table.types';

export const tableFilterOptions: TableFilterOption<Exclude<FilterType, ''>>[] = [
    { label: 'ID', value: 'id' },
    { label: 'Order ID', value: 'order_id' },
    { label: 'Quote ID', value: 'quotation_id' },
];
