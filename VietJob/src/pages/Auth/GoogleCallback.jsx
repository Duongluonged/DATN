import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../../hooks/useSocialLogin';

// Trang này được Google redirect về sau khi người dùng đồng ý
// URL: /auth/google/callback?code=...&state=...
const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Đang xử lý đăng nhập Google...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const code  = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setIsError(true);
      setStatus('Bạn đã hủy đăng nhập Google.');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    if (!code) {
      setIsError(true);
      setStatus('Không nhận được authorization code từ Google.');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    handleGoogleCallback(code, state, navigate)
      .then((username) => {
        setStatus(`Chào mừng ${username}! Đang chuyển hướng...`);
      })
      .catch((err) => {
        setIsError(true);
        setStatus(err.response?.data?.error || err.message || 'Đăng nhập Google thất bại.');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, []); // chỉ chạy 1 lần

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f7fa', fontFamily: "'Be Vietnam Pro', sans-serif"
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)', textAlign: 'center', maxWidth: 400
      }}>
        {/* Google Icon */}
        <div style={{ margin: '0 auto 24px', width: 64, height: 64 }}>
          <svg viewBox="0 0 24 24" width="64" height="64">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        {/* Spinner */}
        {!isError && (
          <div style={{
            width: 40, height: 40, border: '4px solid #e5e7eb',
            borderTop: '4px solid #4285F4', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
          }} />
        )}

        {isError && <div style={{ fontSize: 36, marginBottom: 16 }}>❌</div>}

        <p style={{
          color: isError ? '#ef4444' : '#374151',
          fontSize: 15, fontWeight: 500, margin: 0
        }}>
          {status}
        </p>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GoogleCallback;
