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
    <div className="min-h-screen bg-[#121212]">
      {/* Fixed Header */}
      <Header />

      {/* Max-width content container */}
      <div className="max-w-[430px] mx-auto">
        {/* Sticky tabs below header (top-12 = header height 48px) */}
        <div className="sticky top-12 z-40">
          <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Scrollable main content */}
        {/* pt-12: header height, pb-16: bottom nav height */}
        <main className="pt-12 pb-16">
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
