import { PrismaClient, CategoryType } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // 카테고리 seed
  await prisma.category.deleteMany();

  const mainCategories = [
    { id: 'home', name: '홈', type: CategoryType.MAIN, sortOrder: 0 },
    { id: 'ranking', name: '랭킹', type: CategoryType.MAIN, sortOrder: 1 },
    { id: 'event', name: '이벤트', type: CategoryType.MAIN, sortOrder: 2 },
    { id: 'mall', name: '쇼핑몰', type: CategoryType.MAIN, sortOrder: 3 },
    { id: 'brand', name: '브랜드', type: CategoryType.MAIN, sortOrder: 4 },
    { id: 'sports', name: '스포츠', type: CategoryType.MAIN, sortOrder: 5 },
  ];

  await Promise.all(
    mainCategories.map((cat) =>
      prisma.category.create({
        data: {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      })
    )
  );

  const subCategories = {
    mall: [
      { id: 'all', name: '쇼핑몰', sortOrder: 0 },
      { id: 'top', name: '상의', sortOrder: 1 },
      { id: 'pants', name: '바지', sortOrder: 2 },
      { id: 'outer', name: '아우터', sortOrder: 3 },
      { id: 'shoes', name: '신발', sortOrder: 4 },
      { id: 'hat', name: '모자', sortOrder: 5 },
      { id: 'fashion', name: '패션소품', sortOrder: 6 },
      { id: 'bag', name: '가방', sortOrder: 7 },
      { id: 'inner', name: '이너/홈웨어', sortOrder: 8 },
      { id: 'windbreaker', name: '바람막이', sortOrder: 9 },
      { id: 'hoodie', name: '후드집업', sortOrder: 10 },
      { id: 'cardigan', name: '가디건', sortOrder: 11 },
      { id: 'blazer', name: '블레이저', sortOrder: 12 },
      { id: 'safari', name: '야상/사파리', sortOrder: 13 },
      { id: 'blouson', name: '블루종/트루커', sortOrder: 14 },
    ],
    brand: [
      { id: 'all', name: '브랜드', sortOrder: 0 },
      { id: 'top', name: '상의', sortOrder: 1 },
      { id: 'pants', name: '바지', sortOrder: 2 },
      { id: 'outer', name: '아우터', sortOrder: 3 },
      { id: 'shoes', name: '신발', sortOrder: 4 },
      { id: 'hat', name: '모자', sortOrder: 5 },
      { id: 'fashion', name: '패션소품', sortOrder: 6 },
      { id: 'bag', name: '가방', sortOrder: 7 },
      { id: 'inner', name: '이너/홈웨어', sortOrder: 8 },
      { id: 'windbreaker', name: '바람막이', sortOrder: 9 },
      { id: 'hoodie', name: '후드집업', sortOrder: 10 },
      { id: 'cardigan', name: '가디건', sortOrder: 11 },
      { id: 'blazer', name: '블레이저', sortOrder: 12 },
      { id: 'safari', name: '야상/사파리', sortOrder: 13 },
      { id: 'blouson', name: '블루종/트루커', sortOrder: 14 },
    ],
    sports: [
      { id: 'all', name: '스포츠', sortOrder: 0 },
      { id: 'top', name: '상의', sortOrder: 1 },
      { id: 'pants', name: '바지', sortOrder: 2 },
      { id: 'outer', name: '아우터', sortOrder: 3 },
      { id: 'shoes', name: '신발', sortOrder: 4 },
      { id: 'hat', name: '모자', sortOrder: 5 },
      { id: 'accessories', name: '잡화', sortOrder: 6 },
      { id: 'bag', name: '가방', sortOrder: 7 },
      { id: 'swimwear', name: '스윔웨어', sortOrder: 8 },
      { id: 'equipment', name: '스포츠 용품', sortOrder: 9 },
      { id: 'etc', name: '기타', sortOrder: 10 },
      { id: 'short-sleeve', name: '반소매 티셔츠', sortOrder: 11 },
      { id: 'sleeveless', name: '민소매 티셔츠', sortOrder: 12 },
      { id: 'long-sleeve', name: '긴소매 티셔츠', sortOrder: 13 },
      { id: 'polo', name: '피케/카라 티셔츠', sortOrder: 14 },
    ],
  };

  for (const [parentId, subs] of Object.entries(subCategories)) {
    for (const sub of subs) {
      await prisma.category.create({
        data: {
          id: `${parentId}-${sub.id}`,
          name: sub.name,
          type: CategoryType.SUB,
          parentId,
          sortOrder: sub.sortOrder,
          isActive: true,
        },
      });
    }
  }

  // 테스트용 로그인 계정
  const existingLogin = await prisma.customerLogin.findUnique({
    where: { loginId: 'test' },
  });

  if (!existingLogin) {
    const customer = await prisma.customer.create({
      data: {
        email: 'test@test.com',
        custName: '테스트 사용자',
        userTypeCode: 'GENERAL',
        customerTypeCode: 'NORMAL',
        memberStatusCode: 'ACTIVE',
      },
    });

    await prisma.customerLogin.create({
      data: {
        customerId: customer.id,
        loginId: 'test',
        loginPw: 'test1234',
      },
    });

    console.log('Test login account created: test / test1234');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
