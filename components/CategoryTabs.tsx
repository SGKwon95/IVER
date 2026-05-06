'use client';

import { categories } from '@/lib/mockData';

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="flex">
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onTabChange(cat.id)}
              className="relative flex-1 py-3 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span className={isActive ? 'text-black' : 'text-gray-400'}>
                {cat.name}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
