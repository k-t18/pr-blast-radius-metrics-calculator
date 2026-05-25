import React from 'react';
import {
    Square,
    Trophy,
    Gift,
    Crown,
    Signpost,
    Category,
    SpinnerGap,
    DropSimple,
    ArrowFatLineRight,
    Video,
} from '../../../../../../components/icons';
import { generateIdFromName } from '../../../../../../utils/sponsorshipUtils';
import type { MobileGameSponsorshipItem } from '../../../../../../services/sponsor_api/getMobileGameSponsorshipCategories.api';

export interface CategoryItem {
    id?: string;
    title?: string;
    price?: string;
    base_cpc_cpm?: string;
    tag?: string;
    description?: string;
    icon?: React.ReactNode;
    iconBgColor?: string;
    isMain?: boolean;
    detailsLabel?: string;
    tagIcon?: React.ReactNode;
}

/**
 * Map item name to icon component and background color
 */
export const getIconAndColorForItem = (name: string): { icon: React.ReactNode; iconBgColor?: string } => {
    const normalizedName = name.toLowerCase();

    if (normalizedName.includes('mobile game chance square') || normalizedName.includes('chance square')) {
        return { icon: React.createElement(Square) };
    }
    if (normalizedName.includes('weekly leaderboard') || normalizedName.includes('leaderboard')) {
        return { icon: React.createElement(Trophy), iconBgColor: '#FFF3B0' };
    }
    if (normalizedName.includes('ad title') || normalizedName.includes('title sponsorship')) {
        return { icon: React.createElement(Crown), iconBgColor: '#FFD2CE' };
    }
    if (normalizedName.includes('ad banner') || normalizedName.includes('banner')) {
        return { icon: React.createElement(Signpost), iconBgColor: '#FFD6FE' };
    }
    if (normalizedName.includes('pop-up') || normalizedName.includes('tooltip') || normalizedName.includes('popup')) {
        return { icon: React.createElement(Category), iconBgColor: '#D1B4E6' };
    }
    if (normalizedName.includes('loading screen') || normalizedName.includes('loading')) {
        return { icon: React.createElement(SpinnerGap), iconBgColor: '#C8E6C9' };
    }
    if (normalizedName.includes('overlay') || normalizedName.includes('watermark')) {
        return { icon: React.createElement(DropSimple), iconBgColor: '#B0D8D8' };
    }
    if (normalizedName.includes('interstitial')) {
        return { icon: React.createElement(ArrowFatLineRight), iconBgColor: '#BBD6FF' };
    }
    if (normalizedName.includes('video') || normalizedName.includes('clip')) {
        return { icon: React.createElement(Video), iconBgColor: '#F7C2C0' };
    }

    // Default icon
    return { icon: React.createElement(Category) };
};

/**
 * Determine if an item is a main category
 * Main category if prize_agreement_required is 1, otherwise it's a small card
 */
const isMainCategory = (prizeAgreementRequired: number): boolean => {
    return prizeAgreementRequired === 1;
};

/**
 * Transform API item to CategoryItem
 */
export const transformApiItemToCategoryItem = (item: MobileGameSponsorshipItem): CategoryItem => {
    const id = generateIdFromName(item.name);

    // Build base_cpc_cpm string, handling missing rates
    const cpmRate = item.cpm_rate;
    const cpcRate = item.cpc_rate;

    let baseCpcCpm = '';
    if (typeof cpmRate === 'number' && typeof cpcRate === 'number') {
        baseCpcCpm = `Base CPM Rate: ₦ ${cpmRate} | Base CPC Rate: ₦ ${cpcRate}`;
    } else if (typeof cpmRate === 'number') {
        baseCpcCpm = `Base CPM Rate: ₦ ${cpmRate}`;
    } else if (typeof cpcRate === 'number') {
        baseCpcCpm = `Base CPC Rate: ₦ ${cpcRate}`;
    }
    // If both are undefined, baseCpcCpm remains empty string

    const isMain = isMainCategory(item.prize_agreement_required);

    // Always prioritize "Prize Agreement Required" when prize_agreement_required === 1
    let tag: string | undefined;
    if (item.prize_agreement_required === 1) {
        tag = 'Prize Agreement Required';
    } else {
        // For "both" sponsorship type, check if it's Mobile Game Chance Square for special tag
        const specialTag = item.name.toLowerCase().includes('mobile game chance square') ? 'Squares Available' : undefined;
        tag = specialTag;
    }

    const { icon, iconBgColor } = getIconAndColorForItem(item.name);

    return {
        id,
        title: item.name,
        base_cpc_cpm: baseCpcCpm,
        tag,
        description: item.description,
        icon,
        iconBgColor,
        isMain,
        tagIcon: tag ? React.createElement(Gift) : undefined,
        detailsLabel: item.name.toLowerCase().includes('mobile game chance square') ? 'View Squares' : undefined,
    };
};
