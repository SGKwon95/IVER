'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CustomerEdit {
  loginId: string | null;
  email: string;
  custName: string;
  mobileNo: string | null;
  birthDate: string | null;
  genderCode: string | null;
  height: number | null;
  weight: number | null;
}

export default function MyPageEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<CustomerEdit | null>(null);
  const [custName, setCustName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [genderCode, setGenderCode] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      router.replace('/login');
      return;
    }
    fetch(`/api/customers/me?customerId=${customerId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          router.replace('/login');
          return;
        }
        setData(res);
        setCustName(res.custName ?? '');
        setMobileNo(res.mobileNo ?? '');
        setBirthDate(res.birthDate ? res.birthDate.slice(0, 10).replace(/-/g, '') : '');
        setGenderCode(res.genderCode);
        setHeight(res.height ? String(res.height) : '');
        setWeight(res.weight ? String(res.weight) : '');
        setLoading(false);
      });
  }, [router]);

  const dirty =
    data &&
    (custName !== (data.custName ?? '') ||
      mobileNo !== (data.mobileNo ?? '') ||
      birthDate !== (data.birthDate ? data.birthDate.slice(0, 10).replace(/-/g, '') : '') ||
      genderCode !== data.genderCode ||
      height !== (data.height ? String(data.height) : '') ||
      weight !== (data.weight ? String(data.weight) : ''));

  const handleSave = async () => {
    if (!dirty || saving) return;
    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;

    if (birthDate && !/^\d{8}$/.test(birthDate)) {
      alert('생년월일은 8자리(YYYYMMDD)로 입력해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const isoBirth = birthDate
        ? `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`
        : null;
      const res = await fetch('/api/customers/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          custName,
          mobileNo,
          birthDate: isoBirth,
          genderCode,
          height: height || null,
          weight: weight || null,
        }),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        alert('저장되었습니다.');
        router.back();
      } else {
        alert(body.error ?? '저장 실패');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?\n쿠폰과 적립금 등 보유 혜택이 사라집니다.')) return;
    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;
    const res = await fetch(`/api/customers/me?customerId=${customerId}`, { method: 'DELETE' });
    const body = await res.json();
    if (res.ok && body.success) {
      alert('탈퇴가 완료되었습니다.');
      localStorage.removeItem('customerId');
      router.replace('/login');
    } else {
      alert(body.error ?? '탈퇴 실패');
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-24">
        {/* 헤더 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={() => router.back()}>
              <ChevronLeft size={22} className="text-black" strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold text-black">회원정보 수정</h1>
            <button>
              <Calendar size={20} className="text-black" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* 프로필 */}
        <div className="flex flex-col items-center pt-6 pb-5">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <svg viewBox="0 0 40 40" width="44" height="44">
              <circle cx="20" cy="16" r="6" fill="#B8B8B8" />
              <ellipse cx="20" cy="32" rx="11" ry="6" fill="#B8B8B8" />
            </svg>
          </div>
          <p className="mt-2 text-[15px] font-bold text-black">
            {data.loginId ?? '-'}
            <span className="text-[#FF3B30] ml-0.5">*</span>
          </p>
        </div>

        {/* 폼 */}
        <div className="px-4 flex flex-col gap-5 border-t border-gray-100 pt-5">
          {/* 이메일 */}
          <div>
            <label className="text-[13px] font-bold text-black">
              이메일<span className="text-[#FF3B30]">*</span>
            </label>
            <div className="mt-2 h-[48px] px-3 border border-gray-200 rounded-md flex items-center bg-gray-50">
              <span className="text-[14px] text-black">{data.email}</span>
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label className="text-[13px] font-bold text-black">이름</label>
            <input
              type="text"
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              placeholder="이름을 입력해 주세요."
              className="mt-2 w-full h-[48px] px-3 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* 휴대폰 번호 */}
          <div>
            <label className="text-[13px] font-bold text-black">
              휴대폰 번호<span className="text-[#FF3B30]">*</span>
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="tel"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="01012345678"
                className="flex-1 h-[48px] px-3 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
              <button className="h-[48px] px-4 border border-gray-300 rounded-md text-[13px] text-black whitespace-nowrap">
                다른번호 인증
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-gray-400">
              * 휴대폰 인증을 하셔야 주문을 할 수 있어요.
            </p>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="text-[13px] font-bold text-black">생년월일</label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
              placeholder="ex. 생년월일 8자리 입력 (19991231)"
              className="mt-2 w-full h-[48px] px-3 border border-gray-200 rounded-md text-[14px] text-black placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="mt-1.5 text-[11px] text-gray-400">
              * 생년월일 수집 시 &apos;최초 1회&apos; 입력 가능해요.
            </p>
          </div>

          {/* 성별 */}
          <div>
            <label className="text-[13px] font-bold text-black">
              성별 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { code: null, label: '선택안함', icon: '' },
                { code: 'FEMALE', label: '여자', icon: '♀' },
                { code: 'MALE', label: '남자', icon: '♂' },
              ].map((g) => {
                const active = genderCode === g.code;
                return (
                  <button
                    key={g.label}
                    onClick={() => setGenderCode(g.code)}
                    className={`h-[48px] border rounded-md text-[14px] flex items-center justify-center gap-1 ${
                      active
                        ? 'border-black text-black font-medium'
                        : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    {g.icon && <span>{g.icon}</span>}
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 내 신체 사이즈 */}
          <div>
            <label className="text-[13px] font-bold text-black">
              내 신체 사이즈 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1 border border-gray-200 rounded-md h-[48px] px-3 overflow-hidden">
                <input
                  type="text"
                  inputMode="numeric"
                  value={height}
                  onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="키"
                  className="flex-1 min-w-0 w-full bg-transparent text-[14px] text-black placeholder-gray-400 focus:outline-none"
                />
                <span className="shrink-0 text-[13px] text-gray-500">cm</span>
              </div>
              <div className="flex items-center gap-1 border border-gray-200 rounded-md h-[48px] px-3 overflow-hidden">
                <input
                  type="text"
                  inputMode="numeric"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="몸무게"
                  className="flex-1 min-w-0 w-full bg-transparent text-[14px] text-black placeholder-gray-400 focus:outline-none"
                />
                <span className="shrink-0 text-[13px] text-gray-500">kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 개인정보 수집 동의 */}
        <button
          onClick={() => setAgree((v) => !v)}
          className="mt-6 w-full px-4 py-4 border-t border-b border-gray-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-[18px] h-[18px] rounded-sm border flex items-center justify-center ${
                agree ? 'bg-black border-black' : 'border-gray-300'
              }`}
            >
              {agree && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 5L4 8L9 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-[13px] text-black">
              개인정보 수집 및 이용에 대한 안내 동의 <span className="text-gray-400">(선택)</span>
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        {/* 안내 문구 + 탈퇴 */}
        <div className="px-4 mt-4 flex flex-col gap-2">
          <p className="text-[12px] text-gray-500">
            이벤트/마케팅 및 야간 혜택 알림 수신 관리는 앱에서 가능해요.
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-gray-500">
              회원 탈퇴를 하시면 쿠폰과 적립금 등 보유하신 혜택이 사라져요.
            </p>
            <button
              onClick={handleWithdraw}
              className="ml-3 px-3 py-1.5 border border-gray-300 rounded-md text-[12px] text-black whitespace-nowrap"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 저장하기 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
        <div className="max-w-[430px] mx-auto px-4 py-3">
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={`w-full h-12 rounded-md text-[15px] font-semibold ${
              dirty && !saving ? 'bg-[#1A1A1A] text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
