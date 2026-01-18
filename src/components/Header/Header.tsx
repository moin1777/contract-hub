import React from 'react';
import { FileText, Menu, X, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const location = useLocation();

  const navLinkClass = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-900">
          <FileText className="w-7 h-7 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">ContractHub</span>
        </Link>

        <nav className="hidden md:flex gap-2">
          <Link to="/" className={navLinkClass(location.pathname === '/')}>
            Dashboard
          </Link>
          <Link
            to="/contracts"
            className={navLinkClass(location.pathname.startsWith('/contracts'))}
          >
            Contracts
          </Link>
          <Link
            to="/blueprints"
            className={navLinkClass(location.pathname === '/blueprints')}
          >
            <Layers size={16} />
            Blueprints
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={onMenuToggle}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
