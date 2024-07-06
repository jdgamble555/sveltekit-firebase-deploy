import { getAbout } from '$lib/about';
import { firebaseServer } from '$lib/firebase-lite';

import type { PageServerLoad } from './$types';

export const load = (async ({ request }) => {

    const { db } = firebaseServer(request);

    return {
        about: await getAbout(db)
    };

}) satisfies PageServerLoad;