import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

// 글로벌 색상 마스터
const colors = [
  { id: 'color-black',     category: '블랙계열',   name: '블랙',     order: 1 },
  { id: 'color-white',     category: '화이트계열', name: '화이트',   order: 2 },
  { id: 'color-beige',     category: '베이지계열', name: '베이지',   order: 3 },
  { id: 'color-gray',      category: '그레이계열', name: '그레이',   order: 4 },
  { id: 'color-darkgray',  category: '그레이계열', name: '다크그레이', order: 5 },
  { id: 'color-navy',      category: '블루계열',   name: '네이비',   order: 6 },
];

// 글로벌 사이즈 마스터
const sizes = [
  { id: 'size-S',  en: 'S',  ko: '스몰',     value: 90,  order: 1 },
  { id: 'size-M',  en: 'M',  ko: '미디엄',   value: 95,  order: 2 },
  { id: 'size-L',  en: 'L',  ko: '라지',     value: 100, order: 3 },
  { id: 'size-XL', en: 'XL', ko: '엑스라지', value: 105, order: 4 },
];

// 상품별 색상/사이즈 (product-1 ~ product-50)
function colorsFor(n: number): string[] {
  const base = ['color-black', 'color-white', 'color-beige'];
  if (n % 3 === 0) return ['color-navy', 'color-white', 'color-darkgray'];
  if (n % 3 === 1) return ['color-black', 'color-gray'];
  return base;
}

function sizesFor(n: number): string[] {
  // product-5, 9 는 XL 까지, product-10은 M/L/XL, 나머지는 S/M/L
  if (n === 5 || n === 9) return ['size-S', 'size-M', 'size-L', 'size-XL'];
  if (n === 10) return ['size-M', 'size-L', 'size-XL'];
  return ['size-S', 'size-M', 'size-L'];
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 기존 데이터 클리어 (FK 순서 고려)
    await client.query('DELETE FROM product_stock');
    await client.query('DELETE FROM product_color');
    await client.query('DELETE FROM product_size');
    await client.query('DELETE FROM color');
    await client.query('DELETE FROM size');

    // 1. color
    for (const c of colors) {
      await client.query(
        `INSERT INTO color (id, category, color_name, sort_order, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
        [c.id, c.category, c.name, c.order]
      );
    }

    // 2. size
    for (const s of sizes) {
      await client.query(
        `INSERT INTO size (id, size_en, size_ko, size_value, sort_order, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
        [s.id, s.en, s.ko, s.value, s.order]
      );
    }

    // 3. product_color, product_size, product_stock
    for (let n = 1; n <= 50; n++) {
      const productId = `product-${n}`;
      const productColors = colorsFor(n);
      const productSizes = sizesFor(n);

      // product_color
      for (let i = 0; i < productColors.length; i++) {
        await client.query(
          `INSERT INTO product_color (id, product_id, color_id, sort_order, is_active)
           VALUES ($1, $2, $3, $4, true)`,
          [`pc-${productId}-${productColors[i]}`, productId, productColors[i], i + 1]
        );
      }

      // product_size
      for (let i = 0; i < productSizes.length; i++) {
        await client.query(
          `INSERT INTO product_size (id, product_id, size_id, sort_order, is_active)
           VALUES ($1, $2, $3, $4, true)`,
          [`ps-${productId}-${productSizes[i]}`, productId, productSizes[i], i + 1]
        );
      }

      // product_stock — 색상×사이즈 카르테시안
      for (const colorId of productColors) {
        for (const sizeId of productSizes) {
          // XL은 +1000원 추가금액
          const additionalPrice = sizeId === 'size-XL' ? 1000 : 0;
          // 일부러 일부 조합은 품절(0)
          const stockCount = (n + colorId.length + sizeId.length) % 7 === 0 ? 0 : rand(5, 50);
          await client.query(
            `INSERT INTO product_stock (id, product_id, color_id, size_id, stock_count, additional_price, sku_code, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())`,
            [
              `stk-${productId}-${colorId}-${sizeId}`,
              productId, colorId, sizeId,
              stockCount, additionalPrice,
              `SKU-${n}-${colorId.replace('color-','').toUpperCase()}-${sizeId.replace('size-','')}`,
            ]
          );
        }
      }
    }

    await client.query('COMMIT');

    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM color) AS color,
        (SELECT COUNT(*) FROM size) AS size,
        (SELECT COUNT(*) FROM product_color) AS product_color,
        (SELECT COUNT(*) FROM product_size) AS product_size,
        (SELECT COUNT(*) FROM product_stock) AS product_stock,
        (SELECT COUNT(*) FROM product_stock WHERE stock_count = 0) AS sold_out
    `);
    console.log('시드 완료:', counts.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
