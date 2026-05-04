'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { products } from '@/lib/mockData';
import ProductCard from './ProductCard';
import { SlidersHorizontal } from 'lucide-react';

const PAGE_SIZE = 10;

export default function ProductGrid() {
  const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(products.length > PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const nextSlice = products.slice(0, nextPage * PAGE_SIZE);
      setDisplayedProducts(nextSlice);
      setPage(nextPage);
      if (nextSlice.length >= products.length) {
        setHasMore(false);
      }
      setLoading(false);
    }, 600);
  }, [loading, hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '0px 0px 200px 0px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="pb-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-3 py-3 mt-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-white">인기 상품</h2>
          <span className="text-[11px] text-gray-500">{products.length}개</span>
        </div>
        <button className="flex items-center gap-1.5 text-gray-400 text-[12px]">
          <SlidersHorizontal size={13} />
          <span>필터</span>
        </button>
      </div>

      {/* Sort Chips */}
      <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-hide">
        {['추천순', '인기순', '낮은가격순', '높은가격순', '최신순', '할인율순'].map((sort, i) => (
          <button
            key={sort}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
              i === 0
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-gray-400 border-[#2A2A2A]'
            }`}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-3">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading / End Sentinel */}
      <div ref={sentinelRef} className="flex justify-center items-center py-6 mt-2">
        {loading && (
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}
        {!hasMore && !loading && (
          <p className="text-gray-600 text-xs">마지막 상품입니다</p>
        )}
      </div>
    </div>
  );
}
