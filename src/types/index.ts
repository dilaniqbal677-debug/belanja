export interface ProductVariant {
  id: string;
  name: string;
  options: {
    label: string;
    priceModifier: number;
    inStock: boolean;
    image?: string;
  }[];
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  variant: string;
  comment: string;
  images?: string[];
  helpfulCount: number;
}

export interface StoreInfo {
  id: string;
  name: string;
  avatar: string;
  isOfficial: boolean;
  isPowerMerchant: boolean;
  location: string;
  rating: number;
  responseRate: string;
  followers: string;
  joinedYears: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  city: string;
  isOfficial: boolean;
  isStarSeller: boolean;
  isGratisOngkirXtra: boolean;
  isCodAvailable: boolean;
  cashbackPercent?: number;
  category: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  store: StoreInfo;
  variants?: ProductVariant[];
  stock: number;
  reviews: ProductReview[];
  isFlashSale?: boolean;
  flashSaleStockLeft?: number;
  flashSaleTotalStock?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariantText?: string;
  selectedPrice: number;
  quantity: number;
  checked: boolean;
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountAmount: number; // e.g., 20% or Rp20.000
  minSpend: number;
  maxDiscount?: number;
  validUntil: string;
  category: 'ongkir' | 'cashback' | 'diskon';
  claimed: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  courier: string;
  etd: string;
  price: number;
  description: string;
}

export interface PaymentMethod {
  id: string;
  category: 'ewallet' | 'va' | 'qris' | 'cod' | 'paylater';
  name: string;
  iconName: string;
  balance?: number;
  description?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  variantText?: string;
}

export type OrderStatus = 'unpaid' | 'packing' | 'shipping' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  coinsUsed: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingCourier: string;
  trackingNumber: string;
  paymentMethod: string;
  timeline: {
    status: string;
    description: string;
    time: string;
    isPassed: boolean;
  }[];
}

export interface LiveStream {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  thumbnail: string;
  viewers: number;
  likes: number;
  featuredProduct: Product;
  discountText: string;
  videoPlaceholderUrl?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  walletBalance: number; // GoPay / ShopeePay
  coins: number;
  activeVouchersCount: number;
  addresses: {
    id: string;
    label: string;
    recipient: string;
    phone: string;
    fullAddress: string;
    city: string;
    isPrimary: boolean;
  }[];
}
