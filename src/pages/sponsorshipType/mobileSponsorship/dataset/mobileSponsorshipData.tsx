import { Gift, CursorClick, Sparkle, Eye, HandPointing, Target } from '../../../../components/icons';
import { Colors } from '../../../../styles/tokens';
import type { CampaignObjective } from '../[categories]/createCampaign/components/steps/Step3SelectCampaignObjective';

export interface SponsorshipType {
    id: string;
    title: string;
    icon: React.ReactNode;
    rewardAmount?: string;
    description?: string;
    isRecommended?: boolean;
}

export const sponsorshipTypes: SponsorshipType[] = [
    {
        id: 'sponsor-rewards',
        title: 'Sponsor Rewards',
        icon: <Gift size={24} color={Colors.text.black} />,
        description: 'Sponsor rewards when players land on a square',
    },
    {
        id: 'run-ad-campaigns',
        title: 'Run Ad Campaigns',
        icon: <CursorClick size={24} color={Colors.text.black} />,
        description: 'Sponsor rewards when players land on a square',
    },
    {
        id: 'both-rewards-ads',
        title: 'Both Rewards & Ads Campaign',
        icon: <Sparkle size={24} color={Colors.text.black} />,
        description: 'for better reach or something',
        isRecommended: true,
    },
];

export const adsCampaignObjectives: CampaignObjective[] = [
    {
        id: 'visibility',
        name: 'Visibility',
        description: 'Focus on reaching the largest audience possible and brand exposure.',
        isDefault: true,
        icon: <Eye size={20} />,
    },
    {
        id: 'engagement',
        name: 'Engagement',
        description: 'Drive interactions, clicks, and user participation with your ads.',
        rateLabel: 'Base CPC Rate:',
        icon: <HandPointing size={20} />,
    },
    {
        id: 'both',
        name: 'Both',
        description: 'Drive interactions, clicks, and user participation with your ads.',
        badge: 'Recommended',
        icon: <Target size={20} />,
    },
];

export const sponsorRewardsCampaignObjectives: CampaignObjective[] = [
    {
        id: 'visibility',
        name: 'Visibility',
        description: 'Focus on reaching the largest audience possible and brand exposure.',
        baseCpmRate: 15,
        isDefault: true,
        icon: <Eye size={20} />,
    },
];
