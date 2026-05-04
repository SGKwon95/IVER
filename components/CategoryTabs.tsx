'use client';

import { categories } from '@/lib/mockData';

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="bg-[#121212] border-b border-[#2A2A2A]">
      <div className="flex overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onTabChange(cat.id)}
              className="relative flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span className={isActive ? 'text-white' : 'text-gray-500'}>
                {cat.name}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
