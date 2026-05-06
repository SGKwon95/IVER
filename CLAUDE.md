# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

하이버(Hiver) 클론 쇼핑몰 — Next.js 14 App Router + PostgreSQL (Raspberry Pi) 기반 한국어 쇼핑몰 프로젝트.

## Commands

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run lint         # ESLint

# DB 관련
DATABASE_URL="..." npx prisma generate   # Prisma 클라이언트 재생성
DATABASE_URL="..." npx prisma db push    # 스키마 → DB 반영 (migrate 대신 사용)
npx ts-node --esm prisma/<script>.ts     # DB 스크립트 실행 방식
```

> `prisma db push` 실행 시 `DATABASE_URL`을 환경변수로 직접 전달해야 함 (`prisma.config.ts`에서 `process.env`로 읽는 구조인데 Prisma 7이 이를 인식 못하는 경우 있음).

## Architecture

### DB 연결 (Prisma 7)

Prisma 7은 adapter 방식 필수. `lib/prisma.ts`에 싱글톤으로 관리:
- `@prisma/adapter-pg` + `pg.Pool` 조합
- 모든 API route에서 `import { prisma } from '@/lib/prisma'`로 사용
- `prisma.config.ts`가 datasource URL을 담당 (`schema.prisma`에 `url` 없음)

### 인증

세션 없음. localStorage의 `customerId`(CUID)로 인증 상태 관리:
- 로그인 성공 시 `localStorage.setItem('customerId', id)` 저장
- API route는 query param 또는 request body로 `customerId`를 받아 처리
- 비로그인 접근 시 `/login`으로 리디렉트

### 데이터 구조

- **실제 DB**: customer, store, product, tag, product_like, store_like, categories, customer_address, customer_login, code_group, common_code
- **mockData** (`lib/mockData.ts`): 배너, 카테고리 탭, 상품 50개 (product-1 ~ product-50). 상품 데이터는 DB에도 동일한 ID로 insert되어 있음
- **상품 이미지**: `https://picsum.photos/seed/hiver-product-{n}/400/400` (외부 URL, DB 미저장)
- **태그**: 비트마스크 방식 — `tag.tag_value`는 반드시 2의 거듭제곱(1,2,4,8…), `product.tags`는 OR 합산값

### 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 (Header + CategoryTabs + Banner + ProductGrid) |
| `/categories` | 좌측 사이드바 + 우측 연속 스크롤 |
| `/products/[id]` | 상품 상세 (mockData 기반) |
| `/likes` | 찜한 상품/스토어/최근 본 상품 탭 |
| `/mypage` | 마이페이지 (DB 고객 정보) |
| `/login` · `/register` | 인증 |
| `/grade-benefits` | 등급 혜택 |

### API Routes

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/auth/login` | POST | 로그인 |
| `/api/auth/register` | POST | 회원가입 |
| `/api/likes/product` | GET | 찜한 상품 ID 목록 |
| `/api/likes/product` | POST | 찜 토글 |
| `/api/customers/me` | GET | 고객 기본정보 |

### DB 스키마 변경 방법

1. `prisma/schema.prisma` 수정
2. `DATABASE_URL="..." npx prisma db push` 실행
3. 충돌 발생 시 `prisma/` 아래 ts-node 스크립트로 raw SQL 직접 실행
4. `DATABASE_URL="..." npx prisma generate`로 클라이언트 재생성

### 브랜치

- `main`: 메인 브랜치
- `payment`: 결제 기능 개발 브랜치
