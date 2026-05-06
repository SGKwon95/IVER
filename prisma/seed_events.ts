import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

async function main() {
  const client = await pool.connect();
  try {
    const eventId = 'event-timesale-001';
    await client.query(`
      INSERT INTO event (id, event_name, event_type_code, start_at, end_at, is_active, created_at, updated_at)
      VALUES ($1, '타임세일', 'TIMESALE', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '7 days', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [eventId]);
    console.log('이벤트 생성 완료:', eventId);

    // product-1 ~ product-5 에 30% 할인 적용
    const targets = ['product-1', 'product-2', 'product-3', 'product-4', 'product-5'];
    for (let i = 0; i < targets.length; i++) {
      const epId = `ep-${eventId}-${i + 1}`;
      await client.query(`
        INSERT INTO event_product (id, event_id, product_id, discount_type, discount_value)
        VALUES ($1, $2, $3, 'RATE', 30)
        ON CONFLICT (id) DO NOTHING;
      `, [epId, eventId, targets[i]]);
    }
    console.log(`이벤트 상품 ${targets.length}개 등록 완료`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
