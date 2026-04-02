import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import App from "./App.tsx";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
