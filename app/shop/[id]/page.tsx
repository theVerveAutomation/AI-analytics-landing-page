"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";
import Navigation from "@/components/Navigation";

export default function ProductDetailsPage() {
  console.log("Rendering ProductDetailsPage");
  const router = useRouter();
  const params = useParams();
  console.log("ProductDetailsPage params:", params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        // Fetch all products and find the one with matching ID
        const res = await fetch("/api/products/fetch");
        const json = await res.json();
        const found = json.products?.find((p: Product) => p.id === params.id);
        setProduct(found || null);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }

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
            onClick={() => router.push("/shop")}
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
            onClick={() => router.push("/shop")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
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
              <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Product
              </div>
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
                <button className="w-full bg-accent/60 hover:bg-accent text-foreground hover:text-primary-foreground border border-border py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
