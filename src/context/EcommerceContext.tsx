import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Voucher,
  Order,
  UserProfile,
  LiveStream,
  OrderStatus,
} from '../types';
import {
  INITIAL_USER,
  MOCK_PRODUCTS,
  MOCK_VOUCHERS,
  MOCK_LIVE_STREAMS,
} from '../data/mockData';

interface EcommerceContextType {
  activeTab: 'home' | 'live' | 'categories' | 'cart' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'live' | 'categories' | 'cart' | 'orders' | 'profile') => void;
  user: UserProfile;
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  useCoins: boolean;
  selectedProduct: Product | null;
  activeLiveStream: LiveStream | null;
  searchQuery: string;
  selectedCategory: string;
  showSearchModal: boolean;
  showCartDrawer: boolean;
  showCheckoutModal: boolean;
  showDailyCheckin: boolean;
  toastMessage: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setShowSearchModal: (show: boolean) => void;
  setShowCartDrawer: (show: boolean) => void;
  setShowCheckoutModal: (show: boolean) => void;
  setShowDailyCheckin: (show: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setActiveLiveStream: (stream: LiveStream | null) => void;
  setUseCoins: (use: boolean) => void;
  showToast: (msg: string) => void;

  addToCart: (product: Product, quantity?: number, variantText?: string, price?: number) => void;
  updateCartQty: (itemId: string, delta: number) => void;
  toggleCartItem: (itemId: string) => void;
  toggleSelectAllCart: (select: boolean) => void;
  removeFromCart: (itemId: string) => void;
  clearCheckedCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyVoucher: (voucher: Voucher | null) => void;
  claimVoucher: (voucherId: string) => void;
  claimDailyReward: (day: number) => void;
  topUpWallet: (amount: number) => void;
  placeOrder: (shippingFee: number, shippingMethodName: string, paymentMethodName: string) => Order;
  cancelOrder: (orderId: string) => void;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'live' | 'categories' | 'cart' | 'orders' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1']);
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(MOCK_VOUCHERS[0]);
  const [useCoins, setUseCoins] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeLiveStream, setActiveLiveStream] = useState<LiveStream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat-all');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDailyCheckin, setShowDailyCheckin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial cart items
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      product: MOCK_PRODUCTS[2], // Erigo T-shirt
      selectedVariantText: 'Hitam Jet Black, L',
      selectedPrice: 99000,
      quantity: 2,
      checked: true,
    },
    {
      id: 'cart-init-2',
      product: MOCK_PRODUCTS[3], // Somethinc
      selectedVariantText: '50 ml (Regular Size)',
      selectedPrice: 139000,
      quantity: 1,
      checked: true,
    },
  ]);

  // Initial mock orders to showcase realistic tracking immediately!
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'INV/20261005/MPX/928471',
      createdAt: 'Kemarin, 14:20 WIB',
      items: [
        {
          product: MOCK_PRODUCTS[1],
          quantity: 1,
          price: 4599000,
          variantText: 'Black Obsidian',
        },
      ],
      totalAmount: 4549000,
      shippingFee: 0,
      discountAmount: 50000,
      coinsUsed: 0,
      status: 'shipping',
      shippingAddress: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
      shippingCourier: 'SiCepat REG (Resi: SCPT-8829104)',
      trackingNumber: 'SCPT-8829104',
      paymentMethod: 'GoPay',
      timeline: [
        { status: 'Pesanan Dibuat', description: 'Menunggu pembayaran dan verifikasi', time: '04 Okt 14:20', isPassed: true },
        { status: 'Pembayaran Dikonfirmasi', description: 'Pembayaran via GoPay terverifikasi', time: '04 Okt 14:21', isPassed: true },
        { status: 'Diproses Penjual', description: 'Pesanan sedang dikemas oleh Sony Audio Indonesia', time: '04 Okt 16:00', isPassed: true },
        { status: 'Dalam Pengiriman', description: 'Paket telah dibawa kurir [Bpk. Joko Susilo] menuju alamat tujuan', time: 'Hari ini, 08:30', isPassed: true },
        { status: 'Pesanan Selesai', description: 'Paket telah diterima pemesan', time: 'Estimasi Hari ini 17:00', isPassed: false },
      ],
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1, variantText?: string, price?: number) => {
    const finalPrice = price ?? product.price;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariantText === variantText
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          checked: true,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          selectedVariantText: variantText,
          selectedPrice: finalPrice,
          quantity,
          checked: true,
        },
      ];
    });
    showToast(`Berhasil dimasukkan ke Keranjang!`);
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleCartItem = (itemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    );
  };

  const toggleSelectAllCart = (select: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, checked: select })));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Produk dihapus dari keranjang');
  };

  const clearCheckedCart = () => {
    setCart((prev) => prev.filter((item) => !item.checked));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Dihapus dari Favorit');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('❤️ Ditambahkan ke Favorit');
        return [...prev, productId];
      }
    });
  };

  const applyVoucher = (voucher: Voucher | null) => {
    setAppliedVoucher(voucher);
    if (voucher) {
      showToast(`Voucher ${voucher.title} diterapkan!`);
    } else {
      showToast('Voucher dilepas');
    }
  };

  const claimVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, claimed: true } : v))
    );
    showToast('Kupon berhasil diklaim ke dompet Anda!');
  };

  const claimDailyReward = (day: number) => {
    const coinReward = day * 300 + 200;
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + coinReward,
    }));
    showToast(`🎉 Selamat! Anda mendapat +${coinReward} Koin BeliKuy!`);
  };

  const topUpWallet = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    showToast(`Top Up Berhasil! Saldo bertambah Rp ${amount.toLocaleString('id-ID')}`);
  };

  const placeOrder = (
    shippingFee: number,
    shippingMethodName: string,
    paymentMethodName: string
  ): Order => {
    const checkedItems = cart.filter((i) => i.checked);
    const subtotal = checkedItems.reduce((acc, curr) => acc + curr.selectedPrice * curr.quantity, 0);

    let discount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discountType === 'shipping') {
        discount += Math.min(shippingFee, appliedVoucher.discountAmount);
      } else if (appliedVoucher.discountType === 'percentage') {
        const discCalc = (subtotal * appliedVoucher.discountAmount) / 100;
        discount += appliedVoucher.maxDiscount ? Math.min(discCalc, appliedVoucher.maxDiscount) : discCalc;
      } else if (appliedVoucher.discountType === 'fixed') {
        discount += appliedVoucher.discountAmount;
      }
    }

    const coinDeduction = useCoins ? Math.min(user.coins, 25000) : 0;
    const finalTotal = Math.max(0, subtotal + shippingFee - discount - coinDeduction);

    const orderId = `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/BK/${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNo = `BKX-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: 'Baru saja',
      items: checkedItems.map((c) => ({
        product: c.product,
        quantity: c.quantity,
        price: c.selectedPrice,
        variantText: c.selectedVariantText,
      })),
      totalAmount: finalTotal,
      shippingFee,
      discountAmount: discount,
      coinsUsed: coinDeduction,
      status: 'packing',
      shippingAddress: user.addresses[0].fullAddress + ', ' + user.addresses[0].city,
      shippingCourier: `${shippingMethodName} (Resi: ${trackingNo})`,
      trackingNumber: trackingNo,
      paymentMethod: paymentMethodName,
      timeline: [
        {
          status: 'Pesanan Berhasil Dibuat',
          description: `Pembayaran via ${paymentMethodName} berhasil diverifikasi`,
          time: 'Baru saja',
          isPassed: true,
        },
        {
          status: 'Sedang Dikemas Penjual',
          description: 'Penjual sedang menyiapkan barang dan nomor resi pengiriman',
          time: 'Baru saja',
          isPassed: true,
        },
        {
          status: 'Menunggu Penjemputan Kurir',
          description: `Kurir ${shippingMethodName} dijadwalkan menjemput paket hari ini`,
          time: 'Estimasi 2 Jam ke depan',
          isPassed: false,
        },
        {
          status: 'Dalam Pengiriman',
          description: 'Paket dalam perjalanan ke alamat tujuan',
          time: 'Estimasi Besok',
          isPassed: false,
        },
        {
          status: 'Selesai',
          description: 'Paket diterima oleh pembeli',
          time: 'Estimasi 1-2 Hari',
          isPassed: false,
        },
      ],
    };

    // Deduct coins & wallet if used
    if (useCoins && coinDeduction > 0) {
      setUser((prev) => ({ ...prev, coins: prev.coins - coinDeduction }));
    }
    if (paymentMethodName.includes('GoPay') || paymentMethodName.includes('ShopeePay')) {
      setUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - finalTotal),
      }));
    }

    // Add to orders and clear checked items
    setOrders((prev) => [newOrder, ...prev]);
    clearCheckedCart();
    setUseCoins(false);
    showToast('🎉 Pembayaran Berhasil! Pesanan Anda sedang diproses.');

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o))
    );
    showToast('Pesanan berhasil dibatalkan');
  };

  return (
    <EcommerceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        products,
        cart,
        wishlist,
        orders,
        vouchers,
        appliedVoucher,
        useCoins,
        selectedProduct,
        activeLiveStream,
        searchQuery,
        selectedCategory,
        showSearchModal,
        showCartDrawer,
        showCheckoutModal,
        showDailyCheckin,
        toastMessage,
        setSearchQuery,
        setSelectedCategory,
        setShowSearchModal,
        setShowCartDrawer,
        setShowCheckoutModal,
        setShowDailyCheckin,
        setSelectedProduct,
        setActiveLiveStream,
        setUseCoins,
        showToast,
        addToCart,
        updateCartQty,
        toggleCartItem,
        toggleSelectAllCart,
        removeFromCart,
        clearCheckedCart,
        toggleWishlist,
        applyVoucher,
        claimVoucher,
        claimDailyReward,
        topUpWallet,
        placeOrder,
        cancelOrder,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
