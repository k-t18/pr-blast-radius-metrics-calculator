import { useCallback, useState } from 'react';

/**
 * Custom hook for managing RemarkModal state and handlers
 *
 * @example
 * ```typescript
 * const { isVisible, selectedRemark, handleViewRemarks, handleClose } = useRemarkModal();
 *
 * // In your component:
 * <RemarkModal
 *   visible={isVisible}
 *   onHide={handleClose}
 *   message={selectedRemark}
 *   title="Remarks"
 * />
 *
 * // To open modal with a remark:
 * handleViewRemarks('Some remark text');
 * ```
 *
 * @returns Object containing modal visibility state, selected remark, and handlers
 */
export function useRemarkModal() {
    const [isRemarkModalVisible, setIsRemarkModalVisible] = useState(false);
    const [selectedRemark, setSelectedRemark] = useState<string>('');

    const handleViewRemarks = useCallback((remark: string) => {
        setSelectedRemark(remark);
        setIsRemarkModalVisible(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsRemarkModalVisible(false);
    }, []);

    return {
        isVisible: isRemarkModalVisible,
        selectedRemark,
        handleViewRemarks,
        handleClose,
    };
}
