import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import '../../styles/safeHtmlRenderer.css';

interface SafeHtmlRendererProperties {
    /** The HTML string to render safely */
    html: string;
    /** Optional CSS class name for the container */
    className?: string;
}

/**
 * DOMPurify configuration for safe HTML rendering
 * Allows common formatting tags including Quill editor output
 */
const purifyConfig = {
    ALLOWED_TAGS: [
        'p',
        'br',
        'b',
        'i',
        'u',
        'strong',
        'em',
        'span',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'blockquote',
        'pre',
        'code',
        'hr',
        'sub',
        'sup',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan', 'contenteditable'],
    ALLOW_DATA_ATTR: true,
};

/**
 * A secure HTML renderer component that sanitizes HTML content
 * using DOMPurify and parses it using html-react-parser.
 *
 * Supports Quill editor HTML output with proper heading and list rendering.
 *
 * @example
 * <SafeHtmlRenderer html={apiContent} className="my-custom-class" />
 */
function SafeHtmlRenderer({ html, className }: SafeHtmlRendererProperties): React.ReactNode {
    if (!html || html.trim() === '') {
        return null;
    }

    // Sanitize HTML with our config that allows h1-h6 and Quill attributes
    const cleanHTML = DOMPurify.sanitize(html, purifyConfig) as string;

    return <div className={`safe-html-content ${className ?? ''}`}>{parse(cleanHTML)}</div>;
}

export default SafeHtmlRenderer;
