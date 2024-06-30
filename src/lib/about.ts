import {
    doc,
    getDoc,
    type Firestore
} from "firebase/firestore/lite";

type AboutDoc = {
    name: string;
    description: string;
};

export const getAbout = async (db: Firestore) => {

    const aboutSnap = await getDoc(
        doc(db, '/about/ZlNJrKd6LcATycPRmBPA')
    );

    if (!aboutSnap.exists()) {
        throw 'Document does not exist!';
    }

    return aboutSnap.data() as AboutDoc;
};