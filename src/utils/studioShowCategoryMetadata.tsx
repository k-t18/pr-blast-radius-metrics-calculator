import type { ReactNode } from 'react';
import { Square, Lightning, Crown, Handshake, Television, Truck, Microphone, Palette } from '../components/icons';
import type { CartIconKey } from '../stores/studioShowCartStore';

export interface StudioShowCategoryMetadata {
    icon: ReactNode;
    iconKey: CartIconKey;
    iconBgColor: string;
    isMain: boolean;
    detailsLabel?: string;
    detailsLink?: string;
}

interface MetadataOptions {
    title: string;
    status?: string | null;
    type?: string;
    episodeName?: string;
}

export const getStudioShowCategoryMetadata = ({ title, type = 'category', episodeName }: MetadataOptions): StudioShowCategoryMetadata => {
    if (!title) {
        return {
            icon: <Television />,
            iconKey: 'television',
            iconBgColor: '#FFF9F0',
            isMain: false,
        };
    }
    const normalizedTitle = title.toLowerCase();

    let icon = <Square />;
    let iconKey: CartIconKey = 'square';
    let iconBgColor = '#FFF9F0';
    let isMain = false;
    let detailsLabel: string | undefined;
    let detailsLink: string | undefined;

    if (normalizedTitle.includes('square') || type === 'square') {
        icon = <Square />;
        iconKey = 'square';
        iconBgColor = '#FFF9F0';
        isMain = true;
        detailsLabel = 'View Squares';
        detailsLink = episodeName
            ? `/sponsorship-type/studio-show/select-squares?episode_name=${encodeURIComponent(episodeName)}`
            : '/sponsorship-type/studio-show/select-squares';
    } else if (normalizedTitle.includes('powered by')) {
        icon = <Lightning />;
        iconKey = 'lightning';
        iconBgColor = '#FFF3B0';
        isMain = true;
    } else if (normalizedTitle.includes('title')) {
        icon = <Crown />;
        iconKey = 'crown';
        iconBgColor = '#FFD2CE';
    } else if (normalizedTitle.includes('associate')) {
        icon = <Handshake />;
        iconKey = 'handshake';
        iconBgColor = '#C8E6C9';
    } else if (normalizedTitle.includes('commercial')) {
        icon = <Television />;
        iconKey = 'television';
        iconBgColor = '#FFD6FE';
    } else if (normalizedTitle.includes('logistics')) {
        icon = <Truck />;
        iconKey = 'truck';
        iconBgColor = '#BBD6FF';
    } else if (normalizedTitle.includes('set') || normalizedTitle.includes('placement')) {
        icon = <Microphone />;
        iconKey = 'microphone';
        iconBgColor = '#B0D8D8';
    } else if (normalizedTitle.includes('branding')) {
        icon = <Palette />;
        iconKey = 'palette';
        iconBgColor = '#D1B4E6';
    } else {
        iconKey = 'default';
    }

    return {
        icon,
        iconKey,
        iconBgColor,
        isMain,
        detailsLabel,
        detailsLink,
    };
};
