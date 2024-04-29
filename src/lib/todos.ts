import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    QueryDocumentSnapshot,
    type SnapshotOptions,
    Timestamp,
    type PartialWithFieldValue,
    type SetOptions
} from "firebase/firestore";

import { derived, type Readable } from "svelte/store";
import { auth, db } from "./firebase";
import { useUser } from "./user";

export const genText = () => Math.random().toString(36).substring(2, 15);

const todoConverter = {
    toFirestore(value: PartialWithFieldValue<Todo>, options?: SetOptions) {
        const isMerge = options && 'merge' in options;
        if (!auth.currentUser) {
            throw 'User not logged in!';
        }
        return {
            ...value,
            uid: auth.currentUser.uid,
            [isMerge ? 'updated' : 'created']: serverTimestamp()
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ) {
        const data = snapshot.data(options);
        const created = data.created as Timestamp;
        return {
            ...data,
            id: snapshot.id,
            created: created.toDate()
        } as Todo;
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
                    set(q.empty ? [] : q.docs.map(doc => doc.data({
                        serverTimestamps: 'estimate'
                    })));
                })
        });
};

export const addTodo = async (text: string) => {

    setDoc(doc(collection(db, 'todos')).withConverter(todoConverter), {
        text,
        complete: false
    });
}

export const updateTodo = (id: string, newStatus: boolean) => {

    setDoc(
        doc(db, 'todos', id),
        { complete: newStatus },
        { merge: true }
    );
}

export const deleteTodo = (id: string) => {
    deleteDoc(doc(db, 'todos', id));
}
