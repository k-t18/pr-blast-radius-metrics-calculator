export function openInNewTab(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Downloads a certificate with authentication
 * @param certificateUrl - The URL of the certificate to download
 */
export async function downloadCertificateWithAuth(certificateUrl: string): Promise<void> {
    if (!certificateUrl) {
        openInNewTab(certificateUrl);
        return;
    }

    try {
        const response = await fetch(certificateUrl, {
            method: 'GET',
            headers: { Accept: 'application/pdf' },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to download certificate');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        openInNewTab(blobUrl);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);
    } catch {
        openInNewTab(certificateUrl);
    }
}

/**
 * Downloads an image (view in new tab)
 * @param imageUrl - The URL of the image to download
 */
export async function downloadImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
        return;
    }

    try {
        const response = await fetch(imageUrl, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            openInNewTab(imageUrl);
            return;
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        openInNewTab(blobUrl);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);
    } catch {
        openInNewTab(imageUrl);
    }
}
