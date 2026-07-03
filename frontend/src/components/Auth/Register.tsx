// src/components/Auth/Register.tsx

import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  theme?: 'auto' | 'light' | 'dark';
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset?: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

const turnstileScriptId = 'cloudflare-turnstile-script';
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

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

const passwordRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
} as const;

const passwordInputStyle = {
  flex: 1,
  minWidth: 0,
} as const;

const passwordToggleStyle = {
  width: '42px',
  height: '42px',
  border: 'none',
  background: 'transparent',
  color: '#555',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  flex: '0 0 auto',
} as const;

const captchaContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
} as const;

const passwordRulesStyle = {
  margin: '0.25rem 0 0.75rem',
  padding: '0.75rem',
  borderRadius: '8px',
  backgroundColor: '#f8f9fb',
  border: '1px solid #e5e7eb',
  fontSize: '0.9rem',
} as const;

const passwordRuleStyle = (valid: boolean, highlightMissing: boolean) =>
  ({
    color: valid ? '#000000' : highlightMissing ? '#b42318' : '#555',
    fontWeight: valid || highlightMissing ? 700 : 400,
    margin: '0.25rem 0',
  }) as const;

const helperTextStyle = {
  color: '#555',
  fontSize: '0.85rem',
  margin: '0.35rem 0 0.75rem',
  lineHeight: 1.4,
} as const;

const passwordMatchStyle = (valid: boolean) =>
  ({
    color: valid ? '#000000' : '#b42318',
    fontWeight: 700,
    fontSize: '0.9rem',
    margin: '-0.35rem 0 0.5rem',
  }) as const;

const successMessageStyle = {
  color: '#16794c',
  fontSize: '0.9rem',
  fontWeight: 700,
  margin: '0.35rem 0 0',
  lineHeight: 1.4,
} as const;

const generateStrongPasswordValue = () => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%&*?';
  const all = `${upper}${lower}${numbers}${special}`;

  const requiredCharacters = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  const remainingCharacters = Array.from({ length: 12 }, () => {
    return all[Math.floor(Math.random() * all.length)];
  });

  return [...requiredCharacters, ...remainingCharacters]
    .sort(() => crypto.getRandomValues(new Uint32Array(1))[0] - 2147483648)
    .join('');
};

const Register = () => {
  const { signUp, loading, error } = useAuthStore();

  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const hideGeneratedPasswordTimerRef = useRef<number | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'parent' | 'child'>('parent');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordGeneratedMessage, setPasswordGeneratedMessage] = useState<string | null>(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const passwordRules = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordMeetsRequirements = Object.values(passwordRules).every(Boolean);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    if (!turnstileSiteKey) {
      setFormError('Turnstile site key is missing. Check VITE_TURNSTILE_SITE_KEY in .env.');
      return;
    }

    const renderTurnstile = () => {
      if (!turnstileContainerRef.current || !window.turnstile || turnstileWidgetIdRef.current) {
        return;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'auto',
        callback: (token: string) => {
          setCaptchaToken(token);
          setFormError(null);
        },
        'expired-callback': () => {
          setCaptchaToken(null);
        },
        'error-callback': () => {
          setCaptchaToken(null);
          setFormError('Captcha verification failed. Please try again.');
        },
      });
    };

    const existingScript = document.getElementById(turnstileScriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.turnstile) renderTurnstile();
      else existingScript.addEventListener('load', renderTurnstile, { once: true });
    } else {
      const script = document.createElement('script');
      script.id = turnstileScriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', renderTurnstile, { once: true });
      document.body.appendChild(script);
    }

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }

      if (hideGeneratedPasswordTimerRef.current) {
        window.clearTimeout(hideGeneratedPasswordTimerRef.current);
      }
    };
  }, []);

  const resetCaptcha = () => {
    setCaptchaToken(null);

    if (turnstileWidgetIdRef.current && window.turnstile?.reset) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const generateStrongPassword = async () => {
    const generatedPassword = generateStrongPasswordValue();

    setPassword(generatedPassword);
    setConfirmPassword(generatedPassword);
    setShowPassword(true);
    setShowConfirmPassword(true);
    setSubmitAttempted(false);
    setFormError(null);
    setSignupSuccessMessage(null);
    setPasswordGeneratedMessage(
      'Strong password generated. Your browser or password manager will usually offer to save it securely.'
    );

    try {
      await navigator.clipboard.writeText(generatedPassword);
    } catch {
      // Clipboard access may be blocked by the browser. The password is still shown in the fields.
    }

    if (hideGeneratedPasswordTimerRef.current) {
      window.clearTimeout(hideGeneratedPasswordTimerRef.current);
    }

    hideGeneratedPasswordTimerRef.current = window.setTimeout(() => {
      setShowPassword(false);
      setShowConfirmPassword(false);
    }, 5000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setFormError(null);
    setSignupSuccessMessage(null);

    if (!passwordMeetsRequirements) {
      setFormError('Password does not meet the security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (!captchaToken) {
      setFormError('Please complete the captcha check.');
      return;
    }

    await signUp(email, password, role, captchaToken);

    const latestError = useAuthStore.getState().error;
    if (!latestError) {
      setSignupSuccessMessage('Check your email for the confirmation link before signing in.');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setPasswordGeneratedMessage(null);
      setSubmitAttempted(false);
      resetCaptcha();
      return;
    }

    resetCaptcha();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>

        {loading && <p className="auth-message">Loading...</p>}
        {(error || formError) && <p className="auth-error">{formError || error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSignupSuccessMessage(null);
            }}
            placeholder="Email"
            autoComplete="email"
            required
          />

          <div style={passwordRowStyle}>
            <input
              className="auth-input"
              style={passwordInputStyle}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordGeneratedMessage(null);
                setSignupSuccessMessage(null);
              }}
              placeholder="Password"
              autoComplete="new-password"
              required
            />
            <button
              className="auth-button auth-strong-button"
              type="button"
              onClick={generateStrongPassword}
              title="Generate a secure password"
            >
              Strong
            </button>
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

          <div style={passwordRowStyle}>
            <input
              className="auth-input"
              style={passwordInputStyle}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setSignupSuccessMessage(null);
              }}
              placeholder="Confirm password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              style={passwordToggleStyle}
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              <EyeIcon visible={showConfirmPassword} />
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <p style={passwordMatchStyle(passwordsMatch)}>
              {passwordsMatch ? 'Passwords match.' : 'Passwords do not match.'}
            </p>
          )}

          {passwordGeneratedMessage && (
            <p className="auth-message" style={helperTextStyle}>
              {passwordGeneratedMessage}
            </p>
          )}

          <div style={passwordRulesStyle}>
            <strong>Password requirements</strong>
            <p style={passwordRuleStyle(passwordRules.length, submitAttempted)}>
              At least 8 characters
            </p>
            <p style={passwordRuleStyle(passwordRules.uppercase, submitAttempted)}>
              One uppercase letter
            </p>
            <p style={passwordRuleStyle(passwordRules.lowercase, submitAttempted)}>
              One lowercase letter
            </p>
            <p style={passwordRuleStyle(passwordRules.number, submitAttempted)}>One number</p>
            <p style={passwordRuleStyle(passwordRules.special, submitAttempted)}>
              One special character
            </p>
          </div>

          <select
            className="auth-input"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as 'parent' | 'child');
              setSignupSuccessMessage(null);
            }}
          >
            <option value="parent">Parent</option>
            <option value="child">Child</option>
          </select>

          <div style={captchaContainerStyle} ref={turnstileContainerRef} />

          <button className="auth-button" type="submit" disabled={loading}>
            Sign Up
          </button>

          {signupSuccessMessage && <p style={successMessageStyle}>{signupSuccessMessage}</p>}
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link className="auth-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
