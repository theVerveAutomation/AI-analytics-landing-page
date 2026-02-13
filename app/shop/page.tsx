"use client";

import { useEffect, useState, useMemo } from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Category, Product } from "@/types";
import Image from "next/image";
import { CommerceHero } from "@/components/commerce-hero";
import { motion } from "framer-motion";

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const renderCategoryCardContent = (cat: Category) => (
    <div className="absolute inset-0 z-20">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-[clamp(1.5rem,4vw,2.5rem)] font-bold relative z-10 text-primary my-2 sm:my-4 group-hover:text-primary/90 transition-colors duration-300">
        {cat.name}
      </h2>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {cat.id === "all" ? (
          <ShoppingBag className="w-24 h-24 sm:w-28 sm:h-28 text-primary/60 group-hover:scale-110 group-hover:text-primary/80 transition-all duration-500" />
        ) : (
          <Image
            src={cat.image_url ? cat.image_url : "/placeholder-category.png"}
            alt={cat.name}
            width={256}
            height={256}
            className="w-full max-w-[min(40vw,200px)] sm:max-w-[min(30vw,180px)] md:max-w-[min(25vw,160px)] lg:max-w-[min(20vw,140px)] h-auto object-contain opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
          />
        )}
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-background/95 backdrop-blur-sm rounded-tl-xl flex items-center justify-center z-10 border-l border-t border-border/50">
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-lg">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

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
  }, []);

  const filteredProducts = products.filter((p) => {
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
    const matchesStock = !inStockOnly || (p.available ?? true);
    return (
      matchesText &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesStock
    );
  });

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Group products by category for carousels
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, { category: Category; products: Product[] }> =
      {};

    // Create groups for each category
    categories.forEach((cat) => {
      grouped[cat.id] = { category: cat, products: [] };
    });

    // Add "Uncategorized" group
    grouped["uncategorized"] = {
      category: {
        id: "uncategorized",
        name: "Other Products",
        description: "Products without a category",
      },
      products: [],
    };

    // Distribute filtered products into groups
    filteredProducts.forEach((p) => {
      if (p.category_id && grouped[p.category_id]) {
        grouped[p.category_id].products.push(p);
      } else {
        grouped["uncategorized"].products.push(p);
      }
    });

    // Return only groups that have products
    return Object.values(grouped).filter((g) => g.products.length > 0);
  }, [filteredProducts, categories]);

  // Map app Product → carousel Product
  // const toCarouselProduct = (p: Product) => ({
  //   id: p.id,
  //   name: p.name,
  //   quantity: p.description,
  //   price: p.price ?? 0,
  //   deliveryTime: "Available",
  //   imageUrl: p.image_url,
  // });

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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">All Products</h1>
          <div className="mb-8 flex flex-wrap gap-4 justify-center items-center">
            <input
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
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
            />
            <label className="flex items-center gap-2 text-foreground">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-primary"
              />
              In Stock Only
            </label>
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
                    <div className="absolute left-0 bottom-0 p-4">
                      <div className="text-base font-semibold text-primary">
                        ₹{p.price ?? 0}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </div>
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
