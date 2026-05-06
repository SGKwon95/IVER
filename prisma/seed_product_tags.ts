import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:b1l7a0c5k7!%40@192.168.219.110:5432/igv',
});

// tag_value: 반팔티=1, 오버핏=2, 봄=4, 베이직반팔티=8, 스투시=16, 스투시반팔=32,
//            스투시베이직반팔=64, 여름=128, 면=256, 로고/그래픽=512, S=1024, M=2048, L=4096, XL=8192
const productTagMap: Record<string, number> = {
  'product-1':  1|2|4|256|1024|2048,          // 반팔티, 오버핏, 봄, 면, S, M
  'product-2':  1|2|8|256|1024|2048|4096,      // 반팔티, 오버핏, 베이직반팔티, 면, S, M, L
  'product-3':  1|16|32|512|1024|2048,         // 반팔티, 스투시, 스투시반팔, 로고/그래픽, S, M
  'product-4':  1|16|64|512|1024|2048|4096,    // 반팔티, 스투시, 스투시베이직반팔, 로고/그래픽, S, M, L
  'product-5':  2|128|256|1024|2048|4096|8192, // 오버핏, 여름, 면, S, M, L, XL
  'product-6':  1|2|4|8|256|2048|4096,         // 반팔티, 오버핏, 봄, 베이직반팔티, 면, M, L
  'product-7':  1|16|32|64|512|1024|2048,      // 반팔티, 스투시, 스투시반팔, 스투시베이직반팔, 로고/그래픽, S, M
  'product-8':  2|4|128|256|1024|2048|4096,    // 오버핏, 봄, 여름, 면, S, M, L
  'product-9':  1|8|256|1024|2048|4096|8192,   // 반팔티, 베이직반팔티, 면, S, M, L, XL
  'product-10': 2|16|512|2048|4096|8192,       // 오버핏, 스투시, 로고/그래픽, M, L, XL
};

// 나머지 상품(11~50)은 S, M, L 기본 태그
const defaultMask = 1024 | 2048 | 4096; // S, M, L

async function main() {
  const client = await pool.connect();
  try {
    // 지정된 상품 태그 업데이트
    for (const [productId, mask] of Object.entries(productTagMap)) {
      await client.query(`UPDATE product SET tags = $1, updated_at = NOW() WHERE id = $2`, [mask, productId]);
    }

    // 나머지 상품 기본 태그
    await client.query(
      `UPDATE product SET tags = $1, updated_at = NOW() WHERE id NOT IN (${Object.keys(productTagMap).map((_, i) => `$${i + 2}`).join(',')})`,
      [defaultMask, ...Object.keys(productTagMap)]
    );

    console.log('상품 태그 업데이트 완료');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
