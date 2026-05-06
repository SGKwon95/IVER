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
      mobileNo: true,
      birthDate: true,
      genderCode: true,
      height: true,
      weight: true,
      marketingYn: true,
      notificationYn: true,
      login: { select: { loginId: true } },
    },
  });

  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    ...customer,
    height: customer.height ? Number(customer.height) : null,
    weight: customer.weight ? Number(customer.weight) : null,
    loginId: customer.login?.loginId ?? null,
  });
}

export async function PATCH(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { customerId, custName, mobileNo, birthDate, genderCode, height, weight } = body as {
    customerId?: string;
    custName?: string;
    mobileNo?: string;
    birthDate?: string | null;
    genderCode?: string | null;
    height?: string | number | null;
    weight?: string | number | null;
  };

  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const exists = await prisma.customer.findUnique({ where: { id: customerId }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data: Record<string, unknown> = {};

  if (custName !== undefined) {
    const trimmed = String(custName).trim();
    if (trimmed.length > 100) {
      return NextResponse.json({ error: '이름은 100자 이하로 입력해 주세요.' }, { status: 400 });
    }
    data.custName = trimmed;
  }

  if (mobileNo !== undefined) {
    const digits = String(mobileNo).replace(/[^0-9]/g, '');
    if (digits && (digits.length < 10 || digits.length > 11)) {
      return NextResponse.json({ error: '휴대폰 번호는 10~11자리 숫자여야 합니다.' }, { status: 400 });
    }
    data.mobileNo = digits || null;
  }

  if (birthDate !== undefined) {
    if (birthDate === null || birthDate === '') {
      data.birthDate = null;
    } else {
      const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
      const eightDigit = /^\d{8}$/.test(birthDate);
      let iso: string | null = null;
      if (isoMatch) iso = birthDate;
      else if (eightDigit) iso = `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`;
      else return NextResponse.json({ error: '생년월일 형식이 올바르지 않습니다.' }, { status: 400 });

      const d = new Date(iso);
      if (isNaN(d.getTime()) || d > new Date() || d < new Date('1900-01-01')) {
        return NextResponse.json({ error: '유효하지 않은 생년월일입니다.' }, { status: 400 });
      }
      data.birthDate = d;
    }
  }

  if (genderCode !== undefined) {
    if (genderCode !== null && !['MALE', 'FEMALE'].includes(genderCode)) {
      return NextResponse.json({ error: '성별 값이 올바르지 않습니다.' }, { status: 400 });
    }
    data.genderCode = genderCode;
  }

  if (height !== undefined) {
    if (height === null || height === '') {
      data.height = null;
    } else {
      const n = Number(height);
      if (!Number.isFinite(n) || n < 50 || n > 250) {
        return NextResponse.json({ error: '키는 50~250cm 범위여야 합니다.' }, { status: 400 });
      }
      data.height = n;
    }
  }

  if (weight !== undefined) {
    if (weight === null || weight === '') {
      data.weight = null;
    } else {
      const n = Number(weight);
      if (!Number.isFinite(n) || n < 20 || n > 300) {
        return NextResponse.json({ error: '몸무게는 20~300kg 범위여야 합니다.' }, { status: 400 });
      }
      data.weight = n;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: true, id: customerId, updated: 0 });
  }

  try {
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data,
      select: {
        id: true,
        custName: true,
        mobileNo: true,
        birthDate: true,
        genderCode: true,
        height: true,
        weight: true,
      },
    });
    return NextResponse.json({
      success: true,
      id: updated.id,
      customer: {
        ...updated,
        height: updated.height ? Number(updated.height) : null,
        weight: updated.weight ? Number(updated.weight) : null,
      },
    });
  } catch (e) {
    console.error('PATCH /api/customers/me failed', e);
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 회원 탈퇴 (soft delete: member_status_code = WITHDRAWN, withdrawn_at = NOW())
export async function DELETE(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get('customerId');
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const exists = await prisma.customer.findUnique({ where: { id: customerId }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      memberStatusCode: 'WITHDRAWN',
      withdrawnAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
