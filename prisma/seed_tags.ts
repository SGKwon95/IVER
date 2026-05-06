import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

const tags = [
  { name: '반팔티',        value: 1 },
  { name: '오버핏',        value: 2 },
  { name: '봄',            value: 4 },
  { name: '베이직반팔티',  value: 8 },
  { name: '스투시',        value: 16 },
  { name: '스투시반팔',    value: 32 },
  { name: '스투시베이직반팔', value: 64 },
  { name: '여름',          value: 128 },
  { name: '면',            value: 256 },
  { name: '로고/그래픽',   value: 512 },
  { name: 'S',             value: 1024 },
  { name: 'M',             value: 2048 },
  { name: 'L',             value: 4096 },
  { name: 'XL',            value: 8192 },
];

async function main() {
  const client = await pool.connect();
  try {
    const storeId = 'store-iver-default';

    for (let i = 0; i < tags.length; i++) {
      const id = `tag-${storeId}-${i + 1}`;
      await client.query(`
        INSERT INTO tag (id, store_id, tag_name, tag_value, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [id, storeId, tags[i].name, tags[i].value]);
    }
    console.log(`태그 ${tags.length}개 insert 완료`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
