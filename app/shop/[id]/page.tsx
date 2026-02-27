"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/userCartStore";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Package, Calendar, Loader2 } from "lucide-react";
import { CartItem, Product } from "@/types";
import Image from "next/image";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Fetch all products and find the one with matching ID
        const res = await fetch(`/api/products/${params.id}`);
        const json = await res.json();
        if (!res.ok) {
          console.error("Failed to load product:", json.error);
          throw new Error(json.error || "Failed to load product");
        }
        const found = json.product;
        console.log("Product found:", found);
        setProduct(found);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block p-6 bg-card/70 backdrop-blur-sm border border-border rounded-2xl shadow-lg mb-4">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h3>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-semibold transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-background">
      {/* Back Button */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm shadow-xl border border-border h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
              <Image
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain"
                width={400}
                height={400}
                priority
              />
            </div>

            {/* Additional Info Section */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Product Highlights
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Verified and authenticated product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Direct from trusted supplier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Quality guaranteed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 break-words">
                {product.name}
              </h1>
              {product.brand && (
                <div className="mb-2 text-sm text-slate-400 font-semibold">
                  Brand: {product.brand}
                </div>
              )}

              {/* Price */}
              {product.showPrice && (
                <div className="mb-4 text-lg font-semibold text-primary">
                  ${product.price ?? 0}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Description</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Date Listed */}
              {product.created_at && (
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Listed Date
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {new Date(product.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Contact Actions */}
              <div className="space-y-3">
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  onClick={() => {
                    if (product) {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price:
                          typeof product.price === "number" ? product.price : 0,
                        image_url: product.image_url || "",
                      });
                    }
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Form */}
      {product && (
        <QuoteRequestForm
          open={quoteFormOpen}
          onOpenChange={setQuoteFormOpen}
          productDetails={[
            {
              id: product.id,
              name: product.name,
              price: typeof product.price === "number" ? product.price : 0,
              quantity: 1,
              image_url: product.image_url || "",
            } as CartItem,
          ]}
        />
      )}
    </main>
  );
}
