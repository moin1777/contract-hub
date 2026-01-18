import React from 'react';
import { FileText, Menu, X, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <FileText className="logo-icon" />
          <span className="logo-text">ContractHub</span>
        </Link>

        <nav className="nav-desktop">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/contracts"
            className={`nav-link ${location.pathname.startsWith('/contracts') ? 'active' : ''}`}
          >
            Contracts
          </Link>
          <Link
            to="/blueprints"
            className={`nav-link ${location.pathname === '/blueprints' ? 'active' : ''}`}
          >
            <Layers size={16} />
            Blueprints
          </Link>
        </nav>

        <button className="menu-toggle" onClick={onMenuToggle}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
