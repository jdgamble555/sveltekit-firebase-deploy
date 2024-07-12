import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public";
import { error } from "@sveltejs/kit";
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
    const serverAuth = getAuth(serverApp);
    //await serverAuth.authStateReady();

    console.log(serverApp.settings.authIdToken)

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