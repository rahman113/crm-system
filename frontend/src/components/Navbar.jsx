import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <span className="brand-icon"></span> CRM System
                </Link>

                <div className="navbar-menu">
                    <div className="user-profile">
                        <div className="user-avatar">{userInitial}</div>
                        <span className="user-name">{user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;