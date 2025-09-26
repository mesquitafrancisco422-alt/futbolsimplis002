import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const registerServiceWorker = () => {
  // To resolve the persistent cross-origin issue in this specific sandboxed environment,
  // we explicitly construct the absolute URL for the service worker script.
  // `window.location.origin` provides the true origin of the current page
  // (e.g., 'https://...usercontent.goog'), which we combine with the script path.
  // This ensures the script URL's origin matches the document's origin,
  // satisfying the browser's security policy and fixing the registration failure.
  const swUrl = `${window.location.origin}/sw.js`;
  navigator.serviceWorker.register(swUrl)
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
};

// Register Service Worker
if ('serviceWorker' in navigator) {
  // This robust approach handles cases where the script might execute after the 'load' event has already fired.
  // If the document is already fully loaded, we register the service worker immediately.
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    // Otherwise, we wait for the 'load' event to ensure the document is in a valid state.
    window.addEventListener('load', registerServiceWorker);
  }
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);