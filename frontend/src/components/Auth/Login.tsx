// src/components/Auth/Login.tsx

import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {visible ? (
      <>
        <path
          d="M2.25 12C3.75 7.5 7.5 5.25 12 5.25C16.5 5.25 20.25 7.5 21.75 12C20.25 16.5 16.5 18.75 12 18.75C7.5 18.75 3.75 16.5 2.25 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <path
          d="M3 3L21 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.7 5.35C11.13 5.28 11.56 5.25 12 5.25C16.5 5.25 20.25 7.5 21.75 12C21.32 13.3 20.7 14.4 19.92 15.32"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 6.8C4.55 7.9 3.13 9.63 2.25 12C3.75 16.5 7.5 18.75 12 18.75C13.37 18.75 14.66 18.54 15.84 18.12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.88 9.88C9.3 10.46 8.99 11.27 9.02 12.1C9.08 13.7 10.36 14.98 11.96 15.04C12.8 15.07 13.61 14.76 14.2 14.18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

const passwordFieldStyle = {
  position: 'relative',
  width: '100%',
} as const;

const passwordInputStyle = {
  paddingRight: '3rem',
} as const;

const passwordToggleStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'transparent',
  color: '#555',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
} as const;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/profile';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn(email, password);

    const latestError = useAuthStore.getState().error;
    if (!latestError) {
      navigate(redirectPath);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
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
            autoComplete="email"
            required
          />

          <div style={passwordFieldStyle}>
            <input
              className="auth-input"
              style={passwordInputStyle}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              style={passwordToggleStyle}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            Login
          </button>

          <button
            className="auth-button secondary"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Sign in with Google
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link className="auth-link" to="/register">
            Create one
          </Link>
        </p>

        <p className="auth-footer">
          Forgot password?{' '}
          <Link className="auth-link" to="/forgot-password">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
