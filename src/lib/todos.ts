import {
    QuerySnapshot,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
    type DocumentData
} from "firebase/firestore";

import { derived, type Readable } from "svelte/store";
import { db } from "./firebase";

export const genText = () => Math.random().toString(36).substring(2, 15);

export const snapToData = (q: QuerySnapshot<DocumentData, DocumentData>) => {

    // creates todo data from snapshot
    if (q.empty) {
        return [];
    }
    return q.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            created: new Date(data['created']?.toMillis()),
            id: doc.id
        }
    }) as Todo[];
}


export const useTodos = (
    user: Readable<UserType | null>,
    todos: Todo[] | null = null
) => {

    // filtering todos depend on user
    return derived<Readable<UserType | null>, Todo[] | null>(
        user, ($user, set) => {
            if (!$user) {
                set(null);
                return;
            }

            // set default value
            set(todos);

            return onSnapshot(
                query(
                    collection(db, 'todos'),
                    where('uid', '==', $user.uid),
                    orderBy('created')
                ), (q) => set(snapToData(q)))
        });
};

export const addTodo = async (text: string, uid: string) => {

    setDoc(doc(collection(db, 'todos')), {
        uid,
        text,
        complete: false,
        created: serverTimestamp()
    });
}

export const updateTodo = (id: string, newStatus: boolean) => {
    updateDoc(doc(db, 'todos', id), { complete: newStatus });
}

export const deleteTodo = (id: string) => {
    deleteDoc(doc(db, 'todos', id));
}
