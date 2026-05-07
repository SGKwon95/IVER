'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface OrderDraft {
  productId: string;
  productName: string;
  brand: string;
  imageUrl: string;
  colorName: string | null;
  sizeName: string | null;
  quantity: number;
  unitPrice: number;
}

interface Address {
  id: string;
  recipientName: string;
  postalCode: string;
  address: string;
  addressDetail: string | null;
  contactNo: string | null;
  isDefault: boolean;
}

const PAYMENT_METHODS = ['신용카드', '무통장입금'] as const;

export default function OrderPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [deliveryMemo, setDeliveryMemo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('신용카드');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('orderDraft');
    if (!raw) { router.replace('/'); return; }

    const parsed: OrderDraft = JSON.parse(raw);
    setDraft(parsed);

    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.replace('/login'); return; }

    fetch(`/api/customers/me?customerId=${customerId}`)
      .then((r) => r.json())
      .then((customer) => {
        if (!customer.id) { router.replace('/login'); return; }
      });

    fetch(`/api/customers/addresses?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        const list: Address[] = data.addresses ?? [];
        const defaultAddr = list.find((a) => a.isDefault) ?? list[0] ?? null;
        setAddress(defaultAddr);
      });
  }, [router]);

  const handleSubmit = async () => {
    if (!draft || !address) return;
    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.push('/login'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productId: draft.productId,
          productName: draft.productName,
          colorName: draft.colorName,
          sizeName: draft.sizeName,
          quantity: draft.quantity,
          unitPrice: draft.unitPrice,
          address: {
            recipientName: address.recipientName,
            postalCode: address.postalCode,
            address: address.address,
            addressDetail: address.addressDetail,
            contactNo: address.contactNo,
            deliveryMemo: deliveryMemo || null,
          },
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        sessionStorage.removeItem('orderDraft');
        router.push(`/order/complete/${data.orderId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!draft) return null;

  const totalPrice = draft.unitPrice * draft.quantity;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[430px] mx-auto bg-gray-50 pb-28">

        {/* 헤더 */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white sticky top-0 z-10 border-b border-gray-100">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft size={24} className="text-black" strokeWidth={2} />
          </button>
          <h1 className="text-[16px] font-semibold text-black">주문하기</h1>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white mt-2 px-4 py-4">
          <p className="text-[13px] font-semibold text-black mb-3">주문 상품</p>
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0">
              <Image src={draft.imageUrl} alt={draft.productName} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-[11px] text-gray-400">{draft.brand}</p>
              <p className="text-[13px] text-black font-medium leading-snug">{draft.productName}</p>
              <p className="text-[12px] text-gray-500">
                {[draft.colorName, draft.sizeName].filter(Boolean).join(' / ')}
                {' · '}수량 {draft.quantity}개
              </p>
              <p className="text-[14px] font-bold text-black">{draft.unitPrice.toLocaleString('ko-KR')}원</p>
            </div>
          </div>
        </div>

        {/* 배송지 */}
        <div className="bg-white mt-2 px-4 py-4">
          <p className="text-[13px] font-semibold text-black mb-3">배송지</p>
          {address ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-black">{address.recipientName}</p>
                {address.isDefault && (
                  <span className="text-[11px] text-white bg-black rounded px-1.5 py-[2px]">기본</span>
                )}
              </div>
              <p className="text-[13px] text-gray-600">{address.address} {address.addressDetail ?? ''}</p>
              <p className="text-[13px] text-gray-400">{address.contactNo}</p>
            </div>
          ) : (
            <p className="text-[13px] text-gray-400">등록된 배송지가 없습니다. 마이페이지에서 배송지를 추가해 주세요.</p>
          )}

          {/* 배송 메모 */}
          <div className="mt-3">
            <select
              value={deliveryMemo}
              onChange={(e) => setDeliveryMemo(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-md px-3 text-[13px] text-black bg-white"
            >
              <option value="">배송 메모 선택</option>
              <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
              <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
              <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
              <option value="부재 시 문자 남겨주세요">부재 시 문자 남겨주세요</option>
            </select>
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="bg-white mt-2 px-4 py-4">
          <p className="text-[13px] font-semibold text-black mb-3">결제 수단</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`h-11 rounded-md border text-[13px] font-medium transition-colors ${
                  paymentMethod === method
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-black'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="bg-white mt-2 px-4 py-4">
          <p className="text-[13px] font-semibold text-black mb-3">결제 금액</p>
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-500">상품 금액</span>
              <span className="text-black">{(draft.unitPrice * draft.quantity).toLocaleString('ko-KR')}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">배송비</span>
              <span className="text-black">무료</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-1">
              <span className="font-semibold text-black">총 결제 금액</span>
              <span className="font-bold text-[16px] text-black">{totalPrice.toLocaleString('ko-KR')}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-100">
        <div className="max-w-[430px] mx-auto px-4 py-3">
          <button
            onClick={handleSubmit}
            disabled={loading || !address}
            className={`w-full h-12 rounded-md text-[15px] font-semibold transition-colors ${
              loading || !address ? 'bg-gray-200 text-gray-400' : 'bg-[#1A1A1A] text-white'
            }`}
          >
            {loading ? '처리 중...' : `${totalPrice.toLocaleString('ko-KR')}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}
