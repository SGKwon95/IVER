'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { categoryMenus } from '@/lib/mockData';

export default function CategoriesPage() {
  const [activeId, setActiveId] = useState('mall');

  const activeCategory = categoryMenus.find((c) => c.id === activeId)!;

  return (
    <div className="bg-[#121212]">
      <Header />
      <BottomNav />

      {/* 헤더(96px)와 하단 네비(58px) 사이를 꽉 채우는 2열 레이아웃 */}
      <div
        className="max-w-[430px] mx-auto flex overflow-hidden"
        style={{ marginTop: '96px', height: 'calc(100dvh - 96px - 58px)' }}
      >
        {/* 좌측 대분류 사이드바 */}
        <aside className="w-[100px] flex-shrink-0 overflow-y-auto scrollbar-hide bg-[#1A1A1A]">
          {categoryMenus.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className={`w-full py-6 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#121212] text-white font-bold'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </aside>

        {/* 우측 소분류 리스트 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#121212]">
          {activeCategory.subCategories.map((sub, index) => (
            <button
              key={sub.id}
              className={`w-full flex items-center justify-between px-5 py-[15px] border-b border-[#1E1E1E] ${
                index === 0 ? 'border-t border-t-[#1E1E1E]' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-white">{sub.name}</span>
                {sub.isAll && (
                  <span className="text-[10px] text-gray-500 border border-gray-600 rounded-[3px] px-1.5 py-[2px] leading-none">
                    전체
                  </span>
                )}
              </div>
              <ChevronRight size={15} className="text-gray-600" strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
