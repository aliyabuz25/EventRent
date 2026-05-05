import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { db } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { seedDatabase } from './seed';
import { SiteContentProvider } from './content.context';

// Test Firestore connection on boot
async function testConnection() {
  try {
    // Attempt to get a dummy doc from server to verify config
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore connection verified.");
    
    // Seed database if empty
    await seedDatabase();
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase configuration error: The client is offline. Please check your Firebase settings.");
    }
    // Other errors (like permission denied on this specific path) are expected and mean the connection is working
  }
}

testConnection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </StrictMode>,
);
