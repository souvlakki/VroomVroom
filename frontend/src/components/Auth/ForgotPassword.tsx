// src/components/Auth/ForgotPassword.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
    if (!error) navigate('/login');
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit" disabled={loading}>
          Reset Password
        </button>
      </form>
      <p>
        Go back to <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
