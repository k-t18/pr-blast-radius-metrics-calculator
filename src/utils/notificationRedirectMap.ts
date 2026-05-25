interface RedirectConfig {
    path: string;
    filterParam?: string;
}

const notificationRedirectMap: Record<string, RedirectConfig> = {
    'Blanket Order': {
        path: '/sponsorship-type/blanket-sponsorship?tab=1',
        filterParam: 'id',
    },
    Quotation: {
        path: '/transactions/quotes',
        filterParam: 'id',
    },
    'Sales Order': {
        path: '/transactions/orders',
        filterParam: 'order_id',
    },
    'Sales Invoice': {
        path: '/transactions/invoices',
        filterParam: 'id',
    },
    'Prize Agreement': {
        path: '/prize-agreement?subtab=1',
        filterParam: 'id',
    },
    'Payment Entry': {
        path: '/payments',
    },
};

const getNotificationRedirectUrl = (documentType: string, documentName?: string): string => {
    const config = notificationRedirectMap[documentType];

    if (config) {
        if (config.filterParam && documentName) {
            const separator = config.path.includes('?') ? '&' : '?';
            return `${config.path}${separator}${config.filterParam}=${encodeURIComponent(documentName)}`;
        }
        return config.path;
    }

    const slug = documentType.toLowerCase().replaceAll(/\s+/g, '-');
    return `/view/${slug}/${documentName ?? ''}`;
};

export default getNotificationRedirectUrl;
