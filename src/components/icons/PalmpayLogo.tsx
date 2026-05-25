/**
 * Palmpay Logo Component
 * Uses the official Palmpay PNG logo from assets
 */

import palmPay from '../../assets/images/PalmPay.png';

function PalmpayLogo({ size = 24 }: { size?: number }) {
    return (
        <div>
            <img src={palmPay} alt="Palmpay" height={size} style={{ display: 'block', width: '120px' }} />
        </div>
    );
}

export default PalmpayLogo;
