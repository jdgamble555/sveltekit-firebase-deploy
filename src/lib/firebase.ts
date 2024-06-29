import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { getApp, getApps, initializeApp, initializeServerApp } from 'firebase/app';
import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);

// client setup

export const app = getApps().length
    ? getApp()
    : initializeApp(firebase_config);

export const auth = getAuth();
export const db = getFirestore();

// server setup

export const firebaseServer = (request: Request) => {

    const authIdToken = request.headers.get('Authorization')?.split('Bearer ')[1] || '';

    console.log(request.headers.get('Authorization'));

    if (!authIdToken) {
        error(401, 'Not Logged In!');
    }

    const serverApp = initializeServerApp(firebase_config, {
        authIdToken,
        //releaseOnDeref: request
    });

    const db = getFirestore(serverApp);

    return {
        db
    };
};

// service worker setup

export const getIdTokenPromise = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (!user) {
                return resolve(null);
            }
            try {
                const idToken = await getIdToken(user);
                console.log(idToken);
                resolve(idToken);
            } catch (e) {
                reject(e);
            }
        }, reject);
    });
};
