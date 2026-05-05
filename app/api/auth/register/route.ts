import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/node_modules/@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loginId, loginPw, email, custName } = body;

    if (!loginId || !loginPw || !email || !custName) {
      return NextResponse.json(
        { success: false, message: '모든 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    const existing = await prisma.customerLogin.findUnique({
      where: { loginId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: '이미 사용 중인 아이디입니다.' },
        { status: 409 }
      );
    }

    const existingEmail = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        email,
        custName,
        userTypeCode: 'GENERAL',
        customerTypeCode: 'NORMAL',
        memberStatusCode: 'ACTIVE',
        marketingYn: false,
        notificationYn: false,
      },
    });

    await prisma.customerLogin.create({
      data: {
        customerId: customer.id,
        loginId,
        loginPw,
      },
    });

    return NextResponse.json({
      success: true,
      message: '회원가입 성공',
      data: { customerId: customer.id },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
