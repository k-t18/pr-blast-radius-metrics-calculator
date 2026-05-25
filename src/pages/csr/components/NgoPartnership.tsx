import { useState, useMemo, useCallback } from 'react';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { DataTableWrapper } from '../../../components/common/DataTable';
import { getNgoPartnershipColumns } from '../dataset/csrColumn';
import type { NGOPartnershipItem } from '../../../interfaces/csr/ngoPartnershipList.types';
import type { ApiError } from '../../../services/api/apiClient';
import ShareModal from './ShareModal';
import { createNgoPartnershipShareConfig } from '../config/shareModalConfigs';

interface NgoPartnershipProperties {
    data: NGOPartnershipItem[];
    isLoading: boolean;
    error: ApiError | null;
    totalCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number, rows: number) => void;
}

function NgoPartnership({ data, isLoading, error, totalCount, page, rowsPerPage, onPageChange }: NgoPartnershipProperties) {
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [selectedShareItem, setSelectedShareItem] = useState<NGOPartnershipItem | null>(null);

    const emptyMessage = !isLoading && data.length === 0 ? 'No NGO partnerships found' : undefined;
    const totalRecords = totalCount ?? data.length;

    const handleShare = useCallback((item: NGOPartnershipItem) => {
        setSelectedShareItem(item);
        setIsShareModalVisible(true);
    }, []);

    const columns = useMemo(() => getNgoPartnershipColumns(handleShare), [handleShare]);

    const shareModalConfig = useMemo(() => {
        if (!selectedShareItem) return null;
        return createNgoPartnershipShareConfig({
            csrId: selectedShareItem.name, // CSR ID (e.g., "CSR-00008")
            ngoName: selectedShareItem.ngo_name,
            focusArea: selectedShareItem.focus_area ?? selectedShareItem['focus_area '] ?? 'N/A',
            imageUrl: selectedShareItem.image ?? '',
            certificateUrl: selectedShareItem.certificate,
            episode: selectedShareItem.episode ?? undefined,
            csrAmount: selectedShareItem.csr_amount,
            status: selectedShareItem.status,
        });
    }, [selectedShareItem]);

    return (
        <div>
            <HeaderTitle text="NGO Partnerships" size="2xl" weight="medium" className="mb-4" />
            {error && <div className="p-4 text-red-600">Error: {error.message}</div>}
            <div className="bg-white">
                <DataTableWrapper
                    value={error ? [] : data}
                    dataTableProps={{
                        lazy: true,
                        paginator: true,
                        rows: rowsPerPage,
                        first: page * rowsPerPage,
                        totalRecords,
                        rowsPerPageOptions: [5, 10, 20, 30, 50],
                        onPage: event => onPageChange(event.page ?? 0, event.rows ?? rowsPerPage),
                        loading: isLoading,
                    }}
                    emptyMessage={emptyMessage}
                    columns={columns}
                    className="custom-table ngo-partnership-table"
                    stripedRows={false}
                />
            </div>
            {shareModalConfig && <ShareModal visible={isShareModalVisible} onHide={() => setIsShareModalVisible(false)} config={shareModalConfig} />}
        </div>
    );
}

export default NgoPartnership;
