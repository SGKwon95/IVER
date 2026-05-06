'use client';

import { Search, ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212] border-b border-[#2A2A2A]">
      <div className="max-w-[430px] mx-auto">
        {/* Row 1: 로고 + 장바구니 */}
        <div className="flex items-center justify-between px-4 h-12">
          <div className="text-white text-xl font-black tracking-[0.15em]">
            IVER
          </div>
          <button className="text-white hover:text-gray-300 transition-colors relative" aria-label="장바구니">
            <ShoppingCart size={20} strokeWidth={1.8} />
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Row 2: 검색창 */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2.5 bg-[#1E1E1E] rounded-full px-4 h-9">
            <Search size={14} className="text-gray-500 flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="브랜드, 상품명을 검색해보세요"
              className="flex-1 bg-transparent text-[13px] text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
