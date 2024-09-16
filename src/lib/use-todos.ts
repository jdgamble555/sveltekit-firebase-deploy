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
import { useUser } from "./use-user";
import { useFirebase } from "./use-firebase";
import { FirebaseError } from "firebase/app";

export const useGenerateText = () => {

    const { db } = useFirebase();

    // generate text from ID
    const generateText = () => doc(collection(db, 'todos'))
        .id.substring(0, 10).toLowerCase();

    return {
        generateText
    };
};

const todoConverter = {
    toFirestore(value: PartialWithFieldValue<Todo>, options?: SetOptions) {
        const isMerge = options && 'merge' in options;
        return {
            ...value,
            [isMerge ? 'updatedAt' : 'createdAt']: serverTimestamp()
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ) {
        const data = snapshot.data(options);
        const createdAt = data.createdAt as Timestamp;
        return {
            ...data,
            id: snapshot.id,
            createdAt: createdAt.toDate()
        } as Todo;
    }
};

export const useTodos = (
    todos: Todo[] | null = null
) => {

    const { db } = useFirebase();
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
                    orderBy('createdAt')
                ).withConverter<Todo>(todoConverter), (q) => {
                    set(q.empty ? [] : q.docs.map(doc => doc.data({
                        serverTimestamps: 'estimate'
                    })));
                })
        });
};

export const useAddTodo = () => {

    const { db, auth } = useFirebase();

    const addTodo = async (text: string) => {
        const user = auth.currentUser;
        if (!user) {
            throw 'No user!';
        }
        try {
            await setDoc(doc(collection(db, 'todos'))
                .withConverter(todoConverter), {
                uid: user.uid,
                text,
                complete: false
            });
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
                return {
                    error: e.message
                };
            }
        }
    };

    return { addTodo };
};


export const useUpdateTodo = () => {

    const { db } = useFirebase();

    const updateTodo = async (
        id: string,
        newStatus: boolean
    ) => {
        try {
            await setDoc(
                doc(db, 'todos', id),
                { complete: newStatus },
                { merge: true }
            );
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
                return {
                    error: e.message
                };
            }
        }
    };

    return {
        updateTodo
    };
}

export const useDeleteTodo = () => {

    const { db } = useFirebase();

    const deleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'todos', id));
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
                return {
                    error: e.message
                };
            }
        }
    };

    return {
        deleteTodo
    };
}
