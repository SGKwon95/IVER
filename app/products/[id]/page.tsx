'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Share2, ShoppingCart, Star, ChevronDown, ArrowUp } from 'lucide-react';
import { products } from '@/lib/mockData';

const TABS = ['상품정보', '리뷰', '문의', '주문정보'] as const;
type Tab = typeof TABS[number];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('상품정보');
  const [optionOpen, setOptionOpen] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const product = products.find((p) => p.id === params.id) ?? products[0];

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.store) { setStoreName(data.store.storeName); setStoreId(data.store.id); }
        if (data.tags) setTags(data.tags);
      });

    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;
    fetch(`/api/likes/product?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => setLiked(data.productIds?.includes(params.id) ?? false));
  }, [params.id]);

  const handleLike = async () => {
    if (likeLoading) return;
    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.push('/login'); return; }
    setLikeLoading(true);
    try {
      const res = await fetch('/api/likes/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, productId: params.id }),
      });
      const data = await res.json();
      if (data.success) setLiked(data.liked);
    } finally {
      setLikeLoading(false);
    }
  };
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
            <button className="p-1"><ShoppingCart size={20} className="text-black" strokeWidth={1.8} /></button>
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
              <Link href="/grade-benefits" className="text-[11px] text-gray-400 border border-gray-200 rounded px-1.5 py-[2px]">
                등급별 혜택
              </Link>
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
        <div className="py-5">
          {activeTab === '상품정보' && (
            <div className="flex flex-col">
              <p className="text-[12px] text-gray-400 text-center flex items-center justify-center gap-1 px-4 mb-4">
                <span>☜</span> 이미지를 확대할 수 있습니다
              </p>

              {/* 상품 상세 이미지 */}
              <div className={`overflow-hidden transition-all ${infoExpanded ? '' : 'max-h-[400px]'}`}>
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="430px" />
                </div>
                <div className="relative w-full aspect-square bg-gray-100 mt-1">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="430px" />
                </div>
              </div>

              {/* 상품정보 더보기 버튼 */}
              <button
                onClick={() => setInfoExpanded((v) => !v)}
                className="mx-4 mt-4 h-[48px] border border-gray-200 rounded-md flex items-center justify-center gap-2 text-[14px] text-black font-medium"
              >
                상품정보 더보기
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${infoExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* 판매자 */}
              <div className="flex items-center justify-between px-4 mt-5 py-3 border-t border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 border border-gray-200 rounded px-1.5 py-[2px]">판매자</span>
                  <span className="text-[14px] font-bold text-black">{storeName ?? '...'}</span>
                </div>
                <Link
                  href={storeId ? `/stores/${storeId}` : '#'}
                  className="flex items-center gap-0.5 text-[12px] text-gray-500"
                >
                  스토어 홈 <ChevronRight size={14} className="text-gray-400" />
                </Link>
              </div>

              {/* 태그 */}
              <div className="px-4 mt-5">
                <p className="text-[15px] font-bold text-black mb-3">태그</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 border border-gray-200 rounded-full text-[13px] text-black"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
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

      {/* 맨위로 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-4 z-40 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center"
      >
        <ArrowUp size={18} className="text-gray-600" />
      </button>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
        <div className="max-w-[430px] mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center shrink-0"
          >
            <Star
              size={22}
              className={liked ? 'text-yellow-400' : 'text-gray-400'}
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
