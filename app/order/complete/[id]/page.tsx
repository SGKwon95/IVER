'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

interface OrderItem {
  productName: string;
  colorName: string | null;
  sizeName: string | null;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: string;
  totalPrice: number;
  recipientName: string;
  address: string;
  addressDetail: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderCompletePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => { if (data.id) setOrder(data); });
  }, [params.id]);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-[14px]">주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  const item = order.items[0];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[430px] mx-auto px-4 pt-16 pb-10 flex flex-col items-center">

        {/* 완료 아이콘 */}
        <CheckCircle size={56} className="text-black mb-4" strokeWidth={1.5} />
        <h1 className="text-[20px] font-bold text-black mb-1">주문이 완료되었습니다</h1>
        <p className="text-[13px] text-gray-400 mb-8">주문번호: {order.id.slice(-8).toUpperCase()}</p>

        {/* 주문 요약 */}
        <div className="w-full bg-gray-50 rounded-xl p-4 flex flex-col gap-3 mb-6">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-black">{item.productName}</p>
            <p className="text-[12px] text-gray-500">
              {[item.colorName, item.sizeName].filter(Boolean).join(' / ')}
              {' · '}수량 {item.quantity}개
            </p>
          </div>
          <div className="border-t border-gray-200 pt-3 flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-500">배송지</span>
              <span className="text-black text-right">{order.recipientName}<br />{order.address} {order.addressDetail ?? ''}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold text-black">결제 금액</span>
              <span className="font-bold text-[15px] text-black">{order.totalPrice.toLocaleString('ko-KR')}원</span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-full h-12 bg-[#1A1A1A] text-white text-[15px] font-semibold rounded-md"
          >
            쇼핑 계속하기
          </button>
          <button
            onClick={() => router.push('/mypage')}
            className="w-full h-12 border border-gray-200 text-black text-[15px] font-medium rounded-md"
          >
            마이페이지
          </button>
        </div>
      </div>
    </div>
  );
}
