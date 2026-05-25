export type CreativePlatform = 'mobile-game' | 'studio-show';

export type CreativeSubmissionStatus = 'to-do' | 'submitted';

export interface CreativesSelectOption {
    label: string;
    value: string;
}

export interface CreativeAssetRequirement {
    id: string;
    assetTypeOptions: CreativesSelectOption[];
    maxFileSizeMB: number;
    helperText: string;
}

export interface CreativeLogoRequirement {
    id: string;
    imageUrl: string;
    fileName?: string;
    alt: string;
    dimensions: string;
    format: string;
    sizeLimit: string;
}

export interface CreativeEpisode {
    id: string;
    title: string;
    episodeLabel: string;
    progress: number;
    logoRequirement: CreativeLogoRequirement;
    assetRequirement: CreativeAssetRequirement;
}

export interface CreativeOrderSummary {
    orderId: string;
    totalAmount: number;
    dueDate: string;
    episodes: CreativeEpisode[];
}

export interface CreativeTab {
    label: string;
    value: string;
}

export interface SubmittedCreative {
    id: string;
    orderId: string;
    creativesId: string;
    sponsorshipType?: string; // Only for Mobile Game
    assetType: string;
    placement: string;
    file: string;
    utm_link?: string; // Only for Mobile Game
    submitted_on: string;
    status: 'pending_review' | 'rejected' | 'approved';
    square?: string;
    square_type?: string;
    remarks?: string;
}

export interface CreativesOrderCardProperties {
    order: CreativeOrderSummary;
    platform: 'mobile-game' | 'studio-show';
}

export interface EpisodeData {
    episodeId: string;
    logoFile: File | undefined;
    uploadedLogoFileName?: string;
    logoRemoved?: boolean; // true when user explicitly removes logo (via Remove button)
    creatives: Array<{
        assetType: string;
        file: File;
        url?: string;
        uploadedFileName?: string;
    }>;
    questions: Question[];
}

export interface CreativeEpisodeContentProperties {
    episode: CreativeEpisode;
    platform: 'mobile-game' | 'studio-show';
    progress?: number;
    onDataChange?: (data: {
        logoFile: File | undefined;
        logoRemoved?: boolean;
        creatives: Array<{ assetType: string; file: File; url?: string }>;
        questions: Question[];
    }) => void;
}

export interface CreativeSection {
    id: string;
    assetType: CreativesSelectOption | undefined;
    file: File | undefined;
    url: string;
}

export interface QnAOption {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    questionText: string;
    options: QnAOption[];
    correctOptionId: string | undefined;
}

export interface QnAUploadProperties {
    episodeTitle: string;
    onQuestionsChange?: (questions: Question[]) => void;
}

export interface FormattedQuestion {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export interface UseQnAUploadProperties {
    onQuestionsChange?: (questions: Question[]) => void;
}

export interface SubmittedCreativesTableProperties {
    platform: 'mobile-game' | 'studio-show';
    isActive?: boolean;
}
