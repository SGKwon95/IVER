'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingBag } from 'lucide-react';
import { products } from '@/lib/mockData';

const TABS = ['상품정보', '리뷰', '문의', '주문정보'] as const;
type Tab = typeof TABS[number];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('상품정보');
  const [optionOpen, setOptionOpen] = useState(false);

  const product = products.find((p) => p.id === params.id) ?? products[0];
  const pointAmount = Math.floor(product.price * 0.005);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1 pb-20">

        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-30">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft size={24} className="text-black" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-1"><Share2 size={20} className="text-black" strokeWidth={1.8} /></button>
            <button className="p-1"><ShoppingBag size={20} className="text-black" strokeWidth={1.8} /></button>
          </div>
        </div>

        {/* 상품 이미지 */}
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="430px"
          />
        </div>

        {/* 브랜드 & 상품명 & 가격 */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <p className="text-[12px] text-gray-400 font-medium mb-1">{product.brand}</p>
          <h1 className="text-[15px] text-black font-medium leading-snug mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B30] text-[18px] font-bold">{product.discountRate}%</span>
            <span className="text-black text-[22px] font-bold">
              {product.price.toLocaleString('ko-KR')}원
            </span>
          </div>
          <p className="text-gray-400 text-[13px] line-through mt-0.5">
            {product.originalPrice.toLocaleString('ko-KR')}원
          </p>
        </div>

        {/* 옵션 선택 */}
        <button
          onClick={() => setOptionOpen((v) => !v)}
          className="mx-4 mt-3 flex items-center justify-between px-4 h-[48px] border border-gray-200 rounded-md"
        >
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-black">예약구매가</span>
            <span className="text-[10px] text-gray-400 border border-gray-300 rounded-full px-1.5 py-[1px]">①</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-black">
              {product.price.toLocaleString('ko-KR')}원
            </span>
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${optionOpen ? 'rotate-90' : ''}`} />
          </div>
        </button>

        {/* 배송 & 적립 */}
        <div className="mx-4 mt-3 flex flex-col gap-2 text-[13px] pb-3 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <span className="text-gray-400 w-8 shrink-0">배송</span>
            <span className="text-black">하이버는 모든 상품 <span className="font-semibold">무료배송</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 w-8 shrink-0">적립</span>
            <div className="flex items-center gap-2">
              <span className="text-black">결제 시 0.5% 적립 ({pointAmount.toLocaleString('ko-KR')}원)</span>
              <button className="text-[11px] text-gray-400 border border-gray-200 rounded px-1.5 py-[2px]">
                등급별 혜택
              </button>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex mt-4 border-b border-gray-200 sticky top-[52px] bg-white z-20">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === '리뷰' ? `리뷰(${product.reviewCount.toLocaleString('ko-KR')})` : tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[13px] font-medium relative transition-colors ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}
              >
                {label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                )}
              </button>
            );
          })}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="px-4 py-5">
          {activeTab === '상품정보' && (
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-gray-400 text-center flex items-center justify-center gap-1">
                <span>☜</span> 이미지를 확대할 수 있습니다
              </p>
              {/* 판매자 정보 */}
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 font-bold">
                    JQA<br/>TRADE
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-black">리셀 가능한 정품 병행수입 판매업체</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">공식 파트너 판매점</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  (주)조아무역은 2008년부터 정상적인 유통 경로를 통하여 엄격한 세관을 통과한 한 번에 가품 가능이 없는, 정품만을 판매하는 정식인증 기업입니다.
                </p>
              </div>
              {/* 상품 이미지 추가 */}
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="430px"
                />
              </div>
            </div>
          )}
          {activeTab === '리뷰' && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-[14px]">아직 작성된 리뷰가 없습니다.</p>
            </div>
          )}
          {activeTab === '문의' && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-[14px]">아직 작성된 문의가 없습니다.</p>
            </div>
          )}
          {activeTab === '주문정보' && (
            <div className="flex flex-col gap-3 text-[13px]">
              {[
                ['결제수단', '신용카드, 카카오페이, 네이버페이, 무통장입금'],
                ['배송방법', '택배 (CJ대한통운)'],
                ['배송기간', '결제 완료 후 1~3 영업일 이내 발송'],
                ['교환/반품', '수령 후 7일 이내 교환/반품 가능'],
                ['교환/반품 불가', '착용 흔적, 세탁, 수선, 라벨 제거 시 불가'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <span className="text-gray-400 shrink-0 w-24">{label}</span>
                  <span className="text-black">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
        <div className="max-w-[430px] mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setLiked((v) => !v)}
            className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center shrink-0"
          >
            <Heart
              size={22}
              className={liked ? 'text-red-500' : 'text-gray-400'}
              fill={liked ? 'currentColor' : 'none'}
            />
          </button>
          <button className="flex-1 h-12 bg-[#1A1A1A] text-white text-[15px] font-semibold rounded-md">
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
