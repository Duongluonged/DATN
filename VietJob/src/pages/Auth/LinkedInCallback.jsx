import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleLinkedInCallback } from '../../hooks/useSocialLogin';

// Trang này được LinkedIn redirect về sau khi người dùng đồng ý
// URL: /auth/linkedin/callback?code=...&state=...
const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Đang xử lý đăng nhập LinkedIn...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const code  = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setIsError(true);
      setStatus('Bạn đã hủy đăng nhập LinkedIn.');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    if (!code) {
      setIsError(true);
      setStatus('Không nhận được authorization code từ LinkedIn.');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    handleLinkedInCallback(code, state, navigate)
      .then((username) => {
        setStatus(`Chào mừng ${username}! Đang chuyển hướng...`);
      })
      .catch((err) => {
        setIsError(true);
        setStatus(err.response?.data?.error || err.message || 'Đăng nhập LinkedIn thất bại.');
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
        {/* LinkedIn Icon */}
        <div style={{
          width: 64, height: 64, background: '#0A66C2', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>

        {/* Spinner nếu đang xử lý */}
        {!isError && (
          <div style={{
            width: 40, height: 40, border: '4px solid #e5e7eb',
            borderTop: '4px solid #0A66C2', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
          }} />
        )}

        {/* Error icon */}
        {isError && (
          <div style={{ fontSize: 36, marginBottom: 16 }}>❌</div>
        )}

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

export default LinkedInCallback;
