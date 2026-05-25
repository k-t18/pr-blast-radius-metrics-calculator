import { useCallback, useMemo, useState } from 'react';
import { DataTableWrapper } from '../../../components/common/DataTable';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import type { SupportTicket } from '../../../interfaces/support/support.types';
import StatusBadge from '../../../components/common/StatusBadge';
import ActionButton from '../../../components/common/ActionButton';
import HeaderTitle from '../../../components/common/HeaderTitle';
import ModalWrapper from '../../../components/common/ModalWrapper';
import DescriptionText from '../../../components/common/DescriptionText';
import useFetchSupportData from '../hooks/useFetchSupportData';
import CustomTableFilter from '../../../components/common/tableFilter/CustomTableFilter';
import type { TableFilterOption } from '../../../interfaces/common/filter.types';
import { useTicketIdOptions } from '../hooks/useTicketIdOptions';
import { useTableFilterLogic } from '../../../hooks/useTableFilterLogic';

type SupportTicketFilterKey = 'id';

const supportTicketFilterOptions: TableFilterOption<SupportTicketFilterKey>[] = [{ label: 'Ticket ID', value: 'id' }];

function TicketHistory() {
    const [page, setPage] = useState(0);
    const [remarksModalVisible, setRemarksModalVisible] = useState(false);
    const [selectedRemarks, setSelectedRemarks] = useState('');
    const rowsPerPage = 10;

    const { filterParameters, selectedFields, handleApplyFilters, handleClearFilters, handleValueTextChange } =
        useTableFilterLogic<SupportTicketFilterKey>({
            onFilterChange: () => setPage(0),
        });

    const { ticketIdOptions } = useTicketIdOptions(selectedFields.has('id'));

    const {
        supportTickets: supportTicketsRaw,
        supportTicketsCount,
        isLoadingSupportTickets,
    } = useFetchSupportData({
        ticketLimit: rowsPerPage,
        // Backend expects zero-based page index (0 for first page, 1 for second, etc.)
        ticketOffset: page,
        ticketId: filterParameters.id,
    });

    const supportTicketsMapped = useMemo<SupportTicket[]>(() => {
        return supportTicketsRaw.map(ticket => ({
            ticketId: ticket.ticket,
            dateRaised: ticket.date,
            sponsorshipType: ticket.sponsorship_type,
            category: ticket.category,
            subject: ticket.subject,
            status: ticket.status,
            remarks: ticket.remarks,
        }));
    }, [supportTicketsRaw]);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
    };

    const renderStatus = useCallback(
        (rowData: SupportTicket) => <StatusBadge statusKey={rowData.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        []
    );

    const handleViewRemarks = useCallback((remarks?: string) => {
        if (!remarks) return;
        setSelectedRemarks(remarks);
        setRemarksModalVisible(true);
    }, []);

    const renderActions = useCallback(
        (rowData: SupportTicket) => {
            return (
                <span className="flex items-center justify-end">
                    <ActionButton
                        bgColor="bg-white"
                        textColor="text-primary-text"
                        borderColor="#D6D6D6"
                        borderRadius="rounded"
                        width="auto"
                        className="min-h-9 text-xs font-normal leading-5 border w-fit hover:bg-[#F9FAFB] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#D0D5DD]"
                        onClick={() => handleViewRemarks(rowData.remarks)}
                    >
                        View Remarks
                    </ActionButton>
                </span>
            );
        },
        [handleViewRemarks]
    );

    const ticketColumns: DataTableWrapperColumn<SupportTicket>[] = useMemo(
        () => [
            {
                field: 'ticketId',
                header: 'Ticket ID',
                style: { width: '12%' },
            },
            {
                field: 'dateRaised',
                header: 'Date Raised',
                style: { width: '15%' },
            },
            {
                field: 'sponsorshipType',
                header: 'Sponsorship Type',
                style: { width: '12%' },
            },
            {
                field: 'category',
                header: 'Category',
                style: { width: '10%' },
            },
            {
                field: 'subject',
                header: 'Subject',
                style: { width: '15%' },
            },
            {
                field: 'status',
                header: 'Status',
                body: renderStatus,
                style: { width: '15%' },
            },
            {
                header: '',
                body: renderActions,
                style: { width: '15%', textAlign: 'right' },
            },
        ],
        [renderActions, renderStatus]
    );

    return (
        <div className="mt-8">
            <HeaderTitle text="Ticket History" size="xl" weight="medium" className="font-ubuntu mb-3.5" />

            <CustomTableFilter
                options={supportTicketFilterOptions}
                onClear={handleClearFilters}
                valueOptions={{ id: ticketIdOptions }}
                onApply={handleApplyFilters}
                onValueTextChange={handleValueTextChange}
                className="mb-4"
            />

            <DataTableWrapper
                value={supportTicketsMapped}
                columns={ticketColumns}
                className="custom-table support-tickets-table"
                stripedRows={false}
                dataTableProps={{
                    dataKey: 'ticketId',
                    paginator: true,
                    rows: rowsPerPage,
                    first: page * rowsPerPage,
                    totalRecords: supportTicketsCount ?? supportTicketsMapped.length,
                    loading: isLoadingSupportTickets,
                    lazy: true,
                    onPage: event => handlePageChange(event.page ?? 0),
                }}
            />

            <ModalWrapper
                visible={remarksModalVisible}
                onHide={() => setRemarksModalVisible(false)}
                showCloseButton
                title="Ticket Remarks"
                titleSize="md"
                titleWeight="medium"
                modalSize="sm"
            >
                <div className="flex flex-col gap-3">
                    <DescriptionText text={selectedRemarks || 'No remarks available.'} size="sm" color="text-primary-text" weight="normal" />
                </div>
            </ModalWrapper>
        </div>
    );
}

export default TicketHistory;
