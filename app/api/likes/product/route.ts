import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get('customerId');
  if (!customerId) return NextResponse.json({ productIds: [] });

  const likes = await prisma.productLike.findMany({
    where: { customerId },
    select: { productId: true },
  });

  return NextResponse.json({ productIds: likes.map((l) => l.productId) });
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, productId } = await request.json();

    if (!customerId || !productId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const existing = await prisma.productLike.findUnique({
      where: { customerId_productId: { customerId, productId } },
    });

    if (existing) {
      await prisma.productLike.delete({
        where: { customerId_productId: { customerId, productId } },
      });
      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.productLike.create({
        data: { customerId, productId },
      });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
