import '@/monaco-setup';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupConnect } from '@webcontainer/api/connect';
import { App } from '@/App';
import '@/index.css';

const isConnectPath = window.location.pathname.startsWith('/webcontainer/connect/');
const isBridgeTab = isConnectPath && window.opener != null;
const isBridgeIframe = isConnectPath && window.opener == null;

if (isBridgeTab) {
  setupConnect({ editorOrigin: window.location.origin });
} else if (isBridgeIframe) {
  // Hidden iframe inside the bridge tab. Render nothing; the editor origin's
  // service worker handles the postMessage proxy without a React app booting
  // a second WebContainer here.
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="dark min-h-svh bg-background font-sans text-foreground antialiased">
        <App />
      </div>
    </StrictMode>,
  );
}
