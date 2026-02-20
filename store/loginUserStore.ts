import {create} from 'zustand';
import { Profile } from "@/types";


type LoginUserStore = {
    user: Profile | null;
    setUser: (user: Profile | null) => void;
    clearUser: () => void;

    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

export const userLoginStore = create<LoginUserStore> ((set) => ({
    user: null,
    isLoading: false,
    setUser: (user: Profile | null) => set({user}),
    clearUser: () => set({user: null}),

    setLoading: ((loading: boolean) => set({isLoading: loading})),


}));