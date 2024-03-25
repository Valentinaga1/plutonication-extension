// // lógica de la extensión que se ejecuta en segundo plano, como la comunicación con el servidor Plutonication y la gestión de eventos globales
// // lógica de fondo de la extensión y la comunicación con el servidor remoto
import '@polkadot/extension-inject/crossenv';

import type { RequestSignatures, TransportRequestMessage } from '@polkadot/extension-base/background/types';

import { handlers, withErrorLog } from '@polkadot/extension-base/background';
import { PORT_CONTENT, PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { AccountsStore } from '@polkadot/extension-base/stores';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import type { SignerResult } from "@polkadot/api/types/index.js"
import { injectExtension } from '@polkadot/extension-inject';
import { HexString } from '@polkadot/util/types';
import type { Injected, InjectedAccount, Unsubcall } from '@polkadot/extension-inject/types';import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import type { Message } from '@polkadot/extension-base/types';
import { MESSAGE_ORIGIN_CONTENT } from '@polkadot/extension-base/defaults';
import { handleResponse, redirectIfPhishing } from '@polkadot/extension-base/page';
import { io } from "socket.io-client"

import { AccessCredentials, initializePlutonicationDAppClient } from "@plutonication/plutonication";
// Método para inyectar la extensión en la página
function inject() {
  injectExtension(enable, {
    name: 'polkadot-js',
    version: "1"
  });
}

// Método para habilitar la extensión
async function enable(origin: string): Promise<Injected> {
    // Instanciar el cliente de la aplicación DApp de Plutonication
    let publicKey="";
    const accessCredentials = new AccessCredentials(
      // Address of Plutonication server
      // Feel free to use this one
      // Learn more: https://plutonication-acnha.ondigitalocean.app/docs/javascript
      "wss://plutonication-acnha.ondigitalocean.app/",

      // dApp name
      "Plutonication test",

      // dApp icon
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

    // set new roomKey
    const roomKey = Date.now().toString();
    const plutonicationUrl = "wss://plutonication-acnha.ondigitalocean.app"
    
    window.postMessage({
      response: "OPEN_POPUP",
      roomKey,
      origin,
      plutonicationUrl
      // other data properties...
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


