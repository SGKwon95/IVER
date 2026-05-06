import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get('customerId');
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      custName: true,
      customerTypeCode: true,
      point: true,
      email: true,
    },
  });

  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(customer);
}
