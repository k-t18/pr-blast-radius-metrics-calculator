/**
 * Terms and Condition item interface
 */
export interface TermsAndConditionItem {
    /** Document name/title (e.g., "Privacy Policy - Sponsor Portal") */
    name: string;
    /** HTML content of the terms */
    terms: string;
}

/**
 * Array of Terms and Condition items
 */
export type TermsAndConditionList = TermsAndConditionItem[];
