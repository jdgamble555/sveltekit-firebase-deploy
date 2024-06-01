/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, getFirestore } from "firebase/firestore/lite";
//import { initializeServerApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public";

type AboutDoc = {
    name: string;
    description: string;
};

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);


export const getAbout = async (id: string) => {

    const serverApp = initializeApp(firebase_config);

    const db = getFirestore(serverApp);

    const aboutSnap = await getDoc(
        doc(db, '/about/ZlNJrKd6LcATycPRmBPA')
    );

    if (!aboutSnap.exists()) {
        throw 'Document does not exist!';
    }

    return aboutSnap.data() as AboutDoc;
};