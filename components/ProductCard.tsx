'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/mockData';

interface EventDiscount {
  discountType: string;
  discountValue: number;
  eventName: string;
}

interface ProductCardProps {
  product: Product;
  initialLiked?: boolean;
  eventDiscount?: EventDiscount;
}

export default function ProductCard({ product, initialLiked, eventDiscount }: ProductCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked ?? product.isLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialLiked !== undefined) setLiked(initialLiked);
  }, [initialLiked]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/likes/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, productId: product.id }),
      });
      const data = await res.json();
      if (data.success) setLiked(data.liked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Link href={`/products/${product.id}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 block">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 430px) 50vw, 215px"
        />
        <button
          onClick={handleLike}
          disabled={loading}
          className="absolute bottom-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform active:scale-90"
          aria-label={liked ? '찜 해제' : '찜하기'}
        >
          <Heart
            size={14}
            className={liked ? 'text-red-500' : 'text-white'}
            fill={liked ? 'currentColor' : 'none'}
          />
        </button>
      </Link>

      <Link href={`/products/${product.id}`} className="mt-2 px-0.5">
        <p className="text-[11px] text-gray-500 font-medium">{product.brand}</p>
        <p className="text-[13px] text-black leading-snug mt-0.5 line-clamp-2">{product.name}</p>
        {(() => {
          if (!eventDiscount) {
            return (
              <>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[#FF3B30] text-sm font-bold">{product.discountRate}%</span>
                  <span className="text-black text-sm font-bold">{product.price.toLocaleString('ko-KR')}원</span>
                </div>
                <p className="text-gray-600 text-[11px] line-through mt-0.5">{product.originalPrice.toLocaleString('ko-KR')}원</p>
              </>
            );
          }
          const eventPrice = eventDiscount.discountType === 'RATE'
            ? Math.round(product.originalPrice * (1 - eventDiscount.discountValue / 100) / 100) * 100
            : Math.max(0, product.originalPrice - eventDiscount.discountValue);
          const eventRate = eventDiscount.discountType === 'RATE'
            ? eventDiscount.discountValue
            : Math.round((eventDiscount.discountValue / product.originalPrice) * 100);
          return (
            <>
              <span className="inline-block text-[10px] font-bold text-white bg-[#FF3B30] px-1.5 py-0.5 rounded mt-1.5">
                {eventDiscount.eventName}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[#FF3B30] text-sm font-bold">{eventRate}%</span>
                <span className="text-black text-sm font-bold">{eventPrice.toLocaleString('ko-KR')}원</span>
              </div>
              <p className="text-gray-600 text-[11px] line-through mt-0.5">{product.originalPrice.toLocaleString('ko-KR')}원</p>
            </>
          );
        })()}
      </Link>
    </div>
  );
}
