"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Product } from "@/types";
import Image from "next/image";
import { CommerceHero } from "@/components/commerce-hero";

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/products/fetch");
      const json = await res.json();
      setProducts(json.products || []);
      setLoading(false);
    };
    load();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

        {/* Product Grid */}
        <section className="max-w-6xl mx-auto px-6 py-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <article
                  key={p.id}
                  onClick={() => router.push(`/shop/${p.id}`)}
                  className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={400}
                      height={300}
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-base font-semibold text-foreground line-clamp-1">
                      {p.name}
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      View details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
