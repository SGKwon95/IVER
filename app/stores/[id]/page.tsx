'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Home, ShoppingCart, Star, Search, Heart, ArrowUpDown } from 'lucide-react';
import { products as allProducts } from '@/lib/mockData';

const TABS = ['상품', '스토어 정보'] as const;
type Tab = typeof TABS[number];

interface StoreInfo {
  id: string;
  storeName: string;
  productIds: string[];
}

export default function StoreHomePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('상품');
  const [storeLiked, setStoreLiked] = useState(false);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`/api/stores/${params.id}`)
      .then((r) => r.json())
      .then((data) => { if (!data.error) setStoreInfo(data); });
  }, [params.id]);

  const storeProducts = storeInfo
    ? allProducts.filter((p) => storeInfo.productIds.includes(p.id))
    : [];

  const filtered = search.trim()
    ? storeProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : storeProducts;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-10">

        {/* 헤더 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={() => router.back()}>
              <ChevronLeft size={22} className="text-black" strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold text-black">스토어 홈</h1>
            <div className="flex items-center gap-3">
              <Link href="/"><Home size={20} className="text-black" strokeWidth={1.8} /></Link>
              <button className="relative">
                <ShoppingCart size={20} className="text-black" strokeWidth={1.8} />
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* 스토어 정보 */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-[13px] font-black flex-shrink-0">
              AM
            </div>
            <div>
              <p className="text-[15px] font-bold text-black">{storeInfo?.storeName ?? '...'}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">IVER_STORE</p>
            </div>
          </div>
          <button
            onClick={() => setStoreLiked((v) => !v)}
            className="flex flex-col items-center gap-0.5"
          >
            <Star
              size={20}
              className={storeLiked ? 'text-yellow-400' : 'text-gray-300'}
              fill={storeLiked ? 'currentColor' : 'none'}
            />
            <span className="text-[10px] text-gray-400">{storeLiked ? 1 : 0}</span>
          </button>
        </div>

        {/* 스토어 소개 */}
        <p className="px-4 text-[13px] text-gray-600 pb-3 border-b border-gray-100">
          안녕하세요 {storeInfo?.storeName ?? ''} 입니다
        </p>

        {/* 탭 */}
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[14px] font-medium relative ${isActive ? 'text-[#FF6B00]' : 'text-gray-400'}`}
              >
                {tab}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]" />}
              </button>
            );
          })}
        </div>

        {activeTab === '상품' && (
          <>
            {/* 검색창 */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 h-9">
                <Search size={14} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="스토어 내 상품 검색"
                  className="flex-1 bg-transparent text-[13px] text-black placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            {/* 필터 바 */}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-[13px] font-bold text-black">ALL</span>
              <button className="flex items-center gap-1 text-[12px] text-gray-500">
                <ArrowUpDown size={13} />
                최신순
              </button>
            </div>

            {/* 상품 그리드 */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4">
              {filtered.map((product) => (
                <div key={product.id} className="flex flex-col">
                  <Link href={`/products/${product.id}`} className="relative aspect-square rounded-sm overflow-hidden bg-gray-100 block">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 430px) 50vw, 215px"
                    />
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute bottom-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"
                    >
                      <Heart size={14} className="text-gray-400" />
                    </button>
                  </Link>
                  <Link href={`/products/${product.id}`} className="mt-2">
                    <p className="text-[11px] text-gray-500 font-medium">{product.brand}</p>
                    <p className="text-[13px] text-black leading-snug mt-0.5 line-clamp-2">{product.name}</p>
                    <p className="text-[10px] text-[#8B7355] font-medium mt-1">예상구매가</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[#FF3B30] text-[13px] font-bold">{product.discountRate}%</span>
                      <span className="text-black text-[13px] font-bold">{product.price.toLocaleString('ko-KR')}</span>
                      <span className="text-gray-400 text-[11px] line-through">{product.originalPrice.toLocaleString('ko-KR')}</span>
                    </div>
                    <span className="inline-block mt-1 text-[10px] text-gray-500 border border-gray-200 rounded px-1.5 py-[1px]">무료배송</span>
                  </Link>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 flex justify-center py-16 text-gray-400 text-[14px]">
                  상품이 없습니다.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === '스토어 정보' && (
          <div className="px-4 py-6 flex flex-col gap-3 text-[13px]">
            {[
              ['스토어명', storeInfo?.storeName ?? '-'],
              ['판매자 유형', '법인'],
              ['배송', '무료배송'],
              ['반품/교환', '수령 후 7일 이내'],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4">
                <span className="text-gray-400 w-24 shrink-0">{label}</span>
                <span className="text-black">{value}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
