import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. color (글로벌 색상 마스터)
    await client.query(`
      CREATE TABLE IF NOT EXISTS color (
        id          TEXT PRIMARY KEY,
        category    VARCHAR(30),
        color_name  VARCHAR(50) NOT NULL,
        sort_order  INT DEFAULT 0,
        is_active   BOOLEAN DEFAULT true,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_color_active ON color(is_active)`);

    // 2. size (글로벌 사이즈 마스터)
    await client.query(`
      CREATE TABLE IF NOT EXISTS size (
        id          TEXT PRIMARY KEY,
        size_en     VARCHAR(10) NOT NULL,
        size_ko     VARCHAR(20),
        size_value  INT,
        sort_order  INT DEFAULT 0,
        is_active   BOOLEAN DEFAULT true,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_size_active ON size(is_active)`);

    // 3. product_color (상품-색상 매핑)
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_color (
        id          TEXT PRIMARY KEY,
        product_id  TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        color_id    TEXT NOT NULL REFERENCES color(id),
        sort_order  INT DEFAULT 0,
        is_active   BOOLEAN DEFAULT true,
        UNIQUE (product_id, color_id)
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_product_color_product ON product_color(product_id)`);

    // 4. product_size (상품-사이즈 매핑)
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_size (
        id          TEXT PRIMARY KEY,
        product_id  TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        size_id     TEXT NOT NULL REFERENCES size(id),
        sort_order  INT DEFAULT 0,
        is_active   BOOLEAN DEFAULT true,
        UNIQUE (product_id, size_id)
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_product_size_product ON product_size(product_id)`);

    // 5. product_stock (색상×사이즈 조합 재고)
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_stock (
        id                TEXT PRIMARY KEY,
        product_id        TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        color_id          TEXT REFERENCES color(id),
        size_id           TEXT REFERENCES size(id),
        stock_count       INT DEFAULT 0,
        additional_price  DECIMAL(10, 2) DEFAULT 0,
        sku_code          VARCHAR(100),
        is_active         BOOLEAN DEFAULT true,
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        updated_at        TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (product_id, color_id, size_id)
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_product_stock_product ON product_stock(product_id)`);

    await client.query('COMMIT');
    console.log('옵션/재고 테이블 생성 완료: color, size, product_color, product_size, product_stock');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
