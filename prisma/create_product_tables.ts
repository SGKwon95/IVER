import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tag (
        id         TEXT        NOT NULL PRIMARY KEY,
        store_id   TEXT        NOT NULL REFERENCES store(id) ON DELETE CASCADE,
        tag_name   VARCHAR(100) NOT NULL,
        tag_value  BIGINT      NOT NULL,
        is_active  BOOLEAN     NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('tag 테이블 생성 완료');

    await client.query(`
      CREATE TABLE IF NOT EXISTS product (
        id                  TEXT           NOT NULL PRIMARY KEY,
        store_id            TEXT           NOT NULL REFERENCES store(id) ON DELETE CASCADE,
        product_status_code VARCHAR(30)    NOT NULL DEFAULT 'ON_SALE',
        category_id         TEXT           REFERENCES categories(id),
        product_name        VARCHAR(300)   NOT NULL,
        base_price          DECIMAL(10, 2) NOT NULL,
        tags                BIGINT         NOT NULL DEFAULT 0,
        is_active           BOOLEAN        NOT NULL DEFAULT true,
        created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW()
      );
    `);
    console.log('product 테이블 생성 완료');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
