import type { CSSProperties, ReactNode } from 'react';
import type { DataTableProps, DataTableRowClickEvent, DataTableValue } from 'primereact/datatable';

export interface DataTableWrapperColumn<RowType extends DataTableValue> {
    header: ReactNode;
    field?: keyof RowType | string;
    body?: (rowData: RowType) => ReactNode;
    style?: CSSProperties;
    className?: string;
    headerClassName?: string;
    selectionMode?: 'single' | 'multiple';
}

export interface DataTableWrapperProperties<RowType extends DataTableValue> {
    value: RowType[];
    columns: DataTableWrapperColumn<RowType>[];
    emptyMessage?: ReactNode;
    stripedRows?: boolean;
    className?: string;
    onRowClick?: (event: DataTableRowClickEvent) => void;
    dataTableProps?: Partial<DataTableProps<RowType[]>>;
}

export type FilterType = 'id' | 'order_id' | 'quotation_id' | '';

export interface SelectionChangeEvent<Value> {
    value: Value | Value[] | null;
}
