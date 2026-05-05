'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, Heart } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { products } from '@/lib/mockData';

const TABS = ['찜한 상품', '찜한 스토어', '최근 본 상품'] as const;
type Tab = typeof TABS[number];

const CATEGORY_FILTERS = ['전체', '쇼핑몰', '브랜드', '스포츠'];

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('찜한 상품');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [excludeSoldOut, setExcludeSoldOut] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;
    fetch(`/api/likes/product?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => setLikedIds(new Set(data.productIds)));
  }, []);

  const likedProducts = products.filter((p) => likedIds.has(p.id));

  const toggleLike = async (id: string) => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;
    const res = await fetch('/api/likes/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, productId: id }),
    });
    const data = await res.json();
    if (data.success) {
      setLikedIds((prev) => {
        const next = new Set(prev);
        data.liked ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-20">

        {/* 헤더 */}
        <div className="sticky top-0 z-30 bg-white">
          <div className="flex items-center justify-between px-4 h-12 border-b border-gray-100">
            <div className="w-12" />
            <h1 className="text-[16px] font-semibold text-black">찜</h1>
            <div className="flex items-center gap-3">
              <button><Search size={20} className="text-black" strokeWidth={1.8} /></button>
              <button className="relative">
                <ShoppingBag size={20} className="text-black" strokeWidth={1.8} />
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  1
                </span>
              </button>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex border-b border-gray-100">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[13px] font-medium relative ${
                    isActive ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 찜한 상품 탭 */}
        {activeTab === '찜한 상품' && (
          <>
            {/* 카테고리 필터 */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
              {CATEGORY_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* 품절 제외 */}
            <div className="flex items-center gap-2 px-4 pb-3">
              <button
                onClick={() => setExcludeSoldOut((v) => !v)}
                className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                  excludeSoldOut ? 'bg-black border-black' : 'border-gray-300'
                }`}
              >
                {excludeSoldOut && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-[13px] text-gray-600">품절 제외</span>
            </div>

            {/* 상품 목록 */}
            {likedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Heart size={40} strokeWidth={1.2} className="mb-3" />
                <p className="text-[14px]">찜한 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4">
                {likedProducts.map((product) => (
                  <div key={product.id} className="flex flex-col">
                    <Link href={`/products/${product.id}`} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 block">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 430px) 50vw, 215px"
                      />
                      <button
                        onClick={(e) => { e.preventDefault(); toggleLike(product.id); }}
                        className="absolute bottom-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"
                      >
                        <Heart size={14} className="text-red-500" fill="currentColor" />
                      </button>
                    </Link>
                    <Link href={`/products/${product.id}`} className="mt-2">
                      <p className="text-[11px] text-gray-500 font-medium">{product.brand}</p>
                      <p className="text-[13px] text-black leading-snug mt-0.5 line-clamp-2">{product.name}</p>
                      <p className="text-[10px] text-[#8B7355] font-medium mt-1">예상구매가</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#FF3B30] text-[13px] font-bold">{product.discountRate}%</span>
                        <span className="text-black text-[13px] font-bold">
                          {product.price.toLocaleString('ko-KR')}
                        </span>
                        <span className="text-gray-400 text-[11px] line-through">
                          {product.originalPrice.toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-gray-500 border border-gray-200 rounded px-1.5 py-[1px]">
                        무료배송
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 찜한 스토어 탭 */}
        {activeTab === '찜한 스토어' && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <ShoppingBag size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-[14px]">찜한 스토어가 없습니다.</p>
          </div>
        )}

        {/* 최근 본 상품 탭 */}
        {activeTab === '최근 본 상품' && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Search size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-[14px]">최근 본 상품이 없습니다.</p>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
