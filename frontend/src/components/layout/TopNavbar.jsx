import React from 'react';
import { Link } from 'react-router-dom';

const TopNavbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark px-4 flex-shrink-0 shadow-sm z-3">
      <Link to="/" className="navbar-brand mb-0 h1 text-decoration-none fw-bold">
        🏛️ MuniSoft <span className="text-primary">Planeación</span>
      </Link>
      <span className="text-white opacity-75 small d-none d-md-block">
        Santander de Quilichao, Cauca
      </span>
    </nav>
  );
};

export default TopNavbar;