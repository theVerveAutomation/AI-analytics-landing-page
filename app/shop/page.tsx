"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Category, Product } from "@/types";
import Image from "next/image";
import { CommerceHero } from "@/components/commerce-hero";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/userCartStore";

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("none"); // none, price-asc, price-desc, name-asc, name-desc

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const load = async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products/fetch"),
        fetch("/api/categories/fetch"),
      ]);

      const productsJson = await productsRes.json();
      const categoriesJson = await categoriesRes.json();
      setProducts(productsJson.products || []);
      setCategories(categoriesJson.categories || []);
      setLoading(false);
    };
    load();

    // Listen for custom event to focus search input
    const focusHandler = () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    window.addEventListener("focus-shop-search-input", focusHandler);

    // Listen for custom event to scroll to filters
    const scrollToFilters = () => {
      if (filtersRef.current) {
        filtersRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("scroll-to-shop-filters", scrollToFilters);

    return () => {
      window.removeEventListener("focus-shop-search-input", focusHandler);
      window.removeEventListener("scroll-to-shop-filters", scrollToFilters);
    };
  }, []);

  let filteredProducts = products.filter((p) => {
    // Text search
    const matchesText =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Category filter
    const matchesCategory =
      !selectedCategoryId || p.category_id === selectedCategoryId;
    // Price filter
    const price = typeof p.price === "number" ? p.price : 0;
    const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);
    // In-stock filter (assume p.stock or p.quantity or p.available)
    return matchesText && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // Sorting
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (a.price ?? 0) - (b.price ?? 0),
    );
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.price ?? 0) - (a.price ?? 0),
    );
  } else if (sortBy === "name-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  } else if (sortBy === "name-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.name.localeCompare(a.name),
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background pt-14">
        <CommerceHero />
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">All Products</h1>
          <div
            className="mb-8 flex flex-wrap gap-4 justify-center items-center scroll-mt-40 mx-2 sm:mx-0"
            ref={filtersRef}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={selectedCategoryId ?? ""}
              onChange={(e) => setSelectedCategoryId(e.target.value || null)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="none">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <label htmlFor="minPrice" className="text-sm text-foreground">
                Min Price: ₹{minPrice || 0}
              </label>
              <input
                id="minPrice"
                type="range"
                min="0"
                max={maxPrice !== "" ? maxPrice : 10000}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <label htmlFor="maxPrice" className="text-sm text-foreground">
                Max Price: ₹{maxPrice || 10000}
              </label>
              <input
                id="maxPrice"
                type="range"
                min={minPrice !== "" ? minPrice : 0}
                max="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          </div>
          {loading ? (
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center min-h-[50vh] flex flex-col items-center justify-center gap-4">
              <p className="text-lg font-medium text-foreground mb-1">
                {searchTerm ? "No results found" : "No products yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? `Nothing matched "${searchTerm}". Try a different term.`
                  : "Check back soon — new products are on the way."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  className="group relative bg-muted/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] w-full overflow-hidden transition-all duration-500 cursor-pointer border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: "easeOut",
                  }}
                  onClick={() => router.push(`/shop/${p.id}`)}
                >
                  <div className="absolute inset-0 z-20">
                    <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-[clamp(1.5rem,4vw,2.5rem)] font-bold relative z-10 text-primary my-2 sm:my-4 group-hover:text-primary/90 transition-colors duration-300">
                      {p.name}
                    </h2>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Image
                        src={
                          p.image_url
                            ? p.image_url
                            : "/placeholder-category.png"
                        }
                        alt={p.name}
                        width={256}
                        height={256}
                        className="w-full max-w-[min(40vw,200px)] sm:max-w-[min(30vw,180px)] md:max-w-[min(25vw,160px)] lg:max-w-[min(20vw,140px)] h-auto object-contain opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-background/95 backdrop-blur-sm rounded-tl-xl flex items-center justify-center z-10 border-l border-t border-border/50">
                      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="absolute left-0 bottom-0 p-4 w-full flex flex-col gap-2 items-start">
                      <div className="text-base font-semibold text-primary">
                        ₹{p.price ?? 0}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </div>
                      <button
                        className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow hover:bg-primary/90 transition-colors text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({
                            id: p.id,
                            name: p.name,
                            price: typeof p.price === "number" ? p.price : 0,
                            imageUrl: p.image_url || "",
                          });
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
