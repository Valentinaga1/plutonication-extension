import QRCode from 'qrcode';

document.addEventListener('DOMContentLoaded', generateQRCode);

async function generateQRCode() {
    const inputText = 'just testing!'; 

    const qrCodeContainer = document.getElementById('qr-code');

    try {
        const qrCodeDataURL = await QRCode.toDataURL(inputText);
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = qrCodeDataURL;
        if (qrCodeContainer) {
            qrCodeContainer.innerHTML = '';
            qrCodeContainer.appendChild(qrCodeImage);
        }
    } catch (error) {
        console.error('Something went wrong generating the QR code:', error);
    }
}

