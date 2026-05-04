export interface Product {
  id: string;
  brand: string;
  name: string;
  originalPrice: number;
  discountRate: number;
  price: number;
  reviewCount: number;
  imageUrl: string;
  isLiked: boolean;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  isAll?: boolean;
}

export interface MainCategory {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export const categoryMenus: MainCategory[] = [
  {
    id: 'mall',
    name: '쇼핑몰',
    subCategories: [
      { id: 'all', name: '쇼핑몰', isAll: true },
      { id: 'top', name: '상의' },
      { id: 'pants', name: '바지' },
      { id: 'outer', name: '아우터' },
      { id: 'shoes', name: '신발' },
      { id: 'hat', name: '모자' },
      { id: 'fashion', name: '패션소품' },
      { id: 'bag', name: '가방' },
      { id: 'inner', name: '이너/홈웨어' },
      { id: 'windbreaker', name: '바람막이' },
      { id: 'hoodie', name: '후드집업' },
      { id: 'cardigan', name: '가디건' },
      { id: 'blazer', name: '블레이저' },
      { id: 'safari', name: '야상/사파리' },
      { id: 'blouson', name: '블루종/트루커' },
    ],
  },
  {
    id: 'brand',
    name: '브랜드',
    subCategories: [
      { id: 'all', name: '브랜드', isAll: true },
      { id: 'top', name: '상의' },
      { id: 'pants', name: '바지' },
      { id: 'outer', name: '아우터' },
      { id: 'shoes', name: '신발' },
      { id: 'hat', name: '모자' },
      { id: 'fashion', name: '패션소품' },
      { id: 'bag', name: '가방' },
      { id: 'inner', name: '이너/홈웨어' },
      { id: 'windbreaker', name: '바람막이' },
      { id: 'hoodie', name: '후드집업' },
      { id: 'cardigan', name: '가디건' },
      { id: 'blazer', name: '블레이저' },
      { id: 'safari', name: '야상/사파리' },
      { id: 'blouson', name: '블루종/트루커' },
    ],
  },
  {
    id: 'sports',
    name: '스포츠',
    subCategories: [
      { id: 'all', name: '스포츠', isAll: true },
      { id: 'top', name: '상의' },
      { id: 'pants', name: '바지' },
      { id: 'outer', name: '아우터' },
      { id: 'shoes', name: '신발' },
      { id: 'hat', name: '모자' },
      { id: 'accessories', name: '잡화' },
      { id: 'bag', name: '가방' },
      { id: 'swimwear', name: '스윔웨어' },
      { id: 'equipment', name: '스포츠 용품' },
      { id: 'etc', name: '기타' },
      { id: 'short-sleeve', name: '반소매 티셔츠' },
      { id: 'sleeveless', name: '민소매 티셔츠' },
      { id: 'long-sleeve', name: '긴소매 티셔츠' },
      { id: 'polo', name: '피케/카라 티셔츠' },
    ],
  },
];

export const categories: Category[] = [
  { id: 'home', name: '홈' },
  { id: 'ranking', name: '랭킹' },
  { id: 'event', name: '이벤트' },
  { id: 'mall', name: '쇼핑몰' },
  { id: 'brand', name: '브랜드' },
  { id: 'sports', name: '스포츠' },
];

export const banners: Banner[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://picsum.photos/seed/hiver-banner-1/800/350',
    title: '24 SS 신상품 위크',
    subtitle: '최대 60% 할인 + 추가 쿠폰 증정',
  },
  {
    id: 'banner-2',
    imageUrl: 'https://picsum.photos/seed/hiver-banner-2/800/350',
    title: '나이키 멤버십 세일',
    subtitle: '회원 전용 특가 최대 40% 할인',
  },
  {
    id: 'banner-3',
    imageUrl: 'https://picsum.photos/seed/hiver-banner-3/800/350',
    title: '뉴발란스 컬렉션',
    subtitle: '2024 봄/여름 신상 입고',
  },
  {
    id: 'banner-4',
    imageUrl: 'https://picsum.photos/seed/hiver-banner-4/800/350',
    title: '여름 아우터 특가',
    subtitle: '시원한 여름을 위한 아우터 모음',
  },
  {
    id: 'banner-5',
    imageUrl: 'https://picsum.photos/seed/hiver-banner-5/800/350',
    title: '스트릿 브랜드 위크',
    subtitle: 'MLB · 커버낫 · 인사일런스',
  },
];

const productData: Omit<Product, 'id' | 'price' | 'isLiked' | 'imageUrl'>[] = [
  { brand: 'Nike', name: '에어 포스 1 로우 \'07 화이트', originalPrice: 119000, discountRate: 15, reviewCount: 12847 },
  { brand: 'Adidas', name: '스탠 스미스 클라우드화이트', originalPrice: 109000, discountRate: 20, reviewCount: 9234 },
  { brand: 'New Balance', name: '993 메이드 인 USA', originalPrice: 299000, discountRate: 10, reviewCount: 4521 },
  { brand: 'The North Face', name: '눕시 다운 재킷 블랙', originalPrice: 399000, discountRate: 30, reviewCount: 7832 },
  { brand: 'MLB', name: 'NY 볼캡 뉴욕 양키스', originalPrice: 49000, discountRate: 25, reviewCount: 23456 },
  { brand: 'Nike', name: '에어 맥스 90 화이트/블랙', originalPrice: 149000, discountRate: 18, reviewCount: 5632 },
  { brand: 'Adidas', name: '가젤 볼드 베이지', originalPrice: 119000, discountRate: 22, reviewCount: 3241 },
  { brand: 'Converse', name: '척 테일러 올스타 로우 블랙', originalPrice: 79000, discountRate: 35, reviewCount: 18932 },
  { brand: 'Vans', name: '올드스쿨 블랙/화이트', originalPrice: 89000, discountRate: 28, reviewCount: 11234 },
  { brand: 'New Balance', name: '574 레거시 네이비', originalPrice: 129000, discountRate: 12, reviewCount: 6789 },
  { brand: 'Salomon', name: 'XT-6 어드밴스드 그레이', originalPrice: 239000, discountRate: 15, reviewCount: 2341 },
  { brand: 'PUMA', name: '스피드캣 OG 화이트/블랙', originalPrice: 109000, discountRate: 40, reviewCount: 4567 },
  { brand: 'Jordan', name: '에어 조던 1 미드 화이트', originalPrice: 189000, discountRate: 5, reviewCount: 8921 },
  { brand: 'Reebok', name: '클래식 레더 빈티지', originalPrice: 99000, discountRate: 30, reviewCount: 3456 },
  { brand: 'Asics', name: '젤-카야노 14 크림/스카이', originalPrice: 179000, discountRate: 20, reviewCount: 5678 },
  { brand: 'Stone Island', name: '코튼 피케 폴로 셔츠', originalPrice: 450000, discountRate: 25, reviewCount: 1234 },
  { brand: 'AMI', name: '하트 로고 오버핏 후디 그레이', originalPrice: 380000, discountRate: 15, reviewCount: 2345 },
  { brand: 'Kappa', name: '밴드 트랙 자켓 블랙', originalPrice: 89000, discountRate: 45, reviewCount: 6789 },
  { brand: 'Columbia', name: '와봐즈 인피니티 자켓', originalPrice: 299000, discountRate: 35, reviewCount: 4321 },
  { brand: 'K-Swiss', name: '클래식 VN 화이트', originalPrice: 79000, discountRate: 50, reviewCount: 7654 },
  { brand: 'Nike', name: '드라이핏 ADV 런 디비전', originalPrice: 89000, discountRate: 20, reviewCount: 3210 },
  { brand: 'Adidas', name: '울트라부스트 22 런닝화', originalPrice: 219000, discountRate: 30, reviewCount: 9876 },
  { brand: 'New Balance', name: '1906R 실버/그레이', originalPrice: 189000, discountRate: 10, reviewCount: 5432 },
  { brand: 'MLB', name: '모노그램 미니백 베이지', originalPrice: 69000, discountRate: 20, reviewCount: 12345 },
  { brand: 'Dickies', name: '874 워크 팬츠 블랙', originalPrice: 79000, discountRate: 25, reviewCount: 8765 },
  { brand: 'Carhartt WIP', name: '더블 니 팬츠 스톤', originalPrice: 189000, discountRate: 15, reviewCount: 3456 },
  { brand: 'Nike', name: '나이키 테크 플리스 조거', originalPrice: 129000, discountRate: 10, reviewCount: 6543 },
  { brand: 'Adidas', name: '트레포일 트랙 탑 블랙', originalPrice: 99000, discountRate: 30, reviewCount: 4321 },
  { brand: 'Jordan', name: '에어 조던 4 레트로 블랙', originalPrice: 299000, discountRate: 8, reviewCount: 15678 },
  { brand: 'New Balance', name: '327 레이스업 베이지/화이트', originalPrice: 109000, discountRate: 18, reviewCount: 7654 },
  { brand: 'The North Face', name: '마운틴 자켓 GTX', originalPrice: 599000, discountRate: 20, reviewCount: 2345 },
  { brand: 'Converse', name: '런스타 하이크 하이 블랙', originalPrice: 109000, discountRate: 15, reviewCount: 4567 },
  { brand: 'Vans', name: '에라 95 DX 화이트/그린', originalPrice: 99000, discountRate: 22, reviewCount: 3456 },
  { brand: 'PUMA', name: '슈퍼팀 OG 화이트/블루', originalPrice: 129000, discountRate: 35, reviewCount: 5678 },
  { brand: 'Salomon', name: 'ACS+ 스니커즈 블랙', originalPrice: 199000, discountRate: 12, reviewCount: 2341 },
  { brand: 'Reebok', name: '인스타펌프 퓨리 OG', originalPrice: 179000, discountRate: 25, reviewCount: 3210 },
  { brand: 'Asics', name: '젤-님버스 25 화이트', originalPrice: 199000, discountRate: 15, reviewCount: 4321 },
  { brand: 'Nike', name: '코르테즈 블랙/레드', originalPrice: 109000, discountRate: 28, reviewCount: 8765 },
  { brand: 'Adidas', name: '삼바 OG 화이트/블랙', originalPrice: 119000, discountRate: 5, reviewCount: 21345 },
  { brand: 'New Balance', name: '2002R 그레이/화이트', originalPrice: 159000, discountRate: 20, reviewCount: 9876 },
  { brand: 'MLB', name: '빅볼청키 스니커즈 화이트', originalPrice: 109000, discountRate: 30, reviewCount: 18765 },
  { brand: 'Dickies', name: '그래픽 후드 스웨트셔츠', originalPrice: 69000, discountRate: 40, reviewCount: 4567 },
  { brand: 'Carhartt WIP', name: 'OG 액티브 자켓 블랙', originalPrice: 259000, discountRate: 18, reviewCount: 2345 },
  { brand: 'Jordan', name: '에어 조던 3 레트로 화이트/세멘트', originalPrice: 269000, discountRate: 10, reviewCount: 12345 },
  { brand: 'Nike', name: 'SB 덩크 로우 화이트/블랙', originalPrice: 139000, discountRate: 12, reviewCount: 16543 },
  { brand: 'Adidas', name: '포럼 로우 클라우드화이트', originalPrice: 109000, discountRate: 25, reviewCount: 7654 },
  { brand: 'New Balance', name: '550 화이트/그린', originalPrice: 139000, discountRate: 15, reviewCount: 11234 },
  { brand: 'Vans', name: '스케이트 하이 블랙', originalPrice: 99000, discountRate: 20, reviewCount: 5678 },
  { brand: 'PUMA', name: '클로이 유니섹스 스니커즈', originalPrice: 149000, discountRate: 38, reviewCount: 3456 },
  { brand: 'Salomon', name: 'SPEEDCROSS 6 트레일화', originalPrice: 189000, discountRate: 22, reviewCount: 4321 },
];

export const products: Product[] = productData.map((item, i) => ({
  id: `product-${i + 1}`,
  ...item,
  price: Math.round((item.originalPrice * (1 - item.discountRate / 100)) / 100) * 100,
  imageUrl: `https://picsum.photos/seed/hiver-product-${i + 1}/400/400`,
  isLiked: Math.random() > 0.8,
}));
