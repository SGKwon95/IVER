import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

const productData = [
  { brand: 'Nike', name: '에어 포스 1 로우 \'07 화이트', originalPrice: 119000, discountRate: 15 },
  { brand: 'Adidas', name: '스탠 스미스 클라우드화이트', originalPrice: 109000, discountRate: 20 },
  { brand: 'New Balance', name: '993 메이드 인 USA', originalPrice: 299000, discountRate: 10 },
  { brand: 'The North Face', name: '눕시 다운 재킷 블랙', originalPrice: 399000, discountRate: 30 },
  { brand: 'MLB', name: 'NY 볼캡 뉴욕 양키스', originalPrice: 49000, discountRate: 25 },
  { brand: 'Nike', name: '에어 맥스 90 화이트/블랙', originalPrice: 149000, discountRate: 18 },
  { brand: 'Adidas', name: '가젤 볼드 베이지', originalPrice: 119000, discountRate: 22 },
  { brand: 'Converse', name: '척 테일러 올스타 로우 블랙', originalPrice: 79000, discountRate: 35 },
  { brand: 'Vans', name: '올드스쿨 블랙/화이트', originalPrice: 89000, discountRate: 28 },
  { brand: 'New Balance', name: '574 레거시 네이비', originalPrice: 129000, discountRate: 12 },
  { brand: 'Salomon', name: 'XT-6 어드밴스드 그레이', originalPrice: 239000, discountRate: 15 },
  { brand: 'PUMA', name: '스피드캣 OG 화이트/블랙', originalPrice: 109000, discountRate: 40 },
  { brand: 'Jordan', name: '에어 조던 1 미드 화이트', originalPrice: 189000, discountRate: 5 },
  { brand: 'Reebok', name: '클래식 레더 빈티지', originalPrice: 99000, discountRate: 30 },
  { brand: 'Asics', name: '젤-카야노 14 크림/스카이', originalPrice: 179000, discountRate: 20 },
  { brand: 'Stone Island', name: '코튼 피케 폴로 셔츠', originalPrice: 450000, discountRate: 25 },
  { brand: 'AMI', name: '하트 로고 오버핏 후디 그레이', originalPrice: 380000, discountRate: 15 },
  { brand: 'Kappa', name: '밴드 트랙 자켓 블랙', originalPrice: 89000, discountRate: 45 },
  { brand: 'Columbia', name: '와봐즈 인피니티 자켓', originalPrice: 299000, discountRate: 35 },
  { brand: 'K-Swiss', name: '클래식 VN 화이트', originalPrice: 79000, discountRate: 50 },
  { brand: 'Nike', name: '드라이핏 ADV 런 디비전', originalPrice: 89000, discountRate: 20 },
  { brand: 'Adidas', name: '울트라부스트 22 런닝화', originalPrice: 219000, discountRate: 30 },
  { brand: 'New Balance', name: '1906R 실버/그레이', originalPrice: 189000, discountRate: 10 },
  { brand: 'MLB', name: '모노그램 미니백 베이지', originalPrice: 69000, discountRate: 20 },
  { brand: 'Dickies', name: '874 워크 팬츠 블랙', originalPrice: 79000, discountRate: 25 },
  { brand: 'Carhartt WIP', name: '더블 니 팬츠 스톤', originalPrice: 189000, discountRate: 15 },
  { brand: 'Nike', name: '나이키 테크 플리스 조거', originalPrice: 129000, discountRate: 10 },
  { brand: 'Adidas', name: '트레포일 트랙 탑 블랙', originalPrice: 99000, discountRate: 30 },
  { brand: 'Jordan', name: '에어 조던 4 레트로 블랙', originalPrice: 299000, discountRate: 8 },
  { brand: 'New Balance', name: '327 레이스업 베이지/화이트', originalPrice: 109000, discountRate: 18 },
  { brand: 'The North Face', name: '마운틴 자켓 GTX', originalPrice: 599000, discountRate: 20 },
  { brand: 'Converse', name: '런스타 하이크 하이 블랙', originalPrice: 109000, discountRate: 15 },
  { brand: 'Vans', name: '에라 95 DX 화이트/그린', originalPrice: 99000, discountRate: 22 },
  { brand: 'PUMA', name: '슈퍼팀 OG 화이트/블루', originalPrice: 129000, discountRate: 35 },
  { brand: 'Salomon', name: 'ACS+ 스니커즈 블랙', originalPrice: 199000, discountRate: 12 },
  { brand: 'Reebok', name: '인스타펌프 퓨리 OG', originalPrice: 179000, discountRate: 25 },
  { brand: 'Asics', name: '젤-님버스 25 화이트', originalPrice: 199000, discountRate: 15 },
  { brand: 'Nike', name: '코르테즈 블랙/레드', originalPrice: 109000, discountRate: 28 },
  { brand: 'Adidas', name: '삼바 OG 화이트/블랙', originalPrice: 119000, discountRate: 5 },
  { brand: 'New Balance', name: '2002R 그레이/화이트', originalPrice: 159000, discountRate: 20 },
  { brand: 'MLB', name: '빅볼청키 스니커즈 화이트', originalPrice: 109000, discountRate: 30 },
  { brand: 'Dickies', name: '그래픽 후드 스웨트셔츠', originalPrice: 69000, discountRate: 40 },
  { brand: 'Carhartt WIP', name: 'OG 액티브 자켓 블랙', originalPrice: 259000, discountRate: 18 },
  { brand: 'Jordan', name: '에어 조던 3 레트로 화이트/세멘트', originalPrice: 269000, discountRate: 10 },
  { brand: 'Nike', name: 'SB 덩크 로우 화이트/블랙', originalPrice: 139000, discountRate: 12 },
  { brand: 'Adidas', name: '포럼 로우 클라우드화이트', originalPrice: 109000, discountRate: 25 },
  { brand: 'New Balance', name: '550 화이트/그린', originalPrice: 139000, discountRate: 15 },
  { brand: 'Vans', name: '스케이트 하이 블랙', originalPrice: 99000, discountRate: 20 },
  { brand: 'PUMA', name: '클로이 유니섹스 스니커즈', originalPrice: 149000, discountRate: 38 },
  { brand: 'Salomon', name: 'SPEEDCROSS 6 트레일화', originalPrice: 189000, discountRate: 22 },
];

async function main() {
  const client = await pool.connect();
  try {
    // 더미 스토어 생성
    const storeId = 'store-iver-default';
    await client.query(`
      INSERT INTO store (id, store_name, store_status_code, created_at, updated_at)
      VALUES ($1, 'IVER 공식 스토어', 'OPEN', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [storeId]);
    console.log('스토어 생성 완료:', storeId);

    // 상품 insert
    for (let i = 0; i < productData.length; i++) {
      const { name, originalPrice, discountRate } = productData[i];
      const id = `product-${i + 1}`;
      const basePrice = Math.round((originalPrice * (1 - discountRate / 100)) / 100) * 100;

      await client.query(`
        INSERT INTO product (id, store_id, product_status_code, product_name, base_price, tags, is_active, created_at, updated_at)
        VALUES ($1, $2, 'ON_SALE', $3, $4, 0, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [id, storeId, name, basePrice]);
    }

    console.log(`상품 ${productData.length}개 insert 완료`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
