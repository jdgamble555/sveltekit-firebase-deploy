import { getAbout } from '$lib/about';
import type { PageServerLoad } from './$types';

export const load = (async ({ request }) => {

    const authIdToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    console.log(JSON.stringify({ token: authIdToken }));

    if (!authIdToken) {
        return {
            about: {}
        };
    }

    return {
        about: await getAbout(authIdToken)
    };

}) satisfies PageServerLoad;