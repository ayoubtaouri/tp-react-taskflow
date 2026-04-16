import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from '../../store';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import styles from './Login.module.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user, loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        dispatch(loginStart());

        try {
            const res = await fetch(`http://localhost:4000/users?email=${email}`);
            const users = await res.json();

            if (!users || users.length === 0 || users[0].password !== password) {
                dispatch(loginFailure('Email ou mot de passe incorrect'));
                return;
            }

            const { password: _, ...userWithoutPassword } = users[0];

            const fakeToken = btoa(
                JSON.stringify({
                    userId: userWithoutPassword.id,
                    email: userWithoutPassword.email,
                    role: 'admin',
                    exp: Date.now() + 3600000
                })
            );

            dispatch(
                loginSuccess({
                    user: userWithoutPassword,
                    token: fakeToken
                })
            );

        } catch (error) {
            dispatch(loginFailure('Erreur de connexion au serveur'));
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>TaskFlow</h1>
                <p className={styles.subtitle}>Connectez-vous pour continuer</p>

                {error && <div className={styles.error}>{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />

                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}