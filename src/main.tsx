/**
 * Application Entry Point
 *
 * This file is responsible for mounting the React application to the DOM.
 * It should remain minimal - all providers, routing, and layouts are configured in App.tsx.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
