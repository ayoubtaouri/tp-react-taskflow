import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext'; // ✅ décommenter
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);