import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();

  await client.query('DELETE FROM common_code');
  await client.query('DELETE FROM code_group');

  await client.query(`
    INSERT INTO code_group (group_id, group_name, sort_order, updated_at) VALUES
    ('ORDER_STATUS',   '주문상태', 0, NOW()),
    ('PAYMENT_METHOD', '결제수단', 1, NOW()),
    ('SIZE',           '사이즈',   2, NOW()),
    ('GENDER',         '성별',     3, NOW()),
    ('BANNER_TYPE',    '배너유형', 4, NOW()),
    ('PRODUCT_STATUS', '상품상태', 5, NOW())
  `);

  await client.query(`
    INSERT INTO common_code (group_id, code_id, code_name, sort_order, updated_at) VALUES
    ('ORDER_STATUS', 'PENDING',    '주문대기', 0, NOW()),
    ('ORDER_STATUS', 'PAID',       '결제완료', 1, NOW()),
    ('ORDER_STATUS', 'SHIPPING',   '배송중',   2, NOW()),
    ('ORDER_STATUS', 'DELIVERED',  '배송완료', 3, NOW()),
    ('ORDER_STATUS', 'CANCELLED',  '취소',     4, NOW()),

    ('PAYMENT_METHOD', 'CARD',          '신용카드',   0, NOW()),
    ('PAYMENT_METHOD', 'KAKAO_PAY',     '카카오페이', 1, NOW()),
    ('PAYMENT_METHOD', 'NAVER_PAY',     '네이버페이', 2, NOW()),
    ('PAYMENT_METHOD', 'BANK_TRANSFER', '무통장입금', 3, NOW()),

    ('SIZE', 'XS',   'XS',   0, NOW()),
    ('SIZE', 'S',    'S',    1, NOW()),
    ('SIZE', 'M',    'M',    2, NOW()),
    ('SIZE', 'L',    'L',    3, NOW()),
    ('SIZE', 'XL',   'XL',   4, NOW()),
    ('SIZE', 'XXL',  'XXL',  5, NOW()),
    ('SIZE', 'FREE', '프리', 6, NOW()),

    ('GENDER', 'MEN',    '남성',     0, NOW()),
    ('GENDER', 'WOMEN',  '여성',     1, NOW()),
    ('GENDER', 'UNISEX', '남녀공용', 2, NOW()),

    ('BANNER_TYPE', 'MAIN',  '메인배너', 0, NOW()),
    ('BANNER_TYPE', 'EVENT', '이벤트',   1, NOW()),
    ('BANNER_TYPE', 'POPUP', '팝업',     2, NOW()),

    ('PRODUCT_STATUS', 'ON_SALE',      '판매중', 0, NOW()),
    ('PRODUCT_STATUS', 'SOLD_OUT',     '품절',   1, NOW()),
    ('PRODUCT_STATUS', 'DISCONTINUED', '단종',   2, NOW())
  `);

  const { rows } = await client.query('SELECT COUNT(*) FROM common_code');
  console.log(`✅ 공통코드 ${rows[0].count}개 삽입 완료`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => client.end());
