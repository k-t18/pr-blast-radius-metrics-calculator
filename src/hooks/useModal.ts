/**
 * Generic Modal Hook
 * -------------------
 * A simple, reusable hook for managing modal visibility state.
 *
 * @example
 * // Basic usage
 * const { visible, show, hide, toggle } = useModal();
 *
 * <button onClick={show}>Open Modal</button>
 * <SuccessModal visible={visible} onHide={hide} ... />
 *
 * @example
 * // Start with modal open
 * const { visible, show, hide } = useModal(true);
 *
 * @example
 * // Multiple modals in same component
 * const successModal = useModal();
 * const confirmModal = useModal();
 *
 * <SuccessModal visible={successModal.visible} onHide={successModal.hide} ... />
 * <ConfirmModal visible={confirmModal.visible} onHide={confirmModal.hide} ... />
 */

import { useState, useCallback, useMemo } from 'react';

export interface UseModalReturn {
    /** Current visibility state of the modal */
    visible: boolean;
    /** Show the modal */
    show: () => void;
    /** Hide the modal */
    hide: () => void;
    /** Toggle modal visibility */
    toggle: () => void;
    /** Set visibility to a specific value */
    setVisible: (value: boolean) => void;
}

/**
 * Custom hook for managing modal visibility
 * @param initialVisible - Initial visibility state (default: false)
 * @returns Object containing visibility state and control functions
 */
function useModal(initialVisible = false): UseModalReturn {
    const [visible, setVisible] = useState(initialVisible);

    const show = useCallback(() => {
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
    }, []);

    const toggle = useCallback(() => {
        setVisible(previous => !previous);
    }, []);

    return useMemo(
        () => ({
            visible,
            show,
            hide,
            toggle,
            setVisible,
        }),
        [visible, show, hide, toggle]
    );
}

export default useModal;
