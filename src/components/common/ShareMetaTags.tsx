// import { Helmet } from 'react-helmet-async';

// interface ShareMetaTagsProperties {
//     title: string | React.ReactNode;
//     description: string | React.ReactNode;
//     imageUrl: string | React.ReactNode;
//     imageAlt?: string | React.ReactNode;
//     url?: string | React.ReactNode;
//     type?: string | React.ReactNode;
//     siteName?: string | React.ReactNode;
//     twitterCard?: string | React.ReactNode;
//     twitterSite?: string | React.ReactNode;
//     imageWidth?: string | React.ReactNode;
//     imageHeight?: string | React.ReactNode;
// }

// function ShareMetaTags({
//     title,
//     description,
//     imageUrl,
//     imageAlt,
//     url,
//     type = 'article',
//     siteName = 'Chances',
//     twitterCard = 'summary_large_image',
//     twitterSite = '@ChancesOfficial',
//     imageWidth = '1200',
//     imageHeight = '630',
// }: ShareMetaTagsProperties) {
//     const currentUrl = typeof url === 'string' ? url : typeof window !== 'undefined' ? window.location.href : '';

//     const toContentString = (value: string | React.ReactNode | undefined, fallback = '') => {
//         if (typeof value === 'string') return value;
//         if (value === null || value === undefined) return fallback;
//         return String(value);
//     };

//     const safeTitle = toContentString(title, '');
//     const safeDescription = toContentString(description, '');
//     const safeImageAlt = toContentString(imageAlt, '');
//     const safeImageUrl = toContentString(imageUrl, '');
//     const safeType = toContentString(type, 'article');
//     const safeSiteName = toContentString(siteName, 'Chances');
//     const safeTwitterCard = toContentString(twitterCard, 'summary_large_image');
//     const safeTwitterSite = toContentString(twitterSite, '@ChancesOfficial');
//     const safeImageWidth = toContentString(imageWidth, '1200');
//     const safeImageHeight = toContentString(imageHeight, '630');

//     // Ensure imageUrl is a valid absolute URL using regex pattern
//     const absoluteImageUrl = /^https?:\/\//i.test(safeImageUrl)
//         ? safeImageUrl
//         : safeImageUrl.startsWith('/')
//           ? `${typeof window !== 'undefined' ? window.location.origin : ''}${safeImageUrl}`
//           : safeImageUrl;

//     return (
//         // @ts-expect-error - react-helmet-async type compatibility with React 19
//         <Helmet prioritizeSeoTags>
//             <title>{safeTitle}</title>
//             <meta name="description" content={safeDescription} />
//             <meta property="og:title" content={safeTitle} />
//             <meta property="og:description" content={safeDescription} />
//             <meta property="og:image" content={absoluteImageUrl} />
//             <meta property="og:image:width" content={safeImageWidth} />
//             <meta property="og:image:height" content={safeImageHeight} />
//             {safeImageAlt && <meta property="og:image:alt" content={safeImageAlt} />}
//             <meta property="og:url" content={currentUrl} />
//             <meta property="og:type" content={safeType} />
//             <meta property="og:site_name" content={safeSiteName} />
//             <meta name="twitter:card" content={safeTwitterCard} />
//             <meta name="twitter:site" content={safeTwitterSite} />
//             <meta name="twitter:title" content={safeTitle} />
//             <meta name="twitter:description" content={safeDescription} />
//             <meta name="twitter:image" content={absoluteImageUrl} />
//         </Helmet>
//     );
// }

// export default ShareMetaTags;
