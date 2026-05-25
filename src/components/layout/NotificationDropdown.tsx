import { useRef, useState, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { OverlayPanel } from 'primereact/overlaypanel';
import { TabPanel, TabView } from 'primereact/tabview';
import { Bell, X, FileText, Receipt, Wallet } from '../icons';
import { useNotificationStore, type Notification } from '../../stores/notificationStore';
import getNotificationRedirectUrl from '../../utils/notificationRedirectMap';
import { readNotification } from '../../services/notifications/readNotification.api';
import '../../styles/notification.css';

/**
 * Calculate relative time from creation date
 */
const getRelativeTime = (creation: string): string => {
    const creationDate = new Date(creation);
    const now = new Date();
    const diffMs = now.getTime() - creationDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return creationDate.toLocaleDateString();
};

function NotificationDropdown() {
    const overlayReference = useRef<OverlayPanel>(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notifications = useNotificationStore(state => state.notifications);

    const unreadNotifications = useMemo(() => notifications.filter(n => !n.isRead), [notifications]);
    const unreadCount = unreadNotifications.length;

    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        overlayReference.current?.toggle(event);
    };

    const handleHide = () => {
        setIsOpen(false);
    };

    const handleShow = () => {
        setIsOpen(true);
    };

    const getNotificationIcon = (documentType: string) => {
        const iconProperties = { size: 24, color: '#000000' };
        const type = documentType.toLowerCase();

        if (type.includes('quotation') || type.includes('blanket order') || type.includes('sales order')) return <FileText {...iconProperties} />;
        if (type.includes('sales invoice')) return <Receipt {...iconProperties} />;
        if (type.includes('payment entry')) return <Wallet {...iconProperties} />;
        return <Bell {...iconProperties} />;
    };

    const renderNotificationItem = (notification: Notification) => (
        <div key={notification.name} className="flex gap-4 p-0 py-4 border-b border-gray-100 last:border-b-0 hover:bg-transparent">
            {/* Icon Circle */}
            <div className="shrink-0">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: notification.isRead ? '#E5E5E5' : '#F6F6F6' }}
                >
                    {getNotificationIcon(notification.document_type)}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[12px] font-medium text-[#000000] leading-5" style={{ fontFamily: 'Poppins' }}>
                        {notification.subject}
                    </h4>

                    {/* Timestamp & Dot Group */}
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <span className="text-xs text-[#818181]">{getRelativeTime(notification.creation)}</span>
                        {!notification.isRead && <div className="w-2 h-2 bg-[#E53935] rounded-full" />}
                    </div>
                </div>

                <p className="text-[12px] font-normal text-[#636363] mt-1 leading-relaxed">{notification.content}</p>

                <button
                    type="button"
                    className="text-[13px] font-medium text-(--color-brand-500) hover:text-brand-600 mt-1.5 inline-block transition-colors cursor-pointer bg-transparent border-0 p-0"
                    onClick={async () => {
                        if (!notification.isRead) {
                            try {
                                await readNotification(notification.name);
                            } catch {
                                // ignore — still navigate even if marking read fails
                            }
                        }
                        const targetUrl = getNotificationRedirectUrl(notification.document_type, notification.document_name);
                        const targetPath = targetUrl.split('?')[0];
                        if (window.location.pathname === targetPath) {
                            window.location.href = targetUrl;
                        } else {
                            queryClient.invalidateQueries({ queryKey: ['notifications'] });
                            overlayReference.current?.hide();
                            navigate(targetUrl);
                        }
                    }}
                >
                    View
                </button>
            </div>
        </div>
    );

    const renderNotificationsList = (notificationsList: Notification[]) => {
        if (notificationsList.length === 0) {
            return (
                <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                        <Bell size={24} color="#000000" />
                    </div>
                    <p className="text-sm text-black">No notifications yet</p>
                </div>
            );
        }

        return (
            <div>
                <div className="text-[14px] text-[#818181] pb-4 font-normal leading-[22px]" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                    Last 7 Days
                </div>
                <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-col">{notificationsList.map(notification => renderNotificationItem(notification))}</div>
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                type="button"
                onClick={handleToggle}
                className={`flex items-center gap-2 relative px-3 py-2 rounded-sm transition-all duration-200 cursor-pointer ${
                    isOpen ? 'bg-(--color-brand-500) text-white shadow-md hover:text-white' : 'text-[#000000] hover:bg-gray-50'
                }`}
            >
                <Bell size={20} color={isOpen ? '#ffffff' : '#000000'} />
                <span
                    className={`text-[12px] font-medium leading-5 ${isOpen ? 'text-white' : 'text-[#000000]'}`}
                    style={{ fontFamily: 'Poppins', fontWeight: 500 }}
                >
                    Notifications
                </span>
                {unreadCount > 0 && (
                    <span
                        className={`
                         flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none border-2 border-white
                        ${isOpen ? 'bg-white text-(--color-brand-500) border-(--color-brand-500)' : 'bg-red-500 text-white'}
                    `}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            <OverlayPanel
                ref={overlayReference}
                className="notification-overlay-panel !p-0 !border-none !shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                dismissable
                onShow={handleShow}
                onHide={handleHide}
            >
                <div className="w-[400px] bg-white rounded-lg overflow-hidden flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-0">
                        <h3 className="text-base  font-medium text-black">Notifications</h3>
                        <button
                            type="button"
                            onClick={() => overlayReference.current?.hide()}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X size={16} color="#000000" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div>
                        <TabView activeIndex={activeTabIndex} onTabChange={event => setActiveTabIndex(event.index)} className="notification-tabview">
                            <TabPanel header="All">{renderNotificationsList(notifications)}</TabPanel>
                            <TabPanel header={`Unread (${unreadCount})`}>{renderNotificationsList(unreadNotifications)}</TabPanel>
                        </TabView>
                    </div>
                </div>
            </OverlayPanel>
        </>
    );
}

export default NotificationDropdown;
