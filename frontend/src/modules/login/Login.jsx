import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import authService from './services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        
        setError('');
        setLoading(true);

        try {
            const result = await authService.login(email, password);
            
            if (result.success) {
                navigate('/main');
            } else {
                setError(result.error || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`login-bg${document.body.classList.contains('dark-mode') ? ' dark-mode' : ''}`}> 
            <div className="login-logo-bar login-logo-left">
                <img src="/images/synera-logo.png" alt="SYNERA Logo" className="login-logo" />
                <span className="login-brand">SYNERA</span>
            </div>
            <div className="login-center-box">
                <h2>Login</h2>
                <hr className="login-divider" />
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Username</label>
                    <input
                        id="email"
                        type="text"
                        placeholder="..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {error && <div className="login-error">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Enter'}
                    </button>
                </form>
                <hr className="login-divider" />
                <div className="login-links">
                    <span>Forgot your password? <button className="login-link-btn" type="button">Click here</button></span>
                    <span>Not have an account? <button className="login-link-btn" type="button">Sign in here</button></span>
                </div>
            </div>
        </div>
    );
};

export default Login;
