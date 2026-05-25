import React from 'react';
import type { ShareModalConfig, ShareButtonConfig, SocialPlatformConfig } from '../components/ShareModal';
import { Download, ShareNetwork, Copy } from '../../../components/icons';
import ImpactStoryCard from '../components/ImpactStoryCard';
import TestimonialCard from '../components/TestimonialCard';
import { downloadCertificateWithAuth, downloadImage } from '../../../utils/certificateDownload';
import { generateCsrShareUrl } from '../hooks/useCsrShareData';

// ============================================================================
// Interfaces
// ============================================================================

interface PartnershipShareConfigOptions {
    csrId?: string;
    ngoName: string;
    focusArea: string;
    imageUrl: string;
    certificateUrl?: string;
    title: string;
    description: string;
    shareLabel: string;
    downloadLabel: string;
    episode?: string;
    csrAmount?: number;
    status?: string;
}

export interface ShareConfigData {
    /** CSR ID (e.g., "CSR-00008") - required for generating share URLs */
    csrId?: string;
    ngoName?: string;
    imageUrl?: string;
    companyName?: string;
    focusArea?: string;
    certificateImageUrl?: string;
    certificateUrl?: string;
    storyTitle?: string;
    description?: string;
    source?: string;
    quote?: string;
    name?: string;
    role?: string;
    /** Episode name */
    episode?: string;
    /** CSR amount */
    csrAmount?: number;
    /** Status (e.g., "Completed", "Pending") */
    status?: string;
}

// ============================================================================
// Shared Constants & Helpers
// ============================================================================

const DEFAULT_SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
    { id: 'facebook', name: 'facebook', enabled: true },
    { id: 'linkedin', name: 'linkedin', enabled: true },
    { id: 'twitter', name: 'twitter', enabled: true },
    { id: 'copy-link', name: 'copy-link', enabled: true },
];

function createDefaultActionButtons(downloadLabel: string): ShareButtonConfig[] {
    return [
        {
            id: 'share',
            label: 'Share',
            icon: ShareNetwork,
            iconSize: 16,
            bgColor: 'bg-brand-500',
            textColor: 'text-white',
            borderRadius: 'rounded-sm',
            width: 'full',
            className: 'font-ubuntu px-6 text-[12px]',
            action: 'share',
            isDisabled: selectedPlatform => !selectedPlatform,
        },
        {
            id: 'download',
            label: downloadLabel,
            icon: Download,
            iconSize: 16,
            bgColor: 'bg-white',
            textColor: 'text-primary-text',
            borderColor: 'border-gray-300',
            borderRadius: 'rounded-sm',
            width: 'full',
            className: 'font-ubuntu px-6 text-[12px]',
            action: 'download',
        },
        {
            id: 'copy-caption',
            label: 'Copy Caption',
            icon: Copy,
            iconSize: 16,
            bgColor: 'bg-white',
            textColor: 'text-primary-text',
            borderColor: 'border-gray-300',
            borderRadius: 'rounded-sm',
            width: 'full',
            className: 'font-ubuntu px-6 text-[12px]',
            action: 'copy-caption',
        },
    ];
}

function generatePartnershipShareConfig({
    csrId,
    ngoName,
    focusArea,
    imageUrl,
    certificateUrl,
    title,
    description,
    shareLabel,
    downloadLabel,
    episode,
    csrAmount,
    status,
}: PartnershipShareConfigOptions): ShareModalConfig {
    // Generate a proper share URL with the CSR ID
    // This URL points to the public share page that fetches data from API
    const shareUrl = csrId
        ? generateCsrShareUrl({ csrId, ngoName, focusArea, imageUrl, certificateUrl, episode, csrAmount, status })
        : window.location.href;

    const shareText = `Proud to partner with ${ngoName} through Chances to make a difference in ${focusArea}. Every action counts! 🌍 #CSR #ChancesForChange`;

    return {
        title,
        description,
        shareLabel,
        imageUrl,
        imageAlt: `${ngoName} Partnership`,
        imageWidth: 310,
        imageHeight: 440,
        caption: shareText,
        shareUrl,
        shareTitle: shareText,
        socialPlatforms: DEFAULT_SOCIAL_PLATFORMS,
        actionButtons: createDefaultActionButtons(downloadLabel),
        onDownload: async () => {
            await (certificateUrl ? downloadCertificateWithAuth(certificateUrl) : downloadImage(imageUrl));
        },
    };
}

// ============================================================================
// Config Creators
// ============================================================================

export function createCertificateShareConfig(data: ShareConfigData): ShareModalConfig {
    const { certificateImageUrl = '', certificateUrl, ngoName = '', focusArea = '' } = data;

    return generatePartnershipShareConfig({
        ngoName,
        focusArea,
        imageUrl: certificateImageUrl,
        certificateUrl,
        title: "You've Earned It! Share Your CSR Certificate",
        description: 'Congratulations on completing your CSR commitment with Chances! Celebrate your impact and inspire others to join the movement.',
        shareLabel: 'Share this Certificate',
        downloadLabel: 'Download Certificate',
    });
}

export function createImpactStoryShareConfig(data: ShareConfigData): ShareModalConfig {
    const { storyTitle = '', description = '', source = '', imageUrl = '', ngoName = 'NGO Name' } = data;
    const shareUrl = window.location.href;
    const caption = `This is what giving back looks like Proud moments made possible through our CSR journey with @ChancesOfficial and ${ngoName}. #CSR #ChancesImpact`;

    return {
        title: 'Your Impact in Action!',
        description: 'Every number has a face. Every donation creates a story. Share how your contribution helped!',
        shareLabel: 'Share this Article/Newsletter',
        contentComponent: React.createElement(ImpactStoryCard, {
            imageUrl,
            storyTitle,
            description,
            source,
        }),
        caption,
        shareUrl,
        shareTitle: storyTitle,
        socialPlatforms: DEFAULT_SOCIAL_PLATFORMS,
        actionButtons: createDefaultActionButtons('Download Creatives'),
        onDownload: async () => {
            await downloadImage(imageUrl);
        },
    };
}

export function createTestimonialShareConfig(data: ShareConfigData): ShareModalConfig {
    const { quote = '', name = '', role = '', imageUrl = '', ngoName = 'NGO Name' } = data;
    const shareUrl = window.location.href;
    const caption = `It's an honor to be part of real stories of change. Grateful for our CSR partnership with ${ngoName} through Chances. #ChancesCSR #Socialimpact`;

    return {
        title: 'Your Work Speaks for Itself!',
        description:
            "Here's what the [NGO / community leader / participant] had to say about your support. Share it with your network and let your impact inspire others.",
        shareLabel: 'Share this Testimonial',
        contentComponent: React.createElement(TestimonialCard, {
            quote,
            name,
            role,
            imageUrl,
        }),
        caption,
        shareUrl,
        shareTitle: quote,
        socialPlatforms: DEFAULT_SOCIAL_PLATFORMS,
        actionButtons: createDefaultActionButtons('Download Creatives'),
        onDownload: async () => {
            await downloadImage(imageUrl);
        },
    };
}

export function createNgoPartnershipShareConfig(data: ShareConfigData): ShareModalConfig {
    const { csrId, ngoName = '', focusArea = '', imageUrl = '', certificateUrl, episode, csrAmount, status } = data;

    return generatePartnershipShareConfig({
        csrId,
        ngoName,
        focusArea,
        imageUrl,
        certificateUrl,
        episode,
        csrAmount,
        status,
        title: 'Share Your Impact!',
        description: 'Celebrate your partnership and inspire others to join the movement.',
        shareLabel: 'Share this Partnership',
        downloadLabel: 'Download Creatives',
    });
}
