"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import ProductCard from "../ProductCard";
import { useCallback, useRef, useState } from "react";
import React from "react";

interface ProductCarouselProps {
  title: string;
  products?: Product[];
  viewAllHref?: string;
  className?: string;
}

// --- MAIN COMPONENT ---
const ProductCarousel = ({
  title,
  products,
  viewAllHref = "#",
  className,
}: ProductCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Function to handle scrolling
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Check scroll state on mount and resize
  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollable = el.scrollWidth > el.clientWidth;
    setIsScrollable(scrollable);
    setIsAtStart(el.scrollLeft === 0);
    setIsAtEnd(Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 1);
  }, []);

  React.useEffect(() => {
    checkScrollState();
    const el = scrollContainerRef.current;
    el?.addEventListener("scroll", checkScrollState);
    window.addEventListener("resize", checkScrollState);

    return () => {
      el?.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      className={cn("relative w-full space-y-4 py-8", className)}
      ref={ref}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <a
          href={viewAllHref}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          see all
        </a>
      </div>

      <div className="relative">
        {/* Product List */}
        <motion.div
          ref={scrollContainerRef}
          className="scrollbar-hide flex space-x-4 overflow-x-auto px-4 sm:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {/* Navigation Controls */}
        {isScrollable && (
          <>
            {/* Left Button */}
            <button
              onClick={() => handleScroll("left")}
              disabled={isAtStart}
              aria-label="Scroll left"
              className={cn(
                "absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md transition-opacity duration-300 disabled:opacity-0",
                "hover:bg-accent focus:outline-none",
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            {/* Right Button */}
            <button
              onClick={() => handleScroll("right")}
              disabled={isAtEnd}
              aria-label="Scroll right"
              className={cn(
                "absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md transition-opacity duration-300 disabled:opacity-0",
                "hover:bg-accent focus:outline-none",
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;
