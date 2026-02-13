"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function CommerceHero() {
  const router = useRouter();
  return (
    <div className="w-full relative container max-w-full">
      <div className="my-20 bg-accent/50 rounded-2xl relative">
        <motion.section
          className="w-full px-4 py-24 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-4">
              Your One-Stop
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Video Analytics
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg sm:text-xl">
              Discover cutting-edge cameras, servers, controllers, and
              accessories. From enterprise-grade solutions to smart home
              security - we have everything you need.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2 text-lg">
                Browse Products
                <ArrowUpRight className="w-5 h-5" />
              </button>
              <button
                className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors duration-200 text-lg"
                onClick={() => {
                  router.push("/shop/collections");
                }}
              >
                Shop Categories
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
