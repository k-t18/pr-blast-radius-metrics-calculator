export interface NGOPartnershipItem {
    ngo_name: string;
    csr_amount: number;
    episode: string | null;
    name: string;
    focus_area: string | null;
    paid_amount: number;
    status: string;
    certificate: string;
    image?: string | null;
    /** Image URL for the certificate (PNG format) */
    certificate_image?: string | null;
    'focus_area '?: string | null;
}

/**
 * Simplified share data for CSR certificates
 * Used for public share pages
 */
export interface CsrShareData {
    csrId: string;
    ngoName: string;
    focusArea: string;
    imageUrl: string;
    certificateUrl?: string;
    companyName?: string;
    episode?: string;
    csrAmount?: number;
    status?: string;
}
