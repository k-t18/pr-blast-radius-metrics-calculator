import { useSearchParams } from 'react-router-dom';
import ShareCsrPreview from './components/ShareCsrPreview';
import useCsrShareData from '../hooks/useCsrShareData';
// import ShareMetaTags from '../../../components/common/ShareMetaTags';

function ShareCsrPage() {
    const [urlSearchParameters] = useSearchParams();
    const csrId = urlSearchParameters.get('id') || '';

    const { shareData } = useCsrShareData({
        csrId,
        enabled: !!csrId,
    });

    // Prepare meta tag values - only render meta tags when data is loaded
    if (!shareData) {
        return <ShareCsrPreview />;
    }

    // const title = `CSR Partnership with ${shareData.ngoName} | Chances`;
    // const description = `Proud to partner with ${shareData.ngoName} through Chances to make a difference in ${shareData.focusArea}. Every action counts! 🌍 #CSR #ChancesForChange`;
    // const imageUrl = shareData.imageUrl || '/og-image.png';
    // const imageAlt = `${shareData.ngoName} CSR Certificate`;

    return (
        <>
            {/* <ShareMetaTags
                key={shareData.csrId}
                title={title}
                description={description}
                imageUrl={imageUrl}
                imageAlt={imageAlt}
                url={window.location.href}
            /> */}
            <ShareCsrPreview />
        </>
    );
}

export default ShareCsrPage;
