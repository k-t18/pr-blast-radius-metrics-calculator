import { useState } from 'react';
import { downloadCertificateWithAuth } from '../utils/certificateDownload';

const useDownloadDocuments = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [documentError, setDocumentError] = useState<string | null>(null);

    const handleDownloadDocument = async (documentUrl: string): Promise<void> => {
        if (!documentUrl) return;

        setIsDownloading(true);
        setDocumentError(null);
        try {
            await downloadCertificateWithAuth(documentUrl);
        } catch (error) {
            setDocumentError(error instanceof Error ? error.message : 'Failed to download document');
            throw error; // Re-throw so caller knows it failed
        } finally {
            setIsDownloading(false);
        }
    };
    return {
        isDownloading,
        handleDownloadDocument,
        documentError,
    };
};

export default useDownloadDocuments;
