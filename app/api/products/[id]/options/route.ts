import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [colors, sizes, stocks] = await Promise.all([
    prisma.productColor.findMany({
      where: { productId: params.id, isActive: true },
      include: { color: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.productSize.findMany({
      where: { productId: params.id, isActive: true },
      include: { size: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.productStock.findMany({
      where: { productId: params.id, isActive: true },
    }),
  ]);

  return NextResponse.json({
    colors: colors.map((c) => ({ id: c.colorId, colorName: c.color.colorName, category: c.color.category })),
    sizes: sizes.map((s) => ({ id: s.sizeId, sizeEn: s.size.sizeEn, sizeKo: s.size.sizeKo })),
    stocks: stocks.map((s) => ({
      colorId: s.colorId,
      sizeId: s.sizeId,
      stockCount: s.stockCount,
      additionalPrice: Number(s.additionalPrice),
    })),
  });
}
