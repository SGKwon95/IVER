'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const GRADES = [
  {
    id: 'iron',
    name: '아이언',
    level: 'LV.6',
    range: '0~19,999',
    point: '0.5%',
    color: '#4A5568',
    bgColor: '#EDF2F7',
    activeColor: '#ECC94B',
    icon: '⬡',
  },
  {
    id: 'bronze',
    name: '브론즈',
    level: 'LV.5',
    range: '20,000~99,999',
    point: '0.7%',
    color: '#C05621',
    bgColor: '#FEEBC8',
    activeColor: '#DD6B20',
    icon: '⬡',
  },
  {
    id: 'silver',
    name: '실버',
    level: 'LV.4',
    range: '100,000~299,999',
    point: '1.0%',
    color: '#718096',
    bgColor: '#E2E8F0',
    activeColor: '#A0AEC0',
    icon: '⬡',
  },
  {
    id: 'gold',
    name: '골드',
    level: 'LV.3',
    range: '300,000~599,999',
    point: '1.5%',
    color: '#B7791F',
    bgColor: '#FEFCBF',
    activeColor: '#D69E2E',
    icon: '⬡',
  },
  {
    id: 'platinum',
    name: '플래티넘',
    level: 'LV.2',
    range: '600,000~999,999',
    point: '2.0%',
    color: '#4A5568',
    bgColor: '#EDF2F7',
    activeColor: '#CBD5E0',
    icon: '⬡',
  },
  {
    id: 'diamond',
    name: '다이아몬드',
    level: 'LV.1',
    range: '1,000,000 이상',
    point: '3.0%',
    color: '#2B6CB0',
    bgColor: '#EBF8FF',
    activeColor: '#4299E1',
    icon: '⬡',
  },
] as const;

const NOTICES = [
  '매월 1일, 최근 12개월 실 결제금액 기준으로 새로운 회원 등급이 부여됩니다.',
  '새로운 등급은 구매확정된 거래 내역에 한하여 부여됩니다.',
  '등급제 쿠폰은 매월 1일 08시에 발급 가능합니다.',
  '등급제 쿠폰은 등급별로 혜택이 다릅니다.',
  '타 쿠폰과 중복 사용이 불가능 합니다.',
  '회원 등급별 혜택과 기준은 내부 사정에 의하여 향후 변경될 수 있습니다.',
];

const STEP_HEIGHTS = [56, 80, 104, 128, 152, 176];

export default function GradeBenefitsPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>('iron');

  const selected = GRADES.find((g) => g.id === selectedId)!;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-[430px] mx-auto">

        {/* 헤더 */}
        <div className="flex items-center px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => router.back()} className="p-1 mr-2">
            <ChevronLeft size={22} className="text-black" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-center text-[16px] font-semibold text-black pr-8">
            등급 혜택 보기
          </h1>
        </div>

        <div className="p-4 flex flex-col gap-3">

          {/* 등급별 혜택 안내 카드 */}
          <div className="bg-white rounded-xl p-5">
            <p className="text-[14px] font-bold text-black mb-5">등급별 혜택 안내</p>

            {/* 계단형 차트 */}
            <div className="flex items-end gap-1 mb-4 px-1">
              {GRADES.map((grade, i) => {
                const isSelected = grade.id === selectedId;
                return (
                  <button
                    key={grade.id}
                    onClick={() => setSelectedId(grade.id)}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    {/* 계단 블록 */}
                    <div
                      className="w-full rounded-t-sm flex items-start justify-center pt-2 transition-colors"
                      style={{
                        height: STEP_HEIGHTS[i],
                        backgroundColor: isSelected ? grade.activeColor : '#F0F0F0',
                      }}
                    >
                      <span
                        className="text-[18px] leading-none"
                        style={{ color: isSelected ? 'white' : grade.color }}
                      >
                        {grade.icon}
                      </span>
                    </div>
                    {/* 등급명 (항상 블록 아래) */}
                    <div
                      className="w-full rounded-sm py-1 text-center"
                      style={{
                        backgroundColor: isSelected ? grade.activeColor : 'transparent',
                      }}
                    >
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: isSelected ? 'white' : '#999' }}
                      >
                        {grade.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 선택된 등급 정보 */}
            <div className="bg-[#F8F8F8] rounded-lg p-4">
              <p className="text-[14px] font-bold text-black mb-3">
                {selected.level} {selected.name}
              </p>
              <div className="flex flex-col gap-2 text-[13px]">
                <div className="flex gap-4">
                  <span className="text-gray-400 w-8 shrink-0">기준</span>
                  <span className="text-black">
                    최근 12개월 누적 구매확정액 기준 ({selected.range})
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-400 w-8 shrink-0">적립</span>
                  <span className="text-black">결제 시 {selected.point} 적립</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-400 w-8 shrink-0">배송</span>
                  <span className="text-black">모든 상품 무료배송</span>
                </div>
              </div>
            </div>
          </div>

          {/* 꼭 확인하세요 카드 */}
          <div className="bg-white rounded-xl p-5">
            <p className="text-[14px] font-bold text-black mb-4">꼭 확인하세요</p>
            <ul className="flex flex-col gap-2.5">
              {NOTICES.map((notice, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#FF3B30] mt-0.5 shrink-0">•</span>
                  <span className="text-[12px] text-[#FF3B30] leading-relaxed">{notice}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
