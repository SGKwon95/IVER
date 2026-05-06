'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart } from 'lucide-react';
import { products as allProducts } from '@/lib/mockData';

export default function TagResultPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const tagName = decodeURIComponent(params.name);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/tags/${encodeURIComponent(tagName)}/products`)
      .then((r) => r.json())
      .then((data) => { setProductIds(data.productIds ?? []); setLoading(false); });

    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;
    fetch(`/api/likes/product?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => setLikedIds(new Set(data.productIds)));
  }, [tagName]);

  const tagProducts = allProducts.filter((p) => productIds.includes(p.id));

  const handleLike = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.push('/login'); return; }
    const res = await fetch('/api/likes/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, productId }),
    });
    const data = await res.json();
    if (data.success) {
      setLikedIds((prev) => {
        const next = new Set(prev);
        data.liked ? next.add(productId) : next.delete(productId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-10">

        {/* 헤더 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={() => router.back()}>
              <ChevronLeft size={22} className="text-black" strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold text-black">{tagName}</h1>
            <div className="w-6" />
          </div>
        </div>

        {/* 상품 그리드 */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        ) : tagProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-[14px]">해당 태그의 상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-0 gap-y-0">
            {tagProducts.map((product) => (
              <div key={product.id} className="flex flex-col border-b border-r border-gray-100">
                <Link href={`/products/${product.id}`} className="relative aspect-square bg-gray-100 block">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 430px) 50vw, 215px"
                  />
                  <button
                    onClick={(e) => handleLike(e, product.id)}
                    className="absolute bottom-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"
                  >
                    <Heart
                      size={14}
                      className={likedIds.has(product.id) ? 'text-red-500' : 'text-gray-400'}
                      fill={likedIds.has(product.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </Link>
                <Link href={`/products/${product.id}`} className="p-3">
                  <p className="text-[11px] text-gray-500 font-medium">{product.brand}</p>
                  <p className="text-[12px] text-black leading-snug mt-0.5 line-clamp-2">{product.name}</p>
                  <p className="text-[10px] text-[#8B7355] font-medium mt-1.5">예상구매가</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[#FF3B30] text-[13px] font-bold">{product.discountRate}%</span>
                    <span className="text-black text-[13px] font-bold">{product.price.toLocaleString('ko-KR')}</span>
                  </div>
                  <p className="text-gray-400 text-[11px] line-through">{product.originalPrice.toLocaleString('ko-KR')}</p>
                  <span className="inline-block mt-1 text-[10px] text-gray-500 border border-gray-200 rounded px-1.5 py-[1px]">무료배송</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
