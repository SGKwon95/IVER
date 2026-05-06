import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS event (
        id                TEXT           NOT NULL PRIMARY KEY,
        event_name        VARCHAR(200)   NOT NULL,
        event_type_code   VARCHAR(30)    NOT NULL DEFAULT 'TIMESALE',
        start_at          TIMESTAMPTZ    NOT NULL,
        end_at            TIMESTAMPTZ    NOT NULL,
        is_active         BOOLEAN        NOT NULL DEFAULT true,
        created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
      );
    `);
    console.log('event 테이블 생성 완료');

    await client.query(`
      CREATE TABLE IF NOT EXISTS event_product (
        id              TEXT           NOT NULL PRIMARY KEY,
        event_id        TEXT           NOT NULL REFERENCES event(id) ON DELETE CASCADE,
        product_id      TEXT           NOT NULL,
        discount_type   VARCHAR(10)    NOT NULL DEFAULT 'RATE',
        discount_value  DECIMAL(10, 2) NOT NULL
      );
    `);
    console.log('event_product 테이블 생성 완료');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
