# IVER - Agent Instructions

## Architecture

Hiver (hiver.co.kr) fashion clone mall — Next.js 14 App Router + PostgreSQL (Prisma 7, adapter-pg + pg.Pool).
No session auth — uses `customerId` (CUID) stored in localStorage. API routes receive `customerId` via query param or request body.

### Key constraints
- **Prisma 7**: adapter required. All DB access via `lib/prisma.ts` singleton. `prisma.config.ts` holds datasource URL (not in `schema.prisma`).
- **DB push**: `DATABASE_URL="..." npx prisma db push` (pass URL as env var, not via `prisma.config.ts`).
- **Product `tags`**: bitmask — `tag.tag_value` must be power of 2 (1,2,4,8...), `product.tags` is OR-summed integer.
- **Image URLs**: external only (`picsum.photos`). Not stored in DB.
- **All DB pages**: must declare `export const dynamic = "force-dynamic"` (prevents static build DB connection attempts).

### Routing
```
app/
  page.tsx                    # Home (Header + CategoryTabs + Banner + ProductGrid)
  categories/page.tsx         # Category sidebar + infinite scroll
  products/[id]/page.tsx      # Product detail (currently mockData-based)
  likes/page.tsx              # Wishlist / stores / recent views tabs
  mypage/page.tsx             # My page (DB customer info, grade, points)
  grade-benefits/page.tsx     # Grade benefits
  login/page.tsx, register/page.tsx
  api/
    auth/login, auth/register
    likes/product (GET/POST)
    customers/me
    stores/[id], products/[id]
```

### Data flow
- Server components → `lib/prisma.ts` (`prisma` client)
- API routes → same `prisma` client
- State: no Redux/Zustand yet. localStorage for auth, React state for UI.

### DB schema (current)
`Category`, `Store`, `Customer`, `CustomerLogin`, `CustomerAddress`, `Product`, `ProductLike`, `StoreLike`, `Tag`, `Event`, `EventProduct`, `CodeGroup`, `CommonCode`

### Commands
```bash
npm run dev           # dev server
npm run build         # production build
npm run lint          # ESLint

DATABASE_URL="..." npx prisma generate   # generate client
DATABASE_URL="..." npx prisma db push    # push schema to DB
npx ts-node --esm prisma/<script>.ts     # run DB scripts
```

### Design system
- Background: `#121212`, point: white / blue `#3B82F6` / red `#FF3B30`
- Mobile-first layout (`max-w-[430px]`)
- `tailwind.config.ts` has `kgv.*` color palette

### Grade system
IRON → BRONZE → SILVER → GOLD → DIAMOND (based on monthly spend)

### Common codes (seeded in `prisma/seed.ts`)
- `ORDER_STATUS`: PENDING → PAID → SHIPPING → DELIVERED → CANCELLED
- `PAYMENT_METHOD`: CARD, KAKAO_PAY, NAVER_PAY, BANK_TRANSFER
- `SIZE`: XS, S, M, L, XL, XXL, FREE
- `GENDER`: MEN, WOMEN, UNISEX
- `BANNER_TYPE`: MAIN, EVENT, POPUP
- `PRODUCT_STATUS`: ON_SALE, SOLD_OUT, DISCONTINUED

## Payment table plan (pending)
Branch: `payment`
Planned tables: `Cart`, `Order`, `OrderItem`, `Payment`, `Coupon`, `OrderCoupon`
- Order status flow: PENDING → PAID → SHIPPING → DELIVERED → CONFIRMED (5 steps)
- All amounts as Int (won/원 unit)
- PG integration deferred — DB schema first
