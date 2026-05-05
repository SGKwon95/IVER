'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { categoryMenus } from '@/lib/mockData';

export default function CategoriesPage() {
  const [activeId, setActiveId] = useState(categoryMenus[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  const updateActiveFromScroll = useCallback(() => {
    if (isClickScrolling.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const threshold = container.getBoundingClientRect().top + 60;
    let currentId = categoryMenus[0].id;

    for (const cat of categoryMenus) {
      const el = sectionRefs.current[cat.id];
      if (el && el.getBoundingClientRect().top <= threshold) {
        currentId = cat.id;
      }
    }
    setActiveId(currentId);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    return () => container.removeEventListener('scroll', updateActiveFromScroll);
  }, [updateActiveFromScroll]);

  const handleCategoryClick = (id: string) => {
    setActiveId(id);
    const el = sectionRefs.current[id];
    const container = scrollContainerRef.current;
    if (!el || !container) return;

    isClickScrolling.current = true;
    container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
  };

  return (
    <div className="bg-[#121212]">
      <Header />
      <BottomNav />

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
                onClick={() => handleCategoryClick(cat.id)}
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

        {/* 우측: 전체 카테고리 연속 스크롤 */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide bg-[#121212]"
        >
          {categoryMenus.map((cat) => (
            <div
              key={cat.id}
              data-category-id={cat.id}
              ref={(el) => { sectionRefs.current[cat.id] = el; }}
            >

              {/* 소분류 리스트 */}
              {cat.subCategories.map((sub) => (
                <button
                  key={`${cat.id}-${sub.id}`}
                  className="w-full flex items-center justify-between px-5 py-[15px] border-b border-[#1E1E1E]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-white">{sub.name}</span>
                  </div>
                  <ChevronRight size={15} className="text-gray-600" strokeWidth={1.8} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
