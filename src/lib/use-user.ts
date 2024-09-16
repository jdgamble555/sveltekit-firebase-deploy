import {
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signOut,
    type User
} from "firebase/auth";
import { readable, type Subscriber } from "svelte/store";
import { useSharedStore } from "./use-shared";
import { useFirebase } from "./use-firebase";

export const useAuth = () => {

    const { auth } = useFirebase();

    const loginWithGoogle = async () => {
        return await signInWithPopup(
            auth,
            new GoogleAuthProvider()
        );
    };

    const logout = async () => {
        return await signOut(auth);
    };

    return {
        loginWithGoogle,
        logout
    };
};

const _useUser = (defaultUser: UserType | null = null) => {

    const { auth } = useFirebase();

    return readable<UserType | null>(
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
}


export const useUser = (defaultUser: UserType | null = null) =>
    useSharedStore('user', _useUser, defaultUser);