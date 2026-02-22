import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.tsx';
import { initI18n } from './i18n/i18n';
import { LocationProvider } from './location/LocationContext';
import { MethodProvider } from './method/MethodContext';

import 'leaflet/dist/leaflet.css';

initI18n('en');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationProvider>
      <MethodProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MethodProvider>
    </LocationProvider>
  </StrictMode>
);
