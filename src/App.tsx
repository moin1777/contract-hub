import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ContractList from './pages/ContractList';
import ContractDetail from './pages/ContractDetail';
import CreateContract from './pages/CreateContract';
import EditContract from './pages/EditContract';
import Blueprints from './pages/Blueprints';

const MobileNav: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  const linkClass = (isActive: boolean) =>
    `block px-4 py-3 text-base font-medium border-b border-gray-100 transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <nav className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40 md:hidden">
        <Link
          to="/"
          className={linkClass(location.pathname === '/')}
          onClick={onClose}
        >
          Dashboard
        </Link>
        <Link
          to="/contracts"
          className={linkClass(location.pathname.startsWith('/contracts'))}
          onClick={onClose}
        >
          Contracts
        </Link>
        <Link
          to="/blueprints"
          className={linkClass(location.pathname === '/blueprints')}
          onClick={onClose}
        >
          Blueprints
        </Link>
      </nav>
    </>
  );
};

const AppContent: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/contracts/new" element={<CreateContract />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/contracts/:id/edit" element={<EditContract />} />
          <Route path="/blueprints" element={<Blueprints />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
