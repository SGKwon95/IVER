'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [email, setEmail] = useState('');
  const [custName, setCustName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!loginId || !loginPw || !email || !custName) {
      setMessage('모든 항목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, loginPw, email, custName }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('회원가입이 완료되었습니다. 로그인해주세요.');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1 px-5">

        <button
          onClick={() => router.back()}
          className="mt-4 mb-8 w-8 h-8 flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-black" strokeWidth={2} />
        </button>

        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-black leading-tight mb-3">
            회원가입
          </h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 text-[13px] rounded-md ${message.includes('완료') ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            placeholder="이름"
            className="w-full h-[52px] px-4 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-300 outline-none focus:border-gray-400"
          />
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디"
            className="w-full h-[52px] px-4 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-300 outline-none focus:border-gray-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              placeholder="비밀번호"
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full h-[52px] px-4 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-300 outline-none focus:border-gray-400"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full h-[52px] bg-[#1A1A1A] text-white text-[15px] font-semibold rounded-md mb-8 disabled:opacity-50"
        >
          {loading ? '처리 중...' : '회원가입'}
        </button>

      </div>
    </div>
  );
}
