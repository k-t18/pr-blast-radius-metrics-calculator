/**
 * Paystack Logo Component
 * Uses the official Paystack SVG logo from assets
 */

import payStack from '../../assets/icons/Paystack.svg';

function PaystackLogo({ size = 24 }: { size?: number }) {
    // Calculate width based on aspect ratio (280.6:50)
    const aspectRatio = 280.6 / 50;
    const width = size * aspectRatio;
    const height = size;

    return <img src={payStack} alt="Paystack" width={width} height={height} style={{ display: 'block' }} />;
}

export default PaystackLogo;
