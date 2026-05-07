# DB 스키마 및 테이블 관계 정리

> 기준: `prisma/schema.prisma` (PostgreSQL, Prisma 7)

---

## 전체 관계 다이어그램

```
code_group ──< common_code

customer ──< customer_login        (1:1)
customer ──< customer_address      (1:N)
customer ──< product_like          (1:N)
customer ──< store_like            (1:N)

store ──< product                  (1:N)
store ──< tag                      (1:N)
store ──< store_like               (1:N)

categories ──< categories          (자기참조, 부모/자식)
categories ──< product             (1:N, optional)

product ──< product_color          (1:N)
product ──< product_size           (1:N)
product ──< product_stock          (1:N)

color ──< product_color            (1:N)
color ──< product_stock            (1:N)

size ──< product_size              (1:N)
size ──< product_stock             (1:N)

event ──< event_product            (1:N)
```

---

## 테이블 상세

### 고객 도메인

#### `customer` (고객)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| user_type_code | VARCHAR(30) | 사용자 유형 (GENERAL 등) |
| customer_type_code | VARCHAR(30) | 고객 유형 (NORMAL 등) |
| member_status_code | VARCHAR(30) | 회원 상태 (ACTIVE 등) |
| cust_name | VARCHAR(100) | 이름 |
| birth_date | DATE | 생년월일 |
| mobile_no | VARCHAR(20) | 휴대폰 번호 |
| email | VARCHAR(200) UNIQUE | 이메일 |
| gender_code | VARCHAR(30) | 성별 코드 |
| height | DECIMAL(5,1) | 키 |
| weight | DECIMAL(5,1) | 몸무게 |
| point | INT | 포인트 |
| marketing_yn | BOOLEAN | 마케팅 수신 동의 |
| notification_yn | BOOLEAN | 알림 수신 동의 |
| joined_at | TIMESTAMP | 가입일 |
| dormant_at | TIMESTAMP | 휴면 전환일 |
| last_login_at | TIMESTAMP | 마지막 로그인 |
| withdrawn_at | TIMESTAMP | 탈퇴일 |

**관계**
- `customer_login` 1:1 (onDelete Cascade)
- `customer_address` 1:N (onDelete Cascade)
- `product_like` 1:N (onDelete Cascade)
- `store_like` 1:N (onDelete Cascade)

---

#### `customer_login` (로그인 정보)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| customer_id | VARCHAR(50) UNIQUE FK | → customer.id |
| login_id | VARCHAR(100) UNIQUE | 아이디 |
| login_pw | VARCHAR(200) | 비밀번호 (해시) |

---

#### `customer_address` (배송지)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| customer_id | FK | → customer.id |
| recipient_name | VARCHAR(100) | 수령인 |
| postal_code | VARCHAR(10) | 우편번호 |
| address | VARCHAR(300) | 주소 |
| address_detail | VARCHAR(200) | 상세주소 |
| contact_no | VARCHAR(20) | 연락처 |
| delivery_memo | VARCHAR(500) | 배송 메모 |
| is_default | BOOLEAN | 기본 배송지 여부 |
| is_active | BOOLEAN | 활성 여부 |

---

### 스토어 도메인

#### `store` (스토어)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| store_name | VARCHAR(100) | 스토어명 |
| store_status_code | VARCHAR(30) | 상태 (OPEN 등) |
| default_order_info | TEXT | 기본 주문 안내 |
| representative | VARCHAR(50) | 대표자명 |
| business_reg_no | VARCHAR(20) | 사업자등록번호 |
| ecommerce_reg_no | VARCHAR(50) | 통신판매업번호 |
| business_address | VARCHAR(300) | 사업장 주소 |
| fashion_type_code | VARCHAR(30) | 패션 유형 코드 |
| cs_hours | VARCHAR(200) | CS 운영시간 |
| cs_email | VARCHAR(200) | CS 이메일 |
| cs_contact | VARCHAR(20) | CS 연락처 |
| cs_kakao_id | VARCHAR(100) | 카카오 채널 ID |

**관계**
- `product` 1:N (onDelete Cascade)
- `tag` 1:N (onDelete Cascade)
- `store_like` 1:N (onDelete Cascade)

---

### 상품 도메인

#### `product` (상품)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| store_id | FK | → store.id |
| category_id | FK (nullable) | → categories.id |
| product_status_code | VARCHAR(30) | 상태 (ON_SALE 등) |
| product_name | VARCHAR(300) | 상품명 |
| base_price | DECIMAL(10,2) | 기본 가격 |
| tags | BIGINT | 태그 비트마스크 (tag.tag_value OR 합산) |
| is_active | BOOLEAN | 활성 여부 |

**관계**
- `store` N:1
- `categories` N:1 (optional)
- `product_color` 1:N (onDelete Cascade)
- `product_size` 1:N (onDelete Cascade)
- `product_stock` 1:N (onDelete Cascade)

---

#### `color` (색상 마스터)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| category | VARCHAR(30) | 색상 계열 (예: RED, BLUE) |
| color_name | VARCHAR(50) | 색상명 |
| sort_order | INT | 정렬 순서 |
| is_active | BOOLEAN | |

**관계**
- `product_color` 1:N
- `product_stock` 1:N

---

#### `size` (사이즈 마스터)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| size_en | VARCHAR(10) | 사이즈 영문 (S, M, L, XL 등) |
| size_ko | VARCHAR(20) | 사이즈 한글 |
| size_value | INT | 정렬용 수치값 |
| sort_order | INT | 정렬 순서 |
| is_active | BOOLEAN | |

**관계**
- `product_size` 1:N
- `product_stock` 1:N

---

#### `product_color` (상품-색상 연결)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| product_id | FK | → product.id |
| color_id | FK | → color.id |
| sort_order | INT | |
| is_active | BOOLEAN | |

UNIQUE: `(product_id, color_id)`

---

#### `product_size` (상품-사이즈 연결)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| product_id | FK | → product.id |
| size_id | FK | → size.id |
| sort_order | INT | |
| is_active | BOOLEAN | |

UNIQUE: `(product_id, size_id)`

---

#### `product_stock` (재고)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| product_id | FK | → product.id |
| color_id | FK (nullable) | → color.id |
| size_id | FK (nullable) | → size.id |
| stock_count | INT | 재고 수량 |
| additional_price | DECIMAL(10,2) | 옵션 추가금액 |
| is_active | BOOLEAN | |

UNIQUE: `(product_id, color_id, size_id)`
> color/size 없이도 레코드 생성 가능 (단일 옵션 상품)

---

### 찜 도메인

#### `product_like` (상품 찜)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| customer_id | FK | → customer.id |
| product_id | STRING | 상품 ID (DB FK 없음, mockData ID 사용) |

PK: `(customer_id, product_id)`

> product 테이블과 실제 FK 관계 없음. mockData의 "product-1" 형태 ID를 문자열로 저장.

---

#### `store_like` (스토어 찜)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| customer_id | FK | → customer.id |
| store_id | FK | → store.id |

PK: `(customer_id, store_id)`

---

### 태그 도메인

#### `tag` (태그)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| store_id | FK | → store.id |
| tag_name | VARCHAR(100) | 태그명 (예: "미니멀") |
| tag_value | BIGINT | 비트마스크 값 (반드시 2의 거듭제곱: 1, 2, 4, 8…) |
| is_active | BOOLEAN | |

> `product.tags`는 해당 스토어의 tag_value들을 OR 연산한 합산값.
> 비트 AND 연산으로 상품의 태그 포함 여부 확인: `product.tags & tag.tag_value !== 0`

---

### 이벤트 도메인

#### `event` (이벤트)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| event_name | VARCHAR(200) | 이벤트명 |
| event_type_code | VARCHAR(30) | 유형 (TIMESALE 등) |
| start_at | TIMESTAMP | 시작일시 |
| end_at | TIMESTAMP | 종료일시 |
| is_active | BOOLEAN | |

**관계**
- `event_product` 1:N (onDelete Cascade)

---

#### `event_product` (이벤트 참여 상품)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| event_id | FK | → event.id |
| product_id | STRING | 상품 ID (mockData ID) |
| discount_type | VARCHAR(10) | RATE(비율) / AMOUNT(정액) |
| discount_value | DECIMAL(10,2) | 할인값 (비율이면 0~100, 정액이면 금액) |

---

### 공통코드 도메인

#### `code_group` (코드 그룹)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| group_id | VARCHAR(30) PK | 예: GENDER, MEMBER_STATUS |
| group_name | VARCHAR(100) | 그룹명 |
| description | TEXT | |
| sort_order | INT | |
| is_active | BOOLEAN | |

**관계**
- `common_code` 1:N (onDelete Cascade)

---

#### `common_code` (공통코드)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| group_id | FK | → code_group.group_id |
| code_id | VARCHAR(30) | 코드 ID (예: MALE) |
| code_name | VARCHAR(100) | 코드명 (예: 남성) |
| code_value | VARCHAR(200) | 부가 값 |
| sort_order | INT | |
| is_active | BOOLEAN | |

PK: `(group_id, code_id)`

---

### 카테고리

#### `categories` (카테고리)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | CUID PK | |
| name | STRING | 카테고리명 |
| type | ENUM | MAIN / SUB |
| parent_id | FK (nullable) | → categories.id (자기참조) |
| sort_order | INT | |
| is_active | BOOLEAN | |

> MAIN 카테고리는 parent_id = null, SUB 카테고리는 parent_id = MAIN.id

---

## 설계 특이사항

| 항목 | 내용 |
|------|------|
| 상품 이미지 | DB 미저장. `https://picsum.photos/seed/hiver-product-{n}/400/400` 외부 URL로 고정 |
| product_like.product_id | product 테이블과 FK 없음. mockData ID ("product-1" 형태) 문자열 저장 |
| event_product.product_id | 동일하게 mockData ID 문자열 저장, FK 없음 |
| 태그 비트마스크 | tag.tag_value는 2의 거듭제곱만 허용. product.tags는 OR 합산. 필터링 시 AND 연산 사용 |
| 인증 | 세션 없음. localStorage의 customerId(CUID)로 클라이언트 측 인증 상태 관리 |
| Prisma 7 | adapter 방식 필수 (`@prisma/adapter-pg` + `pg.Pool`). schema.prisma에 url 없음, prisma.config.ts에서 관리 |
