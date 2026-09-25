import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import { appRoutes } from './routes/appRoutes';
import { useEnsureUserDoc } from './hooks/useEnsureUserDoc';

function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-premium-orange border-t-transparent animate-spin" />
    </div>
  );
}

function AdminLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #dee2e6', borderTopColor: '#e30613', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  useEnsureUserDoc();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<AdminLoader />}>
        <Routes location={location} key="admin">
          {appRoutes.filter(r => r.path.startsWith('/admin')).map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Suspense>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            {appRoutes.filter(r => !r.path.startsWith('/admin')).map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}