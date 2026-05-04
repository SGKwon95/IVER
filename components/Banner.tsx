'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { banners } from '@/lib/mockData';

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, 3500);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#1A1A1A]"
      style={{ aspectRatio: '16/7' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative min-w-full h-full">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority={banner.id === 'banner-1'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-4 right-16">
              <p className="text-white text-lg font-bold leading-tight">{banner.title}</p>
              <p className="text-gray-300 text-xs mt-1">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Counter badge */}
      <div className="absolute bottom-4 right-4 bg-black/50 rounded-full px-2.5 py-1 flex items-center gap-1">
        <span className="text-white text-xs font-semibold">{currentIndex + 1}</span>
        <span className="text-gray-400 text-xs">/</span>
        <span className="text-gray-400 text-xs">{banners.length}</span>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`배너 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
