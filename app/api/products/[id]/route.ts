import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      tags: true,
      store: {
        select: {
          id: true,
          storeName: true,
          tags: {
            where: { isActive: true },
            select: { tagName: true, tagValue: true },
            orderBy: { tagValue: 'asc' },
          },
        },
      },
    },
  });

  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // product.tags 비트마스크에 해당하는 태그만 필터링 (0이면 전체 반환)
  const productTagMask = Number(product.tags);
  const matchedTags = (product.store?.tags ?? [])
    .filter((t) => productTagMask === 0 || (productTagMask & Number(t.tagValue)) !== 0)
    .map((t) => t.tagName);

  return NextResponse.json({
    id: product.id,
    store: product.store ? { id: product.store.id, storeName: product.store.storeName } : null,
    tags: matchedTags,
  });
}
