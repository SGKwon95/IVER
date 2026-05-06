import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { name: string } }) {
  const tagName = decodeURIComponent(params.name);

  const tag = await prisma.tag.findFirst({
    where: { tagName, isActive: true },
    select: { tagValue: true },
  });

  if (!tag) return NextResponse.json({ productIds: [] });

  const tagValue = Number(tag.tagValue);

  // tags 비트마스크에 해당 태그 포함된 상품 조회 (raw query - Prisma는 비트 연산 미지원)
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM product
    WHERE is_active = true
      AND (tags::bigint & ${tagValue}::bigint) = ${tagValue}::bigint
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ tagName, productIds: rows.map((r) => r.id) });
}
