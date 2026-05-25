export const TABS: { label: string; value: string }[] = [
    { label: 'Mobile Game', value: 'mobile_game' },
    { label: 'Studio Show', value: 'studio_show' },
];

export type SponsorshipType = (typeof TABS)[number]['value'];

export interface DashboardTabContentProperties {
    periodData: { label: string; numeric_days: number }[];
    selectedDateFormat?: number;
    onPeriodChange: (value: number | undefined) => void;
    sponsorshipType: SponsorshipType;
    isPeriodReady: boolean;
}
