import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import {
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Check,
  Eye,
  MessageCircle,
  ShieldCheck,
  Truck,
  Compass,
  Instagram,
  Phone,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import {
  PRODUCTS,
  HERO_BUILDS,
  VEHICLE_FILTERS,
  Product,
} from './data/products';

interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

export function App() {
  // Hero vehicle state (allows switching between the 2 rim-lit 4x4 builds)
  const [activeBuildIdx, setActiveBuildIdx] = useState(0);
  const currentBuild = HERO_BUILDS[activeBuildIdx];

  // Catalog pagination & filters (3x2 grid = 6 cards per page, matching Reference Image 1)
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllPages, setShowAllPages] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  // Card visual mode: 'cutout' matches Image 1's floating products on golden cards; 'poster' shows full IG graphic
  const [cardImageMode, setCardImageMode] = useState<'cutout' | 'poster'>('cutout');

  // Product Detail Modal
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [modalImageTab, setModalImageTab] = useState<'poster' | 'cutout'>('poster');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [modalQty, setModalQty] = useState(1);

  // Shopping Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ciclon4x4_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Checkout Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerVehicle, setCustomerVehicle] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>('pickup');
  const [shippingCity, setShippingCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'zelle' | 'efectivo' | 'pagomovil'>('zelle');

  // Refs for GSAP animations
  const heroVehicleRef = useRef<HTMLImageElement | null>(null);
  const heroCalloutsRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const stealthTruckRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ciclon4x4_cart', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  // GSAP Hero Entrance & Build Switch Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroVehicleRef.current) {
        gsap.fromTo(
          heroVehicleRef.current,
          { opacity: 0, scale: 0.94, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }
        );
      }
      if (heroCalloutsRef.current) {
        const items = heroCalloutsRef.current.querySelectorAll('.hero-callout-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.14,
            delay: 0.25,
            ease: 'power2.out',
          }
        );
      }
    });
    return () => ctx.revert();
  }, [activeBuildIdx]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesVehicle =
        selectedVehicle === 'Todos' || p.vehicle === selectedVehicle;
      const matchesCat =
        selectedCategory === 'todos' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.brandTitle.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.cardSubtitle.toLowerCase().includes(q) ||
        p.vehicle.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchesVehicle && matchesCat && matchesSearch;
    });
  }, [selectedVehicle, selectedCategory, searchQuery]);

  const ITEMS_PER_PAGE = 6; // Exact 3x2 grid from Reference Image 1
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVehicle, selectedCategory, searchQuery]);

  const displayedProducts = useMemo(() => {
    if (showAllPages) return filteredProducts;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, showAllPages]);

  // GSAP Card Stagger Animation when page or filter changes
  useEffect(() => {
    if (!gridContainerRef.current) return;
    const cards = gridContainerRef.current.querySelectorAll('.ciclon-gold-card');
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    );
  }, [currentPage, selectedVehicle, selectedCategory, showAllPages, cardImageMode]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setModalImageTab('poster');
    setSelectedVariant(product.variants?.[0] || '');
    setModalQty(1);
  };

  const addToCart = (product: Product, qty = 1, variant?: string) => {
    const chosenVariant = variant || product.variants?.[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.variant === chosenVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [...prev, { product, quantity: qty, variant: chosenVariant }];
    });
    triggerToast(`${product.brandTitle} agregado al carrito`);
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const nextQty = updated[index].quantity + delta;
      if (nextQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: nextQty };
      }
      return updated;
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCalloutClick = (slug: string) => {
    const found = PRODUCTS.find((p) => p.slug === slug);
    if (found) {
      openProductModal(found);
    }
  };

  const buildWhatsAppOrderUrl = () => {
    const lines = [
      `Hola *CICLON 4X4 OFF ROAD STORE* (@ciclon4x4store), quiero realizar el siguiente pedido:`,
      ``,
      ...cart.map(
        (item, i) =>
          `${i + 1}. *${item.product.fullName}* (${item.product.sku})${
            item.variant ? ` - Talla: ${item.variant}` : ''
          } x${item.quantity} — *$${(item.product.price * item.quantity).toFixed(2)}*`
      ),
      ``,
      `*TOTAL: $${cartTotal.toFixed(2)} USD*`,
      customerName ? `Cliente: ${customerName}` : '',
      customerPhone ? `Teléfono: ${customerPhone}` : '',
      customerVehicle ? `Camioneta / Vehículo: ${customerVehicle}` : '',
      `Entrega: ${
        deliveryMethod === 'pickup'
          ? 'Retiro en Tienda Ciclón 4x4 Off Road Center'
          : `Envío Nacional (${shippingCity || 'Por definir'})`
      }`,
      `Método de Pago: ${paymentMethod.toUpperCase()}`,
    ].filter(Boolean);

    return `https://wa.me/584126502027?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // Generate ruler ticks for the bottom of Section 1 (exact match to Reference Image 1: 100, 200, 300, 400, 500)
  const rulerTicks = Array.from({ length: 37 }, (_, i) => {
    const isMajor = i % 7 === 3;
    const majorNumber = Math.floor(i / 7 + 1) * 100;
    return { index: i, isMajor, label: isMajor && majorNumber <= 500 ? majorNumber : null };
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111214] border border-[#E5A812] text-white px-5 py-3.5 rounded-full shadow-2xl animate-bounce">
          <span className="w-6 h-6 rounded-full bg-[#E5A812] text-black flex items-center justify-center font-bold text-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
          <span className="text-sm font-medium tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* =====================================================================
          SECTION 1: PITCH-BLACK DRAMATIC HERO (1:1 WITH REFERENCE IMAGE 1)
         ===================================================================== */}
      <section className="relative bg-[#050505] min-h-[590px] md:min-h-[680px] flex flex-col justify-between overflow-hidden select-none">
        {/* Subtle radial dark studio spotlight behind the 4x4 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 52% 54%, rgba(214, 155, 13, 0.11) 0%, rgba(20, 16, 6, 0.05) 38%, rgba(5, 5, 5, 1) 75%)',
          }}
        />

        {/* Top Minimal Navbar (Exact layout of Reference Image 1) */}
        <header className="relative z-20 w-full max-w-[1280px] mx-auto px-6 md:px-14 pt-7 pb-4 flex items-center justify-between">
          {/* Top-Left Golden Emblem Mark */}
          <a
            href="#top"
            className="group flex flex-col items-start gap-0.5 focus:outline-none"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/brand/logo-cross.png"
                alt="Ciclón 4x4 Emblem"
                className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:rotate-12"
              />
              <div className="flex flex-col">
                <span className="font-condensed italic font-black text-lg md:text-xl tracking-wider text-[#E5A812] leading-none">
                  CICLON 4X4
                </span>
                <span className="font-mono-tech text-[8px] tracking-[0.28em] text-[#8E8E93] uppercase mt-0.5">
                  OFF ROAD STORE
                </span>
              </div>
            </div>
          </a>

          {/* Top-Right Minimal Tracked Uppercase Links */}
          <nav className="flex items-center gap-5 sm:gap-8 md:gap-11">
            <a
              href="#productos"
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedVehicle('Todos');
              }}
              className="text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-[#D69B0D] hover:text-[#f3b720] transition-colors"
            >
              PRODUCTOS
            </a>
            <a
              href="#productos"
              onClick={() => {
                setSelectedCategory('iluminacion-rines');
              }}
              className="hidden sm:inline-block text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-[#8A8A8E] hover:text-[#D69B0D] transition-colors"
            >
              RINES & FAROS
            </a>
            <a
              href="#productos"
              onClick={() => {
                setSelectedCategory('camping');
              }}
              className="hidden md:inline-block text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-[#8A8A8E] hover:text-[#D69B0D] transition-colors"
            >
              CAMPING 4X4
            </a>
            <a
              href="#showcase"
              className="hidden sm:inline-block text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-[#8A8A8E] hover:text-[#D69B0D] transition-colors"
            >
              VEHÍCULOS
            </a>
            <a
              href="#contacto"
              className="hidden lg:inline-block text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-[#8A8A8E] hover:text-[#D69B0D] transition-colors"
            >
              NOSOTROS
            </a>

            {/* Minimal Search & Cart Triggers */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  const el = document.getElementById('productos');
                  if (el && !searchOpen) el.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Buscar repuesto"
                className="p-1.5 text-[#8A8A8E] hover:text-[#E5A812] transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  setCartOpen(true);
                }}
                className="relative flex items-center gap-1.5 text-[10px] md:text-[11px] font-mono-tech tracking-[0.16em] uppercase text-[#E5A812] hover:text-white transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>({cartCount})</span>
              </button>
            </div>
          </nav>
        </header>

        {/* Center Low-Key Rim-Lit Off-Road Vehicle + Technical Golden Callouts */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-6">
          <div
            ref={heroCalloutsRef}
            className="relative w-full max-w-[780px] mx-auto flex items-center justify-center min-h-[340px] md:min-h-[430px]"
          >
            {/* Interactive Golden Technical Callout Annotations (Matching "65 M p h |" & "| 3 5 0 m m" in Image 1) */}
            {currentBuild.callouts.map((callout) => (
              <button
                key={callout.id}
                onClick={() => handleCalloutClick(callout.linkedProductSlug)}
                style={{ left: callout.x, top: callout.y }}
                className="hero-callout-item group absolute z-20 -translate-x-1/2 flex flex-col items-center cursor-pointer focus:outline-none"
                title={`Ver producto: ${callout.subLabel}`}
              >
                {callout.direction === 'top' ? (
                  <>
                    <span className="font-mono-tech text-[10px] md:text-[12px] tracking-[0.32em] text-[#C89614] group-hover:text-[#F5B720] transition-colors whitespace-nowrap">
                      {callout.specText}
                    </span>
                    <span className="text-[9px] font-condensed italic tracking-wider text-white/0 group-hover:text-white/90 transition-all duration-200 -mt-0.5 mb-1">
                      {callout.subLabel} →
                    </span>
                    <span
                      style={{ height: `${callout.lineHeight}px` }}
                      className="w-[1px] bg-gradient-to-b from-[#C89614] to-[#C89614]/20 group-hover:from-[#F5B720] group-hover:scale-y-110 transition-all"
                    />
                  </>
                ) : (
                  <>
                    <span
                      style={{ height: `${callout.lineHeight}px` }}
                      className="w-[1px] bg-gradient-to-t from-[#C89614] to-[#C89614]/20 group-hover:from-[#F5B720] group-hover:scale-y-110 transition-all"
                    />
                    <span className="font-mono-tech text-[10px] md:text-[12px] tracking-[0.32em] text-[#C89614] group-hover:text-[#F5B720] transition-colors whitespace-nowrap mt-1.5">
                      {callout.specText}
                    </span>
                    <span className="text-[9px] font-condensed italic tracking-wider text-white/0 group-hover:text-white/90 transition-all duration-200">
                      {callout.subLabel} →
                    </span>
                  </>
                )}
              </button>
            ))}

            {/* Dramatic Low-Key Rim-Lit Off-Road 4x4 Beast */}
            <img
              ref={heroVehicleRef}
              src={currentBuild.image}
              alt={currentBuild.name}
              className="w-[88%] sm:w-[76%] md:w-[68%] max-w-[540px] object-contain pointer-events-auto select-none filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
            />
          </div>

          {/* Subtle Build Switcher Pill above the Ruler Scale */}
          <div className="relative z-20 flex items-center gap-4 mt-1 mb-3">
            {HERO_BUILDS.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setActiveBuildIdx(idx)}
                className={`text-[9px] md:text-[10px] font-mono-tech tracking-[0.24em] uppercase px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeBuildIdx === idx
                    ? 'text-[#E5A812] border border-[#E5A812]/50 bg-[#E5A812]/10'
                    : 'text-white/35 hover:text-white/70 border border-transparent'
                }`}
              >
                {b.code}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Horizon Telemetry Ruler / Gauge Ticks (Exact match to bottom of black section in Image 1) */}
        <div className="relative z-20 w-full max-w-[1160px] mx-auto px-4 pt-2">
          <div className="flex items-end justify-between w-full">
            {rulerTicks.map((tick) => (
              <div
                key={tick.index}
                className="flex flex-col items-center"
              >
                {tick.label && (
                  <span className="font-mono-tech text-[8px] md:text-[9px] tracking-[0.22em] text-[#C89614]/80 mb-1.5">
                    {tick.label}
                  </span>
                )}
                <div
                  className={`w-[1px] ${
                    tick.isMajor
                      ? 'h-3.5 md:h-4 bg-[#D69B0D]'
                      : 'h-1.5 md:h-2 bg-[#D69B0D]/45'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: MUSTARD-GOLD PRODUCT SHOWCASE (1:1 WITH REFERENCE IMAGE 1)
         ===================================================================== */}
      <section
        id="productos"
        className="relative bg-[#D69B0D] text-[#0D0D0D] pt-14 pb-16 md:pt-20 md:pb-24 overflow-hidden"
      >
        {/* Oversized Tone-on-Tone Background Watermark on the Right Side (matching the faint handlebar/wheel watermark in Image 1) */}
        <div className="pointer-events-none absolute -right-24 top-16 bottom-12 w-[520px] md:w-[680px] opacity-[0.13] mix-blend-multiply flex flex-col items-end justify-between select-none">
          <img
            src="/assets/brand/logo-cross.png"
            alt=""
            className="w-[360px] md:w-[460px] object-contain rotate-12 filter grayscale contrast-200"
          />
          <img
            src="/assets/cutouts/rin-16-serie-80.png"
            alt=""
            className="w-[420px] md:w-[540px] object-contain -mr-16 filter grayscale contrast-150"
          />
        </div>

        <div className="relative z-10 max-w-[1060px] mx-auto px-5 sm:px-8">
          {/* Top Technical Header Line with "PRODUCTS" & Fine-Line 4x4 Silhouette (1:1 match to Image 1) */}
          <div className="max-w-[420px] mx-auto mb-10 md:mb-12">
            <div className="flex items-end justify-between px-3 pb-1">
              <span className="font-condensed italic font-medium text-xs md:text-sm tracking-[0.28em] uppercase text-[#231A04]/80">
                PRODUCTS
              </span>

              {/* Fine-line 4x4 Off-Road Truck Silhouette sitting directly on the line (replacing the bicycle icon in Image 1) */}
              <svg
                viewBox="0 0 120 44"
                className="w-16 md:w-20 h-7 text-[#1B1402] -mb-[3px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Roof rack & tent */}
                <path d="M24 10 H76" />
                <path d="M30 10 V13 M48 10 V13 M68 10 V13" />
                {/* 4x4 Land Cruiser Boxy Body Profile */}
                <path d="M14 29 L16 18 L26 13 H75 L84 20 L103 22 L106 29 L108 32 H96" />
                {/* Snorkel on A-pillar */}
                <path d="M84 20 L87 11 H90" />
                {/* Windows */}
                <path d="M28 16 H46 V22 H25 L28 16 Z" />
                <path d="M51 16 H66 V22 H51 Z" />
                <path d="M70 16 H75 L81 22 H70 Z" />
                {/* ARB Front Bullbar */}
                <path d="M106 22 L111 22 L110 31 L105 32" />
                {/* Spare tire on rear door */}
                <rect x="10" y="19" width="4" height="10" rx="1.5" />
                {/* Chassis line between wheels */}
                <path d="M40 32 H78" />
                {/* Rear Off-Road Wheel */}
                <circle cx="30" cy="33" r="8" strokeWidth="1.8" />
                <circle cx="30" cy="33" r="3.5" />
                {/* Front Off-Road Wheel */}
                <circle cx="88" cy="33" r="8" strokeWidth="1.8" />
                <circle cx="88" cy="33" r="3.5" />
              </svg>
            </div>
            <div className="w-full h-[1.5px] bg-[#1E1603]/75" />
          </div>

          {/* Sleek Technical Filter Bar & Search (Harmonized with the Mustard-Gold Palette) */}
          <div className="mb-9 flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'todos', label: 'TODOS (15)' },
                  { id: 'interior', label: 'CONSOLAS & INTERIOR' },
                  { id: 'iluminacion-rines', label: 'RINES & FAROS' },
                  { id: 'proteccion', label: 'WEATHERTECH & FORROS' },
                  { id: 'camping', label: 'CAMPING & OVERLAND' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowAllPages(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full font-condensed italic font-bold text-xs md:text-sm tracking-wider uppercase transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#0D0D0D] text-[#E8AA14] shadow-md'
                        : 'bg-[#0D0D0D]/10 text-[#141004] hover:bg-[#0D0D0D]/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Right Controls: Search Box + Cutout/Poster Toggle */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#141004]/70 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar Machito, 4Runner, Rin..."
                    className="pl-8 pr-7 py-1.5 rounded-full bg-[#0D0D0D]/12 border border-[#0D0D0D]/20 text-xs font-medium text-[#0D0D0D] placeholder-[#141004]/60 focus:outline-none focus:bg-[#0D0D0D]/18 focus:border-[#0D0D0D] w-48 sm:w-56 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0D0D0D]/70 hover:text-black cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Toggle between Studio Cutout Card (Image 1 style) and Original IG Poster */}
                <button
                  onClick={() =>
                    setCardImageMode((prev) =>
                      prev === 'cutout' ? 'poster' : 'cutout'
                    )
                  }
                  title="Cambiar entre Vista Estudio (Cutout) y Arte Original de Instagram"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D0D0D]/12 hover:bg-[#0D0D0D] text-[#0D0D0D] hover:text-[#E8AA14] text-xs font-condensed italic font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  {cardImageMode === 'cutout' ? (
                    <>
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ver Arte IG</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Vista Estudio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vehicle Compatibility Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#1B1402]/70 mr-1 shrink-0">
                VEHÍCULO:
              </span>
              {VEHICLE_FILTERS.map((veh) => (
                <button
                  key={veh}
                  onClick={() => {
                    setSelectedVehicle(veh);
                    setShowAllPages(false);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-condensed italic font-semibold tracking-wide shrink-0 transition-all cursor-pointer ${
                    selectedVehicle === veh
                      ? 'bg-[#141004] text-[#F2B705]'
                      : 'bg-black/5 text-[#1B1402]/80 hover:bg-black/15'
                  }`}
                >
                  {veh}
                </button>
              ))}
            </div>
          </div>

          {/* =================================================================
              3 x 2 GOLDEN PRODUCT CARDS GRID (1:1 WITH REFERENCE IMAGE 1)
             ================================================================= */}
          {displayedProducts.length === 0 ? (
            <div className="ciclon-gold-card p-12 text-center my-8">
              <p className="font-condensed italic font-bold text-2xl text-black mb-2">
                No encontramos repuestos con ese filtro
              </p>
              <button
                onClick={() => {
                  setSelectedVehicle('Todos');
                  setSelectedCategory('todos');
                  setSearchQuery('');
                }}
                className="mt-2 px-5 py-2 rounded-full bg-black text-[#E8AA14] font-condensed italic font-bold tracking-wider uppercase text-sm cursor-pointer"
              >
                Restablecer Catálogo
              </button>
            </div>
          ) : (
            <div
              ref={gridContainerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9"
            >
              {displayedProducts.map((product) => (
                <article
                  key={product.id}
                  onClick={() => openProductModal(product)}
                  className="ciclon-gold-card group relative flex flex-col justify-between p-6 md:p-7 min-h-[320px] md:min-h-[345px] cursor-pointer select-none overflow-hidden"
                >
                  {/* Top-Right Black Slanted "New" Ribbon Badge (Exact match to Reference Image 1) */}
                  {product.isNew && (
                    <div className="new-ribbon-badge absolute top-3.5 right-3.5 z-20 px-3.5 py-0.5 text-xs md:text-sm">
                      New
                    </div>
                  )}

                  {/* Subtle Top-Left Vehicle Compatibility Tag on Hover */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono-tech text-[9px] uppercase tracking-[0.18em] text-black/45 group-hover:text-black/75 transition-colors">
                      {product.vehicle}
                    </span>
                  </div>

                  {/* Center Floating Product Visual */}
                  <div className="relative z-10 my-auto py-3 flex items-center justify-center h-[185px] md:h-[200px]">
                    {cardImageMode === 'cutout' ? (
                      <img
                        src={product.cutoutImg}
                        alt={product.fullName}
                        loading="lazy"
                        className="product-cutout-shadow max-h-[168px] md:max-h-[182px] max-w-[88%] object-contain"
                      />
                    ) : (
                      <img
                        src={product.postImg}
                        alt={product.fullName}
                        loading="lazy"
                        className="max-h-[180px] w-auto rounded-xl shadow-lg object-contain border border-black/15 transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Bottom Card Typography: Bold Italic Brand Title + Thin Italic Subtitle on Left, Bold White Italic Price on Right (1:1 with Image 1) */}
                  <div className="relative z-10 pt-2 flex items-end justify-between gap-3">
                    <div className="text-left">
                      <h3 className="font-condensed italic font-extrabold text-[23px] md:text-[26px] leading-none text-[#0B0B0B] tracking-tight">
                        {product.brandTitle}
                      </h3>
                      <p className="font-condensed italic font-normal text-[12px] md:text-[13px] leading-[1.2] text-[#2B2004]/80 mt-1 whitespace-pre-line line-clamp-2">
                        {product.cardSubtitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      {/* Quick Add Button appearing on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        aria-label={`Agregar ${product.brandTitle} al carrito`}
                        className="mb-1.5 px-2.5 py-1 rounded-full bg-[#0B0B0B] text-[#E8AA14] text-[10px] font-condensed italic font-bold uppercase tracking-wider opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:text-black flex items-center gap-1 shadow-md cursor-pointer"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                        <span>Agregar</span>
                      </button>

                      {/* Signature Bold Condensed Italic White Price */}
                      <span className="font-condensed italic font-extrabold text-[19px] md:text-[21px] leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                        {product.price.toFixed(2)}$
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =================================================================
              BOTTOM PAGINATION DOTS + ACTIVE PAGE NUMBER (1:1 WITH IMAGE 1)
             ================================================================= */}
          <div className="mt-14 md:mt-16 flex flex-col items-center justify-center gap-3">
            {!showAllPages && totalPages > 1 && (
              <div className="flex items-start justify-center gap-3.5">
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                      aria-label={`Página ${pageNum}`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-[#090909] scale-110'
                            : 'bg-[#090909]/25 group-hover:bg-[#090909]/55'
                        }`}
                      />
                      <span
                        className={`font-condensed italic font-bold text-xs leading-none transition-opacity ${
                          isActive
                            ? 'text-[#090909] opacity-100'
                            : 'opacity-0 group-hover:opacity-50 text-[#090909]'
                        }`}
                      >
                        {pageNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Toggle to view all 15 products simultaneously or paginated 3x2 */}
            <button
              onClick={() => setShowAllPages((prev) => !prev)}
              className="mt-1 text-[11px] font-mono-tech uppercase tracking-[0.22em] text-[#1A1302]/75 hover:text-black underline underline-offset-4 cursor-pointer transition-colors"
            >
              {showAllPages
                ? 'Mostrar Cuadrícula 3×2 Paginada (6 por página)'
                : `Ver los ${filteredProducts.length} Productos Completos`}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: DARK CHARCOAL SPLIT SHOWCASE BANNER (1:1 WITH IMAGE 1)
         ===================================================================== */}
      <section
        id="showcase"
        className="relative bg-[#17181A] py-16 md:py-24 px-6 md:px-14 overflow-hidden border-t border-white/5"
      >
        {/* Subtle dark radial floor glow under the stealth 4x4 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 32% 62%, rgba(255, 255, 255, 0.05) 0%, rgba(23, 24, 26, 1) 65%)',
          }}
        />

        <div className="relative z-10 max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8">
          {/* Left 7 Columns: Stealth Matte-Black Side-Profile 4x4 (Prado 250 Stealth Edition) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <img
              ref={stealthTruckRef}
              src="/assets/vehicles/prado-250-stealth.png"
              alt="Toyota Land Cruiser Prado 250 Stealth Profile"
              className="w-full max-w-[560px] object-contain filter drop-shadow-[0_28px_24px_rgba(0,0,0,0.85)] transition-transform duration-700 hover:scale-[1.03]"
            />
            {/* Floor contact shadow line */}
            <div className="w-[82%] max-w-[490px] h-3 -mt-2 rounded-full bg-black/80 blur-md" />
          </div>

          {/* Right 5 Columns: Golden Border Pill Button "TAKE A LOOK" + Golden Caption (1:1 with Image 1) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-10">
            <button
              onClick={() => {
                setSelectedVehicle('Prado 250 (LC250)');
                setSelectedCategory('todos');
                const el = document.getElementById('productos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-11 py-3 rounded-full border border-[#D69B0D] bg-transparent hover:bg-[#D69B0D] text-[#D69B0D] hover:text-black font-mono-tech text-xs md:text-sm font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(214,155,13,0.12)] hover:shadow-[0_0_30px_rgba(214,155,13,0.45)] cursor-pointer"
            >
              TAKE A LOOK
            </button>

            <p className="mt-3.5 max-w-[270px] text-[10px] md:text-[11px] leading-[1.45] text-[#D69B0D]/75 font-normal">
              Equipa tu Toyota Machito, Autana, 4Runner, Tacoma, Prado 250 o Jeep con piezas originales en{' '}
              <a
                href="https://wa.me/584126502027"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#E8AA14] hover:underline block mt-0.5"
              >
                @ciclon4x4store — Off Road Center
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: MUSTARD-GOLD EDITORIAL FOOTER (1:1 WITH REFERENCE IMAGE 1)
         ===================================================================== */}
      <footer
        id="contacto"
        className="relative bg-[#D69B0D] text-[#0B0B0B] pt-16 pb-14 md:pt-24 md:pb-20 px-6 md:px-14 overflow-hidden"
      >
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Left 3 Columns: Brand Emblem Mark + Tiny Signature Tagline */}
          <div className="md:col-span-3 flex flex-col items-start">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/brand/logo-circle.png"
                alt="Ciclón 4x4 Logo"
                className="w-14 h-14 rounded-full shadow-lg object-contain border border-black/20"
              />
              <div>
                <span className="font-condensed italic font-black text-xl tracking-wider text-[#0B0B0B] block leading-none">
                  CICLON 4X4
                </span>
                <span className="font-mono-tech text-[8px] tracking-[0.24em] text-[#231A04] uppercase">
                  OFF ROAD STORE
                </span>
              </div>
            </div>
            <span className="font-script italic text-sm text-[#2A1F04]/80 mt-2 pl-1">
              Ciclon 4x4 Off Road Center
            </span>
          </div>

          {/* Right 9 Columns: Bold Italic Quote + 3-Column Contact & References Grid (1:1 with Image 1) */}
          <div className="md:col-span-9 flex flex-col">
            {/* Bold Condensed Italic Black Quote */}
            <blockquote className="font-condensed italic font-extrabold text-2xl sm:text-3xl md:text-[34px] leading-[1.12] text-[#0B0B0B] tracking-tight max-w-[680px]">
              “ Equipa tu rústico con repuestos originales y accesorios off-road; dominemos el terreno juntos ”
            </blockquote>

            {/* 3-Column Contact / References / Socials Row */}
            <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
              {/* Column 1: "Say hi !" */}
              <div>
                <h4 className="font-script italic text-2xl md:text-[26px] text-[#4A3505] mb-2 leading-none">
                  Say hi !
                </h4>
                <a
                  href="mailto:ciclon4x4store@gmail.com"
                  className="block font-condensed italic font-extrabold text-sm md:text-[15px] text-[#0B0B0B] hover:underline tracking-wide"
                >
                  ciclon4x4store@gmail.com
                </a>
                <a
                  href="https://wa.me/584126502027"
                  target="_blank"
                  rel="noreferrer"
                  className="block font-condensed italic font-extrabold text-sm md:text-[15px] text-[#0B0B0B] hover:underline tracking-wide mt-0.5"
                >
                  +58 412 650 20 27
                </a>
              </div>

              {/* Column 2: "References" */}
              <div>
                <h4 className="font-script italic text-2xl md:text-[26px] text-[#4A3505] mb-2 leading-none">
                  References
                </h4>
                <a
                  href="#productos"
                  className="block font-condensed italic font-extrabold text-sm md:text-[15px] text-[#0B0B0B] hover:underline tracking-wide"
                >
                  www.instagram.com/ciclon4x4store
                </a>
                <a
                  href="#productos"
                  className="block font-condensed italic font-extrabold text-sm md:text-[15px] text-[#0B0B0B] hover:underline tracking-wide mt-0.5"
                >
                  toyota • jeep • tjm • weathertech
                </a>
              </div>

              {/* Column 3: Social Icons + Terms & Privacy */}
              <div className="flex flex-col sm:items-end justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <a
                    href="#productos"
                    aria-label="Instagram @ciclon4x4store"
                    className="w-7 h-7 rounded bg-[#0B0B0B]/15 hover:bg-[#0B0B0B] text-[#0B0B0B] hover:text-[#D69B0D] flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://wa.me/584126502027"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp Ciclón 4x4"
                    className="w-7 h-7 rounded bg-[#0B0B0B]/15 hover:bg-[#0B0B0B] text-[#0B0B0B] hover:text-[#D69B0D] flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#contacto"
                    aria-label="Ubicación Ciclón 4x4 Off Road Center"
                    className="w-7 h-7 rounded bg-[#0B0B0B]/15 hover:bg-[#0B0B0B] text-[#0B0B0B] hover:text-[#D69B0D] flex items-center justify-center transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="text-left sm:text-right font-condensed italic text-[11px] leading-tight tracking-wider uppercase text-[#3A2903]">
                  <span className="block">TERMS & CONDITIONS</span>
                  <span className="block">PRIVACY POLICY</span>
                </div>
              </div>
            </div>

            {/* Bottom Fine Italic Disclaimer (Exact match to bottom of Image 1) */}
            <div className="mt-10 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="font-condensed italic text-xs text-[#3A2903]/85 max-w-[460px] leading-relaxed">
                Repuestos originales Toyota OEM, accesorios TJM 4x4 Equipped, Kosmegal y WeatherTech. Envíos a nivel nacional y retiro directo en Ciclón 4x4 Off Road Center.
              </p>

              <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center text-[10px] font-mono-tech font-bold text-black/70">
                4×4
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          PRODUCT QUICK-VIEW & TECHNICAL SPEC MODAL (SHOWS BOTH CUTOUT & FULL ORIGINAL IG POST)
         ===================================================================== */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="relative w-full max-w-[920px] bg-[#111214] border border-[#E5A812]/35 rounded-3xl overflow-hidden shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E5A812] text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left 6 Columns: Visual Showcase with Toggle between Original IG Reference Post & Studio Cutout */}
              <div className="md:col-span-6 bg-gradient-to-b from-[#E8AA14] to-[#C98F09] p-6 flex flex-col justify-between relative min-h-[380px]">
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-black text-[#E8AA14] font-mono-tech text-[10px] uppercase tracking-widest">
                    {activeProduct.sku}
                  </span>

                  <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full">
                    <button
                      onClick={() => setModalImageTab('poster')}
                      className={`px-3 py-1 rounded-full text-[11px] font-condensed italic font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        modalImageTab === 'poster'
                          ? 'bg-black text-[#E8AA14]'
                          : 'text-black/80 hover:text-black'
                      }`}
                    >
                      Arte Original IG
                    </button>
                    <button
                      onClick={() => setModalImageTab('cutout')}
                      className={`px-3 py-1 rounded-full text-[11px] font-condensed italic font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        modalImageTab === 'cutout'
                          ? 'bg-black text-[#E8AA14]'
                          : 'text-black/80 hover:text-black'
                      }`}
                    >
                      Vista Pieza
                    </button>
                  </div>
                </div>

                <div className="my-auto py-4 flex items-center justify-center">
                  {modalImageTab === 'poster' ? (
                    <img
                      src={activeProduct.postImg}
                      alt={activeProduct.fullName}
                      className="max-h-[370px] w-auto rounded-2xl shadow-2xl border border-black/20 object-contain"
                    />
                  ) : (
                    <img
                      src={activeProduct.cutoutImg}
                      alt={activeProduct.fullName}
                      className="max-h-[310px] w-auto object-contain filter drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]"
                    />
                  )}
                </div>

                <div className="text-center">
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-black/75">
                    @ciclon4x4store • Repuesto Verificado
                  </span>
                </div>
              </div>

              {/* Right 6 Columns: Technical Details, Variants & Add to Cart */}
              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between text-white">
                <div>
                  <div className="flex items-center gap-2 text-[#E5A812] text-xs font-mono-tech uppercase tracking-widest mb-2">
                    <span>{activeProduct.categoryLabel}</span>
                    <span>•</span>
                    <span>{activeProduct.vehicle}</span>
                  </div>

                  <h2 className="font-condensed italic font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
                    {activeProduct.fullName}
                  </h2>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-condensed italic font-black text-3xl text-[#E5A812]">
                      ${activeProduct.price.toFixed(2)} USD
                    </span>
                    <span className="text-xs text-emerald-400 font-mono-tech uppercase">
                      ● Disponible en Stock
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                    {activeProduct.description}
                  </p>

                  {/* Variant Selector if product has sizes (e.g., Zega Car Cover XL, M, L) */}
                  {activeProduct.variants && activeProduct.variants.length > 0 && (
                    <div className="mt-5">
                      <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-2">
                        SELECCIONA MEDIDA / TALLA:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {activeProduct.variants.map((v) => (
                          <button
                            key={v}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              selectedVariant === v
                                ? 'border-[#E5A812] bg-[#E5A812]/15 text-[#E5A812]'
                                : 'border-white/15 text-zinc-400 hover:border-white/35'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Specs Table */}
                  <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                    {activeProduct.specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/5"
                      >
                        <span className="text-zinc-400 font-mono-tech uppercase text-[10px]">
                          {s.label}
                        </span>
                        <span className="text-white font-medium text-right">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-7 pt-4 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-white/20 rounded-full px-3 py-2 bg-black/40">
                      <button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono-tech text-sm font-bold">
                        {modalQty}
                      </span>
                      <button
                        onClick={() => setModalQty((q) => q + 1)}
                        className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(activeProduct, modalQty, selectedVariant);
                        setActiveProduct(null);
                        setCheckoutStep('cart');
                        setCartOpen(true);
                      }}
                      className="flex-1 py-3.5 px-6 rounded-full bg-[#E5A812] hover:bg-[#f4b61d] text-black font-condensed italic font-black text-lg tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Agregar • ${(activeProduct.price * modalQty).toFixed(2)}
                      </span>
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/584126502027?text=${encodeURIComponent(
                      `Hola Ciclón 4x4! Me interesa: ${activeProduct.fullName} (${activeProduct.sku}) - $${activeProduct.price.toFixed(2)}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-full border border-white/15 hover:border-[#E5A812] text-zinc-300 hover:text-[#E5A812] text-xs font-mono-tech uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Consultar Compatibilidad por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE-OVER SHOPPING CART & CHECKOUT DRAWER
         ===================================================================== */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="w-full max-w-[440px] bg-[#101113] border-l border-[#E5A812]/30 h-full flex flex-col justify-between text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/brand/logo-cross.png"
                  alt=""
                  className="w-7 h-7 object-contain"
                />
                <div>
                  <h3 className="font-condensed italic font-black text-2xl tracking-wide text-[#E5A812] leading-none">
                    {checkoutStep === 'cart'
                      ? 'TU EQUIPO 4X4'
                      : checkoutStep === 'checkout'
                      ? 'FINALIZAR ORDEN'
                      : '¡ORDEN LISTA!'}
                  </h3>
                  <span className="font-mono-tech text-[10px] text-zinc-400 uppercase tracking-widest">
                    {cartCount} {cartCount === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#E5A812] text-zinc-300 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-[#E5A812]/40 mb-3" />
                  <p className="font-condensed italic font-bold text-2xl text-white">
                    Tu carrito 4x4 está vacío
                  </p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
                    Explora nuestras consolas originales, rines Toyota, faros 4Runner y equipos TJM.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#E5A812] text-black font-condensed italic font-extrabold uppercase tracking-wider text-sm cursor-pointer"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : checkoutStep === 'cart' ? (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.variant || ''}`}
                      className="flex gap-3.5 p-3.5 rounded-2xl bg-[#181A1D] border border-white/10 items-center"
                    >
                      <div className="w-20 h-20 rounded-xl bg-[#E8AA14] p-2 flex items-center justify-center shrink-0">
                        <img
                          src={item.product.cutoutImg}
                          alt={item.product.brandTitle}
                          className="max-h-full max-w-full object-contain filter drop-shadow"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-condensed italic font-extrabold text-lg text-white leading-tight truncate">
                          {item.product.brandTitle}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate">
                          {item.product.fullName}
                        </p>
                        {item.variant && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#E5A812]/15 text-[#E5A812] font-mono-tech text-[10px]">
                            {item.variant}
                          </span>
                        )}

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-black/50 rounded-full px-2.5 py-1 border border-white/10">
                            <button
                              onClick={() => updateCartQty(idx, -1)}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono-tech text-xs font-bold px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(idx, 1)}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-condensed italic font-extrabold text-lg text-[#E5A812]">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#181A1D] border border-white/15 text-sm text-white focus:outline-none focus:border-[#E5A812]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                      WhatsApp / Teléfono
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej. +58 412 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#181A1D] border border-white/15 text-sm text-white focus:outline-none focus:border-[#E5A812]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                      Tu Camioneta / Modelo 4x4 (Para verificar calce)
                    </label>
                    <input
                      type="text"
                      value={customerVehicle}
                      onChange={(e) => setCustomerVehicle(e.target.value)}
                      placeholder="Ej. Toyota Machito 2024 / 4Runner 2019"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#181A1D] border border-white/15 text-sm text-white focus:outline-none focus:border-[#E5A812]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                      Modalidad de Entrega
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          deliveryMethod === 'pickup'
                            ? 'border-[#E5A812] bg-[#E5A812]/15 text-white'
                            : 'border-white/10 bg-[#181A1D] text-zinc-400'
                        }`}
                      >
                        <span className="font-condensed italic font-bold text-sm block">
                          Retiro en Tienda
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Ciclón 4x4 Center
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('shipping')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          deliveryMethod === 'shipping'
                            ? 'border-[#E5A812] bg-[#E5A812]/15 text-white'
                            : 'border-white/10 bg-[#181A1D] text-zinc-400'
                        }`}
                      >
                        <span className="font-condensed italic font-bold text-sm block">
                          Envío Nacional
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Zoom / MRW / Tealca
                        </span>
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'shipping' && (
                    <div>
                      <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                        Ciudad y Agencia de Destino
                      </label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        placeholder="Ej. Valencia / Caracas / Lechería"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#181A1D] border border-white/15 text-sm text-white focus:outline-none focus:border-[#E5A812]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-mono-tech text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: 'zelle', label: 'Zelle USD' },
                          { id: 'efectivo', label: 'Efectivo' },
                          { id: 'pagomovil', label: 'Pago Móvil' },
                        ] as const
                      ).map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`py-2 px-3 rounded-xl border text-xs font-condensed italic font-bold uppercase tracking-wider cursor-pointer ${
                            paymentMethod === pm.id
                              ? 'border-[#E5A812] bg-[#E5A812] text-black'
                              : 'border-white/15 text-zinc-300'
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#15171A]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
                    TOTAL ESTIMADO
                  </span>
                  <span className="font-condensed italic font-black text-3xl text-[#E5A812]">
                    ${cartTotal.toFixed(2)} USD
                  </span>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full py-3.5 rounded-full bg-[#E5A812] hover:bg-[#f3b61f] text-black font-condensed italic font-black text-lg uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                  >
                    Continuar con el Pedido →
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    <a
                      href={buildWhatsAppOrderUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-full bg-[#E5A812] hover:bg-[#f3b61f] text-black font-condensed italic font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Enviar Orden a WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="w-full py-2 text-xs font-mono-tech uppercase tracking-widest text-zinc-400 hover:text-white cursor-pointer"
                    >
                      ← Volver al Carrito
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
