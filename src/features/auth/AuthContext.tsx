import {createContext, useContext, useReducer, type ReactNode, useEffect} from 'react';
import { authReducer, initialState, type AuthState, type AuthAction } from './authReducer.ts';
import {setAuthToken} from "../../API/axios.ts";

interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    useEffect(() => {
        setAuthToken(state.token);
    }, [state.token]);
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook pour consommer le context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
}