import { useState, useEffect } from 'react';
import { adminLogin, validateAdminToken } from '../api/client';

const TOKEN_KEY = 'antrixx_admin_token';

export interface AdminAuthState {
  token: string | null;
  email: string;
  password: string;
  loginError: string;
  loginLoading: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
}

export function useAdminAuth(): AdminAuthState {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@antrixx.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // On mount: restore & validate stored token
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;

    validateAdminToken(stored).then((valid) => {
      if (valid) {
        setToken(stored);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { ok, data } = await adminLogin(email, password);
      if (ok && data.token) {
        setToken(data.token);
        localStorage.setItem(TOKEN_KEY, data.token);
      } else {
        setLoginError(data.error || 'Invalid admin credentials.');
      }
    } catch {
      setLoginError('Could not connect to backend server (port 5000).');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  return {
    token,
    email,
    password,
    loginError,
    loginLoading,
    setEmail,
    setPassword,
    handleLogin,
    handleLogout,
  };
}
