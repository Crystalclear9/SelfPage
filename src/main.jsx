import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import './styles.css';
import './motion.css';
import './pointer.css';
import './content.css';
import { currentPath } from './data/routes';

const container = document.getElementById('root');
const app = <React.StrictMode><App path={currentPath(window.location.pathname)} /></React.StrictMode>;
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
document.documentElement.classList.add('interactive');
