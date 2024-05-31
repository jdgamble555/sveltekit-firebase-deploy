import { doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { app } from "./firebase";
import { getAuth } from "firebase/auth";

type AboutDoc = {
    name: string;
    description: string;
};

export const getAbout = async () => {

    const auth = getAuth(app);

    const db = getFirestore(app);

    const aboutSnap = await getDoc(
        doc(db, '/about/ZlNJrKd6LcATycPRmBPA')
    );

    if (!aboutSnap.exists()) {
        throw 'Document does not exist!';
    }

    return aboutSnap.data() as AboutDoc;
};