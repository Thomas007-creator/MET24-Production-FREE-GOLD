import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Register Service Worker for Offline Queue + Workbox (Cross-platform)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Try to register Workbox service worker first, fallback to offline queue
    navigator.serviceWorker.register('/sw-workbox.js')
      .then((registration) => {
        console.log('✅ Workbox Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New service worker available, reloading...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('⚠️ Workbox Service Worker failed, falling back to offline queue:', error);
        
        // Fallback to offline queue service worker
        navigator.serviceWorker.register('/sw-offline-queue.js')
          .then((registration) => {
            console.log('✅ Offline Queue Service Worker registered successfully:', registration.scope);
          })
          .catch((fallbackError) => {
            console.log('❌ Both Service Workers failed:', fallbackError);
          });
      });
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
