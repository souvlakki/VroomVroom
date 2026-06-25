// src/components/Auth/Login.tsx

import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn(email, password);

    if (!error) {
      navigate((location.state as { from: { pathname: string } })?.from?.pathname || '/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>

        {loading && <p className="auth-message">Loading...</p>}
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            Login
          </button>
        </form>

        <p className="auth-footer">
          Forgot password? <Link className="auth-link" to="/forgot-password">Reset Password</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;