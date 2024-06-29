/// <reference lib="webworker" />

import { getBodyContent, getOriginFromUrl } from "./utils";
import { getIdTokenPromise } from "$lib/firebase";

self.addEventListener('fetch', async (event) => {

    const evt = event as FetchEvent;

    const requestProcessor = async (idToken: string | null): Promise<Response> => {

        let req = evt.request;

        if (
            self.location.origin === getOriginFromUrl(evt.request.url) &&
            (self.location.protocol === 'https:' || self.location.hostname === 'localhost') &&
            idToken
        ) {
            const headers = new Headers(req.headers);
            headers.append('Authorization', 'Bearer ' + idToken);
            const body = await getBodyContent(req);

            try {
                req = new Request(req.url, {
                    method: req.method,
                    headers: headers,
                    mode: 'same-origin',
                    credentials: req.credentials,
                    cache: req.cache,
                    redirect: req.redirect,
                    referrer: req.referrer,
                    body,
                });
            } catch {
                // This will fail for CORS requests. We just continue with the fetch logic without passing the ID token.
            }
        }

        return fetch(req);
    };

    evt.respondWith(getIdTokenPromise().then(requestProcessor, requestProcessor));
});
