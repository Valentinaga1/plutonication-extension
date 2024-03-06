import QRCode from 'qrcode';

document.addEventListener('DOMContentLoaded', () => {
    generateQRCode();
    setupWalletLinks();
    setupShowMoreWallets();
});

async function generateQRCode() {
    const inputText = 'just testing the qr code for plutonication extension ust testing the qr code for plutonication extensionust testing the qr code for plutonication extension'; 

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

function setupWalletLinks() {
    const walletLinks = document.querySelectorAll('#wallets a');

    walletLinks.forEach(walletLink => {
        walletLink.addEventListener('click', event => {
            event.preventDefault();

            const walletUrl = walletLink.getAttribute('href');
            showWalletUrl(walletUrl as string);
            hideQRCode();
        });
    });
}


function setupShowMoreWallets() {
    const showMoreWalletsButton = document.getElementById('showMoreWallets');
    const additionalWallets = document.querySelectorAll('.plutonication__wallets-content a:nth-child(n+4)');

    additionalWallets.forEach(wallet => {
        const walletElement = wallet as HTMLElement;
        walletElement.style.display = 'none';
    });

    if (showMoreWalletsButton) {
        showMoreWalletsButton.addEventListener('click', event => {
            event.preventDefault();

            additionalWallets.forEach(wallet => {
                const walletElement = wallet as HTMLElement;
                walletElement.style.display = walletElement.style.display === 'none' ? 'block' : 'none';
            });

            showMoreWalletsButton.style.display = 'none';
        });
    }
}





function showWalletUrl(url: string) {
    const walletsContainer = document.getElementById('wallets');
    if (walletsContainer) {
        walletsContainer.innerHTML = `<p>Wallet URL: ${url}</p>`;
    }
}

function hideQRCode() {
    const qrCodeContainer = document.getElementById('qr-code');
    if (qrCodeContainer) {
        qrCodeContainer.style.display = 'none';
    }
}
