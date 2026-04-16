import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from './AuthContext';

export default function LoginMUI() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, dispatch } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (state.user) {
            navigate(from, { replace: true });
        }
    }, [state.user, navigate, from]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatch({ type: 'LOGIN_START' });

        try {
            const res = await fetch(`http://localhost:4000/users?email=${email}`);
            const users = await res.json();

            if (users.length === 0 || users[0].password !== password) {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: 'Email ou mot de passe incorrect'
                });
                return;
            }

            const { password: _, ...userWithoutPassword } = users[0];
            dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });

        } catch (error) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: 'Erreur de connexion au serveur'
            });
        }
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f0f0f0' }}>
            <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
                    <Typography variant="h4" align="center" sx={{ color: '#1B8C3E', fontWeight: 700 }}>
                        TaskFlow
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary">
                        Connectez-vous pour continuer
                    </Typography>

                    {state.error && <Alert severity="error">{state.error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={state.loading}
                            sx={{ bgcolor: '#1B8C3E', py: 1.5, '&:hover': { bgcolor: '#157a33' } }}
                        >
                            {state.loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}