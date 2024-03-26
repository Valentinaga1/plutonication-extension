import QRCode from 'qrcode';
import '@polkadot/extension-inject/crossenv';

import type { RequestSignatures, TransportRequestMessage } from '@polkadot/extension-base/background/types';

import { injectExtension } from '@polkadot/extension-inject';
import type { Injected } from '@polkadot/extension-inject/types';
import type { Message } from '@polkadot/extension-base/types';
import { MESSAGE_ORIGIN_CONTENT } from '@polkadot/extension-base/defaults';
import { handleResponse, redirectIfPhishing } from '@polkadot/extension-base/page';

import { AccessCredentials, initializePlutonicationDAppClient } from "@plutonication/plutonication";
import { packageInfo } from '@polkadot/util';

declare global {
    interface Window {
        downloadWallet: (platform: string,  downloadLinks: { android: string; ios: string; }) => void;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateQRCode('plutonication:?url=wss%3A%2F%2Fplutonication-acnha.ondigitalocean.app%2F&key=1710194226878&name=Plutonication%20test&icon=https%3A%2F%2Frostislavlitovkin.pythonanywhere.com%2Fplutowalleticonwhite');
    setupWalletLinks();
    setupShowMoreWallets();
    inject();
});

async function generateQRCode(inputText: string) {
    // const inputText = 'plutonication:?url=wss%3A%2F%2Fplutonication-acnha.ondigitalocean.app%2F&key=1710194226878&name=Plutonication%20test&icon=https%3A%2F%2Frostislavlitovkin.pythonanywhere.com%2Fplutowalleticonwhite'; 
    console.log("Generating QR Code");
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
    const walletLinks = document.querySelectorAll('.plutonication__wallets-item');

    walletLinks.forEach(walletLink => {
        walletLink.addEventListener('click', event => {
            event.preventDefault();

            const walletUrl = walletLink.getAttribute('href');
            const walletNameElement = walletLink.querySelector('.plutonication__wallets-item-description')?.textContent;

            let downloadLinks: { android: string; ios: string; } = { android: '', ios: '' };

            if (walletUrl === 'me.rainbow') {
                downloadLinks = {
                    android: 'https://play.google.com/store/apps/details?id=me.rainbow',
                    ios: 'https://apps.apple.com/us/app/rainbow-bitcoin-wallet/id1441806765'
                };
            } else if (walletUrl === 'io.metamask') {
                downloadLinks = {
                    android: 'https://play.google.com/store/apps/details?id=io.metamask',
                    ios: 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202'
                };
            } else if (walletUrl === 'com.wallet.crypto.trustapp') {
                downloadLinks = {
                    android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
                    ios: 'https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/id1288339409'
                };
            }

            showWalletUrl(walletUrl as string, walletNameElement as string, downloadLinks);
            hideQRCode();
        });
    });
}


function setupShowMoreWallets() {
    const showMoreWalletsButton = document.getElementById('showMoreWallets');
    const additionalWallets = document.querySelectorAll('.plutonication__wallets-content div:nth-child(n+5)');
    console.log("additionalWallets", additionalWallets);
    console.log("showMoreWalletsButton", showMoreWalletsButton);
    additionalWallets.forEach(wallet => {
        const walletElement = wallet as HTMLElement;
        walletElement.style.display = 'none';
    });

    if (showMoreWalletsButton) {
        console.log("MOSTRANDO WALLETS");
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

let originalWalletsContent = '';

function showWalletUrl(url: string, walletNameElement: string, downloadLinks: { android: string, ios: string }) {
    console.log("downloadLinks", downloadLinks);
    const walletContainer = document.getElementById('wallets');
    const qrContainer = document.getElementById('qr-code');
    const walletTitle = document.querySelector('.plutonication__qr-title') as HTMLElement;

    if (qrContainer) qrContainer.style.display = 'none';
    if (walletTitle) walletTitle.textContent = `${walletNameElement}`;

    if (!originalWalletsContent && walletContainer) {
        originalWalletsContent = walletContainer.innerHTML;
    }


    const closeButtonSpan = document.createElement('span');
    closeButtonSpan.classList.add('back-button-img');
    closeButtonSpan.innerHTML = '&times;';
    
    const closeButtonContainer = document.createElement('div');
    walletTitle?.parentNode?.insertBefore(closeButtonContainer, walletTitle?.nextSibling); 
    closeButtonContainer.appendChild(walletTitle);
    closeButtonContainer.appendChild(closeButtonSpan); 


    closeButtonSpan.addEventListener('click', () => {
        if (qrContainer) qrContainer.style.display = 'block';
        if (walletTitle) walletTitle.textContent = 'Plutonication';
        if (walletContainer) {
            walletContainer.innerHTML = originalWalletsContent;
            originalWalletsContent = '';
            setupWalletLinks();
            setupShowMoreWallets();
        }
        closeButtonSpan.remove();
        generateQRCode('plutonication:?url=wss%3A%2F%2Fplutonication-acnha.ondigitalocean.app%2F&key=1710194226878&name=Plutonication%20test&icon=https%3A%2F%2Frostislavlitovkin.pythonanywhere.com%2Fplutowalleticonwhite');
    });

    const newContent = `
        <div class="plutonication__wallets-btn-container">
            <button data-platform="android" class="plutonication__wallets-btn-download">
                <div class="plutonication__wallets-btn-content">
                    <img src="images/google-play.svg" alt="google" width="30" height="30"/>
                    <div>
                        <p class="plutonication__wallets-btn-p1">Get in on</p>
                        <p class="plutonication__wallets-btn-p2">Google Play</p>
                    </div>
                </div>
            </button>
            <button data-platform="ios" class="plutonication__wallets-btn-download"> 
                <div class="plutonication__wallets-btn-content">
                    <img src="images/apple-icon.svg" alt="apple" width="30" height="30"/>
                    <div>
                        <p class="plutonication__wallets-btn-p1">Download on the</p>
                        <p class="plutonication__wallets-btn-p2">App Store</p>
                    </div>
                </div>
            </button>
        </div>
    `;

    if (walletContainer) {
        walletContainer.innerHTML = newContent;
        const walletButtons = document.querySelectorAll('.plutonication__wallets-btn-download');
        walletButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const platform = button.getAttribute('data-platform');
                if (platform === 'android') {
                    downloadWallet('android', downloadLinks);
                } else if (platform === 'ios') {
                    downloadWallet('ios', downloadLinks);
                }
            });
        });
    };
}


window.addEventListener('popstate', function (event) {
    const walletContainer = document.getElementById('wallets');
    if (walletContainer) {
        walletContainer.innerHTML = originalWalletsContent;
        originalWalletsContent = '';
        setupWalletLinks();
        setupShowMoreWallets();
    }
});


function downloadWallet(platform: string,  downloadLinks: { android: string; ios: string; }) {
// window.downloadWallet = function(platform: string,  downloadLinks: { android: string; ios: string; }) {
    console.log("downloadLinks from downaloadWallet", downloadLinks.android);
    let storeLink = '';
    if (platform === 'android') {
        storeLink = downloadLinks.android;
    } else if (platform === 'ios') {
        storeLink = downloadLinks.ios;
    }

    generateQRCode(storeLink);

    // window.location.href = storeLink;

    const walletContainer = document.getElementById('wallets');
    if (walletContainer) {
        walletContainer.innerHTML = '';
    }
    
    const qrContainer = document.getElementById('qr-code');
    if (qrContainer) {
        qrContainer.style.display = 'block';
    }

    // const additionalInfo = document.getElementById('additional-info');
    // if (additionalInfo) {
    //     additionalInfo.style.display = 'block';
    // }
}
function hideQRCode() {
    const qrCodeContainer = document.getElementById('qr-code');
    if (qrCodeContainer) {
        qrCodeContainer.style.display = 'none';
    }
}

function inject() {
    injectExtension(enable, {
      name: 'polkadot-js',
      version: packageInfo.version
    });
  }

export async function enable(origin: string): Promise<Injected> {
    console.log("initiation enable functionality");
    let publicKey="";
    const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",

    "Plutonication test",

    "https://rostislavlitovkin.pythonanywhere.com/plutowalleticonwhite",
    );
    console.log("accessCredentials:", accessCredentials.ToUri());
    
    const client = await initializePlutonicationDAppClient(
    accessCredentials,
    (receivedPubkey: string) => {
        publicKey = receivedPubkey;
        console.log("receivedPubkey", receivedPubkey);
    }
    );
    console.log("injected", client);

    const roomKey = Date.now().toString();
    const plutonicationUrl = "wss://plutonication-acnha.ondigitalocean.app"
    
    window.postMessage({
    response: "OPEN_POPUP",
    roomKey,
    origin,
    plutonicationUrl
    }, "*");

    return client;

};

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }: Message): void => {
// only allow messages from our window, by the loader
if (source !== window || data.origin !== MESSAGE_ORIGIN_CONTENT) {
    return;
}

if (data.id) {
    handleResponse(data as TransportRequestMessage<keyof RequestSignatures>);
} else {
    console.error('Missing id for response.');
}
});

redirectIfPhishing().then((gotRedirected) => {
if (!gotRedirected) {
    inject();
}
}).catch((e) => {
console.warn(`Unable to determine if the site is in the phishing list: ${(e as Error).message}`);
inject();
});

