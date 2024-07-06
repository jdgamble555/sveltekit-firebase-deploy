import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public";
import { error } from "@sveltejs/kit";
import { FirebaseError, initializeServerApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);


export const firebaseServer = async (request: Request) => {

    const authIdToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!authIdToken) {
        error(401, 'Not Logged In!');
    }

    const serverApp = initializeServerApp(firebase_config, {
        authIdToken
    });

    // auth

    let serverAuth!: Auth;
    try {
        serverAuth = getAuth(serverApp);
        await serverAuth.authStateReady();
    } catch (e) {
        error(401, (e as any).message);
    }

    if (serverAuth.currentUser === null) {
        error(401, 'Invalid Token');
    }

    // db
    const serverDB = getFirestore(serverApp);

    return {
        serverAuth,
        serverDB
    };
};