import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const now = new Date();

  const eventProducts = await prisma.eventProduct.findMany({
    where: {
      event: {
        isActive: true,
        startAt: { lte: now },
        endAt: { gte: now },
      },
    },
    select: {
      productId: true,
      discountType: true,
      discountValue: true,
      event: { select: { eventName: true } },
    },
  });

  const result = eventProducts.map((ep) => ({
    productId: ep.productId,
    discountType: ep.discountType,
    discountValue: Number(ep.discountValue),
    eventName: ep.event.eventName,
  }));

  return NextResponse.json(result);
}
