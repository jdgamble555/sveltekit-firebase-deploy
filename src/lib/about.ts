/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { initializeServerApp } from "firebase/app";
import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public";

type AboutDoc = {
    name: string;
    description: string;
};

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);


export const getAbout = async (id: string) => {

    if (typeof self === 'object' && self.self === self) {
        // @ts-expect-error - cloudflare
        self.self = { ...self, add: true };
    }

    const serverApp = initializeServerApp(firebase_config, {
        authIdToken: id
    });

    if (typeof self !== 'undefined') {
        self.self = self;
    }

    const db = getFirestore(serverApp);

    const aboutSnap = await getDoc(
        doc(db, '/about/ZlNJrKd6LcATycPRmBPA')
    );

    if (!aboutSnap.exists()) {
        throw 'Document does not exist!';
    }

    return aboutSnap.data() as AboutDoc;
};