'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/mockData';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(product.isLiked);

  return (
    <div className="flex flex-col">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-[#1A1A1A]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 430px) 50vw, 215px"
        />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute bottom-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform active:scale-90"
          aria-label={liked ? '찜 해제' : '찜하기'}
        >
          <Heart
            size={14}
            className={liked ? 'text-red-500' : 'text-white'}
            fill={liked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-[11px] text-gray-500 font-medium">{product.brand}</p>
        <p className="text-[13px] text-white leading-snug mt-0.5 line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[#FF3B30] text-sm font-bold">{product.discountRate}%</span>
          <span className="text-white text-sm font-bold">
            {product.price.toLocaleString('ko-KR')}원
          </span>
        </div>
        <p className="text-gray-600 text-[11px] line-through mt-0.5">
          {product.originalPrice.toLocaleString('ko-KR')}원
        </p>
      </div>
    </div>
  );
}
