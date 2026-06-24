import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../../hooks/useSocialLogin';
import { Globe } from 'lucide-react';

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
          <Globe size={64} color="#4285F4" />
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
