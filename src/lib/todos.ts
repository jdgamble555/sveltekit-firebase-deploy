import {
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
    type WithFieldValue,
    QueryDocumentSnapshot,
    type SnapshotOptions
} from "firebase/firestore";

import { derived, type Readable } from "svelte/store";
import { auth, db } from "./firebase";
import { useUser } from "./user";

export const genText = () => Math.random().toString(36).substring(2, 15);

const todoConverter = {
    toFirestore(value: WithFieldValue<Partial<Todo>>) {
        if (!auth.currentUser) {
            throw 'User not logged in!';
        }
        return {
            ...value,
            uid: auth.currentUser.uid,
            created: serverTimestamp()
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            uid: data.uid,
            complete: data.complete,
            text: data.text,
            created: data.createdAt?.toMillis()
        };
    }
};

export const useTodos = (
    todos: Todo[] | null = null
) => {

    const user = useUser();

    // filtering todos depend on user
    return derived<
        Readable<UserType | null>,
        Todo[] | null
    >(
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
                ).withConverter<Todo>(todoConverter), (q) => {
                    set(q.empty ? [] : q.docs.map(doc => doc.data()));
                })
        });
};

export const addTodo = async (text: string) => {

    setDoc(doc(collection(db, 'todos'))
        .withConverter(todoConverter), {
        text,
        complete: false
    });
}

export const updateTodo = (id: string, newStatus: boolean) => {
    updateDoc(doc(db, 'todos', id), { complete: newStatus });
}

export const deleteTodo = (id: string) => {
    deleteDoc(doc(db, 'todos', id));
}
