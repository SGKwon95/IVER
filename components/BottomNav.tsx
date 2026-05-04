'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, Heart, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: '홈', id: 'home', href: '/' },
  { icon: Grid2X2, label: '카테고리', id: 'category', href: '/categories' },
  { icon: Heart, label: '찜', id: 'like', href: '/likes' },
  { icon: User, label: '마이페이지', id: 'mypage', href: '/mypage' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-[#2A2A2A]">
      <div className="max-w-[430px] mx-auto flex">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? 'text-white' : 'text-gray-500'}
                fill={isActive && item.id === 'like' ? 'currentColor' : 'none'}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
