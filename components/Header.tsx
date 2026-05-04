'use client';

import { Search, ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212] border-b border-[#2A2A2A]">
      <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 h-12">
        <div className="text-white text-xl font-black tracking-[0.15em]">
          IVER
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-gray-300 transition-colors" aria-label="검색">
            <Search size={20} strokeWidth={1.8} />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors relative" aria-label="장바구니">
            <ShoppingBag size={20} strokeWidth={1.8} />
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
