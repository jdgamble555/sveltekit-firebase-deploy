import { getAbout } from '$lib/about';
import { firebaseServer } from '$lib/firebase';
import type { PageServerLoad } from './$types';

export const load = (async ({ request }) => {
    
    const { db } = firebaseServer(request);

    return {
        about: await getAbout(db)
    };

}) satisfies PageServerLoad;