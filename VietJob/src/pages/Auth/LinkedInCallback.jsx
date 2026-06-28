import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleLinkedInCallback } from '../../hooks/useSocialLogin';
import { Briefcase } from 'lucide-react';

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
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f7fa', fontFamily: "'Be Vietnam Pro', sans-serif"
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)', textAlign: 'center', maxWidth: 400
      }}>
        <div style={{
          width: 64, height: 64, background: '#0A66C2', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Briefcase size={36} color="white" />
        </div>

        {!isError && (
          <div style={{
            width: 40, height: 40, border: '4px solid #e5e7eb',
            borderTop: '4px solid #0A66C2', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
          }} />
        )}

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
