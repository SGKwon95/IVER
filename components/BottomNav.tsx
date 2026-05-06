'use client';

import { usePathname } from 'next/navigation';
import { Home, Menu, Heart, User } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { icon: Home, label: '홈', id: 'home', href: '/' },
  { icon: Menu, label: '카테고리', id: 'category', href: '/categories' },
  { icon: Heart, label: '찜', id: 'like', href: '/likes' },
  { icon: User, label: '마이페이지', id: 'mypage', href: '/mypage' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const customerId = typeof window !== 'undefined' ? localStorage.getItem('customerId') : null;

  const getMypageHref = () => {
    return customerId ? '/mypage' : '/login';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="max-w-[430px] mx-auto flex">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const href = item.id === 'mypage' ? getMypageHref() : item.href;
          return (
            <Link
              key={item.id}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? 'text-black' : 'text-gray-400'}
                fill={isActive && item.id === 'like' ? 'currentColor' : 'none'}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
