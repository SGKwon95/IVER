import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/node_modules/@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loginId, loginPw } = body;

    if (!loginId || !loginPw) {
      return NextResponse.json(
        { success: false, message: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const customerLogin = await prisma.customerLogin.findUnique({
      where: { loginId },
      include: { customer: true },
    });

    if (!customerLogin) {
      return NextResponse.json(
        { success: false, message: '아이디가 존재하지 않습니다.' },
        { status: 401 }
      );
    }

    if (customerLogin.loginPw !== loginPw) {
      return NextResponse.json(
        { success: false, message: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    await prisma.customer.update({
      where: { id: customerLogin.customerId },
      data: { lastLoginAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: '로그인 성공',
      data: {
        customerId: customerLogin.customerId,
        customer: customerLogin.customer,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
