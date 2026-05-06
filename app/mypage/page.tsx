'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const GRADE_LABEL: Record<string, string> = {
  IRON: '아이언 등급',
  BRONZE: '브론즈 등급',
  SILVER: '실버 등급',
  GOLD: '골드 등급',
  DIAMOND: '다이아몬드 등급',
};

interface CustomerInfo {
  custName: string;
  customerTypeCode: string;
  point: number;
}

export default function MyPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      router.replace('/login');
      return;
    }
    fetch(`/api/customers/me?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) router.replace('/login');
        else setCustomer(data);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customerId');
    router.replace('/login');
  };

  const gradeLabel = customer ? (GRADE_LABEL[customer.customerTypeCode] ?? '아이언 등급') : '아이언 등급';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-24">

        {/* 헤더 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={() => router.back()}>
              <ChevronLeft size={22} className="text-black" strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold text-black">마이페이지</h1>
            <button className="relative">
              <ShoppingCart size={22} className="text-black" strokeWidth={1.8} />
              <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>
        </div>

        {/* 프로필 */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#2A2A2A" stroke="#555" strokeWidth="1.5" />
              <circle cx="20" cy="18" r="7" fill="#888" />
              <ellipse cx="20" cy="32" rx="10" ry="6" fill="#888" />
            </svg>
          </div>
          <div className="flex-1">
            <button className="flex items-center gap-1" onClick={() => {}}>
              <span className="text-[16px] font-bold text-black">{customer?.custName ?? '...'}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <p className="text-[12px] text-[#C8A97E] font-medium mt-0.5">{gradeLabel}</p>
          </div>
        </div>

        {/* 포인트 / 쿠폰 / 리뷰 */}
        <div className="grid grid-cols-3 border-t border-b border-gray-100 mx-4">
          {[
            { label: '포인트', value: customer?.point ?? 0 },
            { label: '쿠폰', value: 0 },
            { label: '리뷰', value: 0 },
          ].map((item, i) => (
            <button
              key={item.label}
              className={`flex flex-col items-center py-4 ${i < 2 ? 'border-r border-gray-100' : ''}`}
            >
              <span className="text-[18px] font-bold text-black">{item.value.toLocaleString('ko-KR')}</span>
              <span className="text-[12px] text-gray-500 mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>

        {/* 진행중인 주문 */}
        <div className="mt-5 mx-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-black">진행중인 주문</span>
              <span className="text-[11px] text-gray-400">최근 3개월</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          {/* 주문 단계 */}
          <div className="flex items-start justify-between">
            {['입금/결제', '준비중', '배송중', '배송완료', '구매확정'].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <span className="text-[16px] font-bold text-gray-400">0</span>
                  </div>
                  <span className="text-[10px] text-gray-500 text-center whitespace-pre-line leading-tight">{step}</span>
                </div>
                {i < 4 && <ChevronRight size={14} className="text-gray-300 mb-4 mx-0.5" />}
              </div>
            ))}
          </div>

          {/* 취소 / 고환·반불 */}
          <div className="flex border-t border-gray-100 mt-4">
            <button className="flex-1 py-2.5 text-[12px] text-gray-500 border-r border-gray-100">
              취소 <span className="font-medium">0</span>
            </button>
            <button className="flex-1 py-2.5 text-[12px] text-gray-500">
              고환/반불 <span className="font-medium">0</span>
            </button>
          </div>
        </div>

        {/* 쇼핑 정보 */}
        <div className="mt-6 px-4">
          <p className="text-[14px] font-bold text-black mb-3">쇼핑 정보</p>
          <div className="divide-y divide-gray-100">
            {[
              { label: '빠른페이 관리', badge: null },
              { label: '친구초대', badge: '+5,000P' },
            ].map((item) => (
              <button key={item.label} className="flex items-center justify-between w-full py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-black">{item.label}</span>
                  {item.badge && (
                    <span className="text-[11px] text-[#7C3AED] font-medium">{item.badge}</span>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* 나의 활동 */}
        <div className="mt-4 px-4">
          <p className="text-[14px] font-bold text-black mb-3">나의 활동</p>
          <div className="divide-y divide-gray-100">
            {['상품 리뷰', '문의 내역', '최근 본 상품'].map((item) => (
              <button key={item} className="flex items-center justify-between w-full py-3.5">
                <span className="text-[14px] text-black">{item}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* 고객지원 */}
        <div className="mt-4 px-4">
          <p className="text-[14px] font-bold text-black mb-3">고객지원</p>
          <div className="divide-y divide-gray-100">
            {['자주 하는 질문', '판매자 문의 답변'].map((item) => (
              <button key={item} className="flex items-center justify-between w-full py-3.5">
                <span className="text-[14px] text-black">{item}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="mt-4 px-4 pb-4">
          <button
            onClick={handleLogout}
            className="text-[13px] text-gray-400 underline underline-offset-2"
          >
            로그아웃
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
