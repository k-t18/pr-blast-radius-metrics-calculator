import { DataTable } from 'primereact/datatable';
import type { DataTableProps, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { DataTableWrapperProperties } from '../../interfaces/common/table.types';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

/**
 * Thin wrapper around PrimeReact's DataTable that accepts a declarative column configuration.
 *
 * @param value - Array of row objects to render.
 * @param columns - Column descriptors controlling headers, field binding, custom body renderers, and sizing.
 * @param emptyMessage - Message displayed when no data is present.
 * @param stripedRows - Enables zebra striping. Defaults to false to allow page-level control.
 * @param className - Optional table-level class overrides.
 */
export function DataTableWrapper<RowType extends DataTableValue>({
    value,
    columns,
    emptyMessage = 'No data available',
    stripedRows = false,
    className,
    onRowClick,
    dataTableProps,
}: DataTableWrapperProperties<RowType>) {
    return (
        <DataTable
            value={value}
            emptyMessage={emptyMessage}
            stripedRows={stripedRows}
            className={className}
            onRowClick={onRowClick}
            {...(dataTableProps as DataTableProps<RowType[]> | undefined)}
        >
            {columns.map((column, index) => (
                <Column
                    key={typeof column.field === 'string' ? column.field : index.toString()}
                    field={typeof column.field === 'string' ? column.field : (column.field as string | undefined)}
                    header={column.header}
                    body={column.body ? (rowData: RowType) => column.body?.(rowData) : undefined}
                    style={column.style}
                    className={column.className}
                    headerClassName={column.headerClassName}
                    selectionMode={column.selectionMode}
                />
            ))}
        </DataTable>
    );
}
