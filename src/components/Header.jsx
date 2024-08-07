import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Header = ({ showForm, setShowForm, isAuthenticated, loginWithRedirect, logout }) => {
  const handleShareClick = () => {
    if (isAuthenticated) {
      setShowForm((show) => !show);
    } else {
      loginWithRedirect(); // Ensure this is a function
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img
          src="logo.png"
          height="68"
          width="68"
          alt="Today I Learned Logo"
        />
        <h1>Today I Learned</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={handleShareClick}
      >
        {isAuthenticated ? (showForm ? 'Close' : 'Share a fact') : 'Log in to share a fact'}
      </button>

      {isAuthenticated && (
        <button
          className="btn btn-large btn-logout"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </button>
      )}
    </header>
  );
};

export default Header;
