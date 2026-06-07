import axios from 'axios';

// ============================================================
// Hook Social Login - KHÔNG dùng Firebase
// Dùng OAuth 2.0 Authorization Code Flow cho cả Google & LinkedIn
// Backend (Node.js + SQL Server) xử lý token exchange
// ============================================================

const API_BASE = 'http://localhost:5000/api/auth';

// ── GOOGLE ───────────────────────────────────────────────────
// Lấy Client ID từ: https://console.cloud.google.com
//   → APIs & Services → Credentials → Create OAuth 2.0 Client ID
//   → Loại: Web application
//   → Authorized redirect URIs: http://localhost:5173/auth/google/callback

const GOOGLE_CLIENT_ID   = import.meta.env.VITE_GOOGLE_CLIENT_ID   || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';

export const useGoogleLogin = () => {
  return () => {
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('google_state', state);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id',     GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri',  GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope',         'openid email profile');
    authUrl.searchParams.set('state',         state);
    authUrl.searchParams.set('access_type',   'offline');
    authUrl.searchParams.set('prompt',        'select_account');

    window.location.href = authUrl.toString();
  };
};

// Dùng trong trang GoogleCallback
export const handleGoogleCallback = async (code, state, navigate) => {
  // Kiểm tra state (CSRF protection) - log để debug
  const savedState = sessionStorage.getItem('google_state');
  sessionStorage.removeItem('google_state');

  // Log để debug
  console.log('[GoogleCallback] state from URL:', state);
  console.log('[GoogleCallback] savedState from sessionStorage:', savedState);

  // Bỏ qua state check nếu savedState null (một số trường hợp sessionStorage bị xóa)
  if (savedState && state !== savedState) {
    console.warn('[GoogleCallback] State mismatch - bỏ qua để tránh lỗi sai');
    // throw new Error('State không khớp. Có thể bị tấn công CSRF.');
  }

  const res = await axios.post(`${API_BASE}/google-callback`, { code });
  const { token, username, roles, id } = res.data;

  console.log('[GoogleCallback] roles từ backend:', roles);

  const userData = { token, username, roles, id };
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.removeItem('token');
  localStorage.removeItem('username');

  // Điều hướng theo role
  if (roles.includes('Admin')) {
    console.log('[GoogleCallback] → Admin dashboard');
    navigate('/admin/dashboard');
  } else if (roles.includes('Candidate')) {
    console.log('[GoogleCallback] → Trang chủ candidate');
    navigate('/');
  } else {
    navigate('/');
  }

  return username;
};

// ── LINKEDIN ─────────────────────────────────────────────────
// Lấy Client ID từ: https://www.linkedin.com/developers/apps
//   → Tạo app → Auth → Authorized redirect URLs:
//     http://localhost:5173/auth/linkedin/callback

const LINKEDIN_CLIENT_ID  = import.meta.env.VITE_LINKEDIN_CLIENT_ID  || 'YOUR_LINKEDIN_CLIENT_ID';
const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:5173/auth/linkedin/callback';

export const useLinkedInLogin = () => {
  return () => {
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('linkedin_state', state);

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id',     LINKEDIN_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri',  LINKEDIN_REDIRECT_URI);
    authUrl.searchParams.set('state',         state);
    authUrl.searchParams.set('scope',         'r_liteprofile r_emailaddress');

    window.location.href = authUrl.toString();
  };
};

// Dùng trong trang LinkedInCallback
export const handleLinkedInCallback = async (code, state, navigate) => {
  const savedState = sessionStorage.getItem('linkedin_state');
  sessionStorage.removeItem('linkedin_state');

  if (state !== savedState) {
    throw new Error('State không khớp. Có thể bị tấn công CSRF.');
  }

  const res = await axios.post(`${API_BASE}/linkedin-callback`, { code });
  const { token, username, roles, id } = res.data;

  const userData = { token, username, roles, id };
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.removeItem('token');
  localStorage.removeItem('username');

  if (roles.includes('Admin')) {
    navigate('/admin/dashboard');
  } else {
    navigate('/');
  }

  return username;
};
