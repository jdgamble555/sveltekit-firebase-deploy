import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public";
import { error } from "@sveltejs/kit";
import { initializeServerApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);


export const firebaseServer = (request: Request) => {

    const authIdToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!authIdToken) {
        error(401, 'Not Logged In!');
    }

    const serverApp = initializeServerApp(firebase_config, {
        authIdToken
    });

    const db = getFirestore(serverApp);

    return {
        db
    };
};