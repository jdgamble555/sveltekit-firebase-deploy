import { getAbout } from '$lib/about';
import { firebaseServer } from '$lib/firebase-lite';

import type { PageServerLoad } from './$types';

export const load = (async ({ request }) => {

    const { serverDB } = await firebaseServer(request);

    return {
        about: await getAbout(serverDB)
    };

}) satisfies PageServerLoad;