import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { customerId, productId, productName, colorName, sizeName, quantity, unitPrice, address } = body as {
    customerId: string;
    productId: string;
    productName: string;
    colorName?: string;
    sizeName?: string;
    quantity: number;
    unitPrice: number;
    address: {
      recipientName: string;
      postalCode: string;
      address: string;
      addressDetail?: string;
      contactNo?: string;
      deliveryMemo?: string;
    };
  };

  if (!customerId || !productId || !productName || !quantity || !unitPrice || !address?.recipientName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const totalPrice = unitPrice * quantity;

  const order = await prisma.order.create({
    data: {
      customerId,
      totalPrice,
      recipientName: address.recipientName,
      postalCode: address.postalCode,
      address: address.address,
      addressDetail: address.addressDetail ?? null,
      contactNo: address.contactNo ?? null,
      deliveryMemo: address.deliveryMemo ?? null,
      items: {
        create: {
          productId,
          productName,
          colorName: colorName ?? null,
          sizeName: sizeName ?? null,
          quantity,
          unitPrice,
          totalPrice,
        },
      },
    },
  });

  return NextResponse.json({ success: true, orderId: order.id });
}
