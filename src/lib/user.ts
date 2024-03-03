import {
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signOut,
    type User
} from "firebase/auth";
import { readable, type Subscriber } from "svelte/store";
import { auth } from "./firebase";
import { useSharedStore } from "./use-shared";

export async function loginWithGoogle() {
    return await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function logout() {
    return await signOut(auth);
}

const user = (defaultUser: UserType | null = null) => readable<UserType | null>(
    defaultUser,
    (set: Subscriber<UserType | null>) => {
        return onIdTokenChanged(auth, (_user: User | null) => {
            if (!_user) {
                set(null);
                return;
            }
            const { displayName, photoURL, uid, email } = _user;
            set({ displayName, photoURL, uid, email });
        });
    }
);

export const useUser = (defaultUser: UserType | null = null) => useSharedStore('user', user, defaultUser);