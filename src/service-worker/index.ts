/// <reference lib="webworker" />

import {  requestProcessor } from "./utils";

/*
self.addEventListener('activate', () => {
    (self as unknown as ServiceWorkerGlobalScope).clients.claim()
});
*/

self.addEventListener('fetch', (event) => {

    const evt = event as FetchEvent;

    evt.respondWith(requestProcessor(evt));
});
