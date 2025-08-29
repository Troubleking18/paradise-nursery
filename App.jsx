import React, { useMemo, useState } from "react";
import { ShoppingCart, Leaf, Sprout, Home, Trash2, Minus, Plus } from "lucide-react";

// Paradise Nursery - Single-file React app
// - Three pages: Landing, Products, Cart
// - TailwindCSS for styling
// - Client-side state for cart and navigation
// - No backend required

// Utility to format currency
const fmt = (n) => `$${n.toFixed(2)}`;

// Generate a simple SVG placeholder with the plant's name
const svgDataUri = (label) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='#a7f3d0'/>
        <stop offset='100%' stop-color='#34d399'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <g fill='#064e3b'>
      <text x='50%' y='54%' text-anchor='middle' font-size='36' font-family='Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'>${label}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PRODUCTS = [
  { id: "p1", name: "Monstera Deliciosa", price: 24.99, category: "Tropical", img: svgDataUri("Monstera") },
  { id: "p2", name: "Snake Plant", price: 14.5, category: "Low Light", img: svgDataUri("Snake Plant") },
  { id: "p3", name: "Peace Lily", price: 18.0, category: "Blooming", img: svgDataUri("Peace Lily") },
  { id: "p4", name: "ZZ Plant", price: 19.75, category: "Low Light", img: svgDataUri("ZZ Plant") },
  { id: "p5", name: "Fiddle Leaf Fig", price: 29.99, category: "Tropical", img: svgDataUri("Fiddle Leaf Fig") },
  { id: "p6", name: "Aloe Vera", price: 12.0, category: "Succulent", img: svgDataUri("Aloe Vera") },
  { id: "p7", name: "Jade Plant", price: 15.99, category: "Succulent", img: svgDataUri("Jade Plant") },
  { id: "p8", name: "Orchid Phalaenopsis", price: 22.5, category: "Blooming", img: svgDataUri("Orchid") },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

function Header({ current, onNavigate, cartCount }) {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur border-b border-emerald-100">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="font-semibold text-lg text-emerald-800">Paradise Nursery</span>
        </div>
        <nav className="flex items-center gap-2">
          {current !== "landing" && (
            <button
              onClick={() => onNavigate("landing")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition"
            >
              <Home className="h-4 w-4" /> Home
            </button>
          )}
          {current !== "products" && (
            <button
              onClick={() => onNavigate("products")}
              className="px-3 py-2 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition"
            >
              Browse Plants
            </button>
          )}
          {current !== "cart" && (
            <button
              onClick={() => onNavigate("cart")}
              className="relative px-3 py-2 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition"
            >
              <span className="inline-flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Cart</span>
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                {cartCount}
              </span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function Landing({ onGetStarted }) {
  const bg = svgDataUri("Welcome to Paradise Nursery");
  return (
    <main
      className="min-h-[75vh] flex items-center"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="backdrop-blur bg-white/70 rounded-3xl p-8 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-900 mb-4">
            Bring the Jungle Home
          </h1>
          <p className="text-emerald-900/90 text-lg leading-relaxed mb-6">
            Paradise Nursery curates easy-care houseplants that thrive in real homes. From low-light heroes to statement foliage,
            we make it simple to green up your space with plants delivered fresh from our growers.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-3 text-base font-semibold shadow hover:bg-emerald-700 transition"
          >
            Get Started <Sprout className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <div className="group rounded-2xl border border-emerald-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={product.img} alt={product.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-emerald-900">{product.name}</h3>
          <span className="text-emerald-700 font-medium">{fmt(product.price)}</span>
        </div>
        <p className="mt-1 text-sm text-emerald-700/70">{product.category}</p>
        <button
          onClick={() => onAdd(product)}
          className="mt-3 w-full rounded-xl bg-emerald-600 text-white py-2 font-medium hover:bg-emerald-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ProductsPage({ onAdd, onNavigate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, category]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">Browse Plants</h2>
          <p className="text-emerald-700/80">Explore by category or search by name.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plants..."
            className="flex-1 sm:w-64 rounded-xl border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-emerald-200 px-3 py-2 focus:ring-2 focus:ring-emerald-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={() => onNavigate("cart")}
            className="rounded-xl border border-emerald-200 px-3 py-2 hover:bg-emerald-50"
          >
            Go to Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </main>
  );
}

function CartRow({ item, onDec, onInc, onDelete }) {
  const line = item.qty * item.price;
  return (
    <div className="flex items-center gap-4 p-4 border border-emerald-100 rounded-2xl bg-white shadow-sm">
      <img src={item.img} alt={item.name} className="w-20 h-16 object-cover rounded-xl" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-emerald-900">{item.name}</h4>
          <span className="text-emerald-700 font-medium">{fmt(item.price)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <button
              onClick={onDec}
              className="p-2 rounded-xl border border-emerald-200 hover:bg-emerald-50"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2ch] text-center font-medium">{item.qty}</span>
            <button
              onClick={onInc}
              className="p-2 rounded-xl border border-emerald-200 hover:bg-emerald-50"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-900 font-semibold">{fmt(line)}</span>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, onDec, onInc, onDelete, onContinue, onCheckout }) {
  const items = Object.values(cart);
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const totalCost = items.reduce((s, it) => s + it.qty * it.price, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-bold text-emerald-900 mb-1">Your Cart</h2>
      <p className="text-emerald-700/80 mb-6">
        {totalQty} {totalQty === 1 ? "plant" : "plants"} • Total {fmt(totalCost)}
      </p>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
          <p className="text-emerald-900 mb-4">Your cart is empty. Add some leafy friends!</p>
          <button onClick={onContinue} className="rounded-2xl bg-emerald-600 text-white px-5 py-3 font-semibold hover:bg-emerald-700">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <CartRow
                key={it.id}
                item={it}
                onDec={() => onDec(it.id)}
                onInc={() => onInc(it.id)}
                onDelete={() => onDelete(it.id)}
              />
            ))}
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-emerald-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Items</span><span>{totalQty}</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span>{fmt(totalCost)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
                <div className="border-t border-emerald-100 my-2"></div>
                <div className="flex justify-between font-semibold text-emerald-900"><span>Total</span><span>{fmt(totalCost)}</span></div>
              </div>
              <button
                onClick={onCheckout}
                className="mt-4 w-full rounded-2xl bg-emerald-600 text-white px-5 py-3 font-semibold hover:bg-emerald-700"
              >
                Checkout
              </button>
              <button
                onClick={onContinue}
                className="mt-3 w-full rounded-2xl border border-emerald-200 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "products" | "cart"
  // cart shape: { [id]: { id, name, price, img, qty } }
  const [cart, setCart] = useState({});

  const cartCount = useMemo(() => Object.values(cart).reduce((s, it) => s + it.qty, 0), [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const cur = prev[product.id];
      const nextQty = (cur?.qty || 0) + 1;
      return {
        ...prev,
        [product.id]: { id: product.id, name: product.name, price: product.price, img: product.img, qty: nextQty },
      };
    });
  };

  const dec = (id) => {
    setCart((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const nextQty = cur.qty - 1;
      const copy = { ...prev };
      if (nextQty <= 0) delete copy[id];
      else copy[id] = { ...cur, qty: nextQty };
      return copy;
    });
  };

  const inc = (id) => {
    setCart((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      return { ...prev, [id]: { ...cur, qty: cur.qty + 1 } };
    });
  };

  const delItem = (id) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleCheckout = () => {
    alert("Thank you! (This is a front-end demo — implement real checkout later.)");
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900">
      <Header current={page} onNavigate={setPage} cartCount={cartCount} />

      {page === "landing" && <Landing onGetStarted={() => setPage("products")} />}
      {page === "products" && (
        <ProductsPage onAdd={addToCart} onNavigate={setPage} />
      )}
      {page === "cart" && (
        <CartPage
          cart={cart}
          onDec={dec}
          onInc={inc}
          onDelete={delItem}
          onContinue={() => setPage("products")}
          onCheckout={handleCheckout}
        />
      )}

      <footer className="mt-12 border-t border-emerald-100 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-emerald-700/80">
          © {new Date().getFullYear()} Paradise Nursery — Keep Growing 🌿
        </div>
      </footer>
    </div>
  );
}
