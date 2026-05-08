import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // New state for success message
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        setLocalError('');
        setLoading(true);

        const success = await register(name, email, password);
        setLoading(false);

        if (success) {
            setSuccessMsg('Registration successful! Please login.');
            // Wait 2 seconds so they can read the message, then go to login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Register for CRM</h2>

                {/* Show success message if registration worked */}
                {successMsg && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{successMsg}</div>}

                {(error || localError) && <div className="error-message">{error || localError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading || successMsg}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;