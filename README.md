# IVER - 아이버 클론 코딩

하이버(hiver.co.kr) 패션 쇼핑몰을 **Next.js 14 App Router**와 **Tailwind CSS**로 클론 코딩한 프로젝트입니다.

## 스크린샷

> 모바일 퍼스트 레이아웃 (max-width: 430px)

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Font | Pretendard |

## 주요 기능

### UI 컴포넌트
- **Header** — 로고, 검색, 장바구니 아이콘 (상단 고정)
- **CategoryTabs** — 홈 · 랭킹 · 이벤트 · 쇼핑몰 · 브랜드 · 스포츠 탭 (언더라인 애니메이션)
- **Banner** — 자동 슬라이드 (3.5초 간격), dots 인디케이터, 카운터 배지
- **ProductGrid** — 2열 그리드, 정렬 칩, 무한 스크롤
- **ProductCard** — 1:1 이미지 비율, 찜 하트 토글, 할인율 강조
- **BottomNav** — 홈 · 카테고리 · 찜 · 마이페이지 (하단 고정)

### 디자인 시스템
- 배경색: `#121212` (다크 그레이)
- 포인트 컬러: 화이트, 블루 (`#3B82F6`), 레드 (`#FF3B30`)
- 모바일 중심 레이아웃 (`max-w-[430px]`)

### 인터랙션
- Intersection Observer 기반 무한 스크롤 (10개씩 로드)
- 배너 자동 슬라이드 (마우스 오버 시 일시 정지)
- 찜 버튼 클릭 시 하트 토글

## 프로젝트 구조

```
IVER/
├── app/
│   ├── globals.css       # Pretendard 폰트, Tailwind, 유틸리티
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 메인 페이지
├── components/
│   ├── Header.tsx
│   ├── CategoryTabs.tsx
│   ├── Banner.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── BottomNav.tsx
├── lib/
│   └── mockData.ts       # 상품 50개, 배너 5개, 카테고리 6개 mock 데이터
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000) 접속
