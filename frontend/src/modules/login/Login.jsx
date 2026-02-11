import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        setError('');
        // Simulación de login exitoso
        alert('Login exitoso');
        navigate('/core'); // Redirige al dashboard principal
    };

    return (
        <div className="login-bg">
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
                    <button type="submit">Enter</button>
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
