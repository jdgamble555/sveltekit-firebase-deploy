import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);

// initialize and login

export const app = getApps().length
    ? getApp()
    : initializeApp(firebase_config);

export const auth = getAuth();
export const db = getFirestore();

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
