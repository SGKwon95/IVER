import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const store = await prisma.store.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      storeName: true,
      products: {
        where: { isActive: true },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: store.id,
    storeName: store.storeName,
    productIds: store.products.map((p) => p.id),
  });
}
