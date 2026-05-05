'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (!loginId || !loginPw) {
      setMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, loginPw }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('customerId', data.data.customerId);
        setMessage('');
        router.push('/');
        router.refresh();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1 px-5">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="mt-4 mb-8 w-8 h-8 flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-black" strokeWidth={2} />
        </button>

        {/* 인사말 */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-black leading-tight mb-3">
            안녕하세요<br />아이버입니다
          </h1>
        </div>

        {/* 에러 메시지 */}
        {message && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-[13px] rounded-md">
            {message}
          </div>
        )}

        {/* 입력 폼 */}
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디 입력"
            className="w-full h-[52px] px-4 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-300 outline-none focus:border-gray-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full h-[52px] px-4 pr-12 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-300 outline-none focus:border-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-[52px] bg-[#1A1A1A] text-white text-[15px] font-semibold rounded-md mb-8 disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        {/* 하단 링크 */}
        <div className="flex items-center justify-center gap-4 text-[13px] text-gray-400">
          <button className="hover:text-gray-600">아이디 찾기</button>
          <span className="text-gray-200">|</span>
          <button className="hover:text-gray-600">비밀번호 찾기</button>
          <span className="text-gray-200">|</span>
          <button
            onClick={handleRegister}
            className="hover:text-gray-600"
          >
            회원가입
          </button>
        </div>

      </div>
    </div>
  );
}
