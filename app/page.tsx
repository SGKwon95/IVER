'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import Banner from '@/components/Banner';
import ProductGrid from '@/components/ProductGrid';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header />

      {/* Max-width content container */}
      <div className="max-w-[430px] mx-auto">
        {/* Sticky tabs below header (top-24 = 96px: 로고행 48px + 검색창행 48px) */}
        <div className="sticky top-24 z-40">
          <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* pt-24: header height(96px), pb-16: bottom nav height */}
        <main className="pt-24 pb-16">
          <Banner />
          <div className="mt-6" />
          <ProductGrid />
        </main>
      </div>

      {/* Fixed Bottom Nav */}
      <BottomNav />
    </div>
  );
}
