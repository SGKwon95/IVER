import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get('customerId');
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const addresses = await prisma.customerAddress.findMany({
    where: { customerId, isActive: true },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
  });

  return NextResponse.json({ addresses });
}
