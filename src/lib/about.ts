/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { initializeServerApp } from "firebase/app";
import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public";

type AboutDoc = {
    name: string;
    description: string;
};

declare let self: any;

if (typeof self === 'undefined') {
    // Fallback for environments where self is not defined
    self = {};
}

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);

export const getAbout = async (id: string) => {

    const serverApp = initializeServerApp(firebase_config, {
        authIdToken: id
    });

    const db = getFirestore(serverApp);

    const aboutSnap = await getDoc(
        doc(db, '/about/ZlNJrKd6LcATycPRmBPA')
    );

    if (!aboutSnap.exists()) {
        throw 'Document does not exist!';
    }

    return aboutSnap.data() as AboutDoc;
};