"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import CameraImage from "@/assets/camera.png";
import Image from "next/image";

const categories = [
  {
    title: "Camera",
    image: CameraImage,
    href: "#",
  },
  {
    title: "Server",
    image: CameraImage,
    href: "#",
  },
  {
    title: "Controller",
    image: CameraImage,
    href: "#",
  },
  {
    title: "Accessories",
    image: CameraImage,
    href: "#",
  },
];

export function CommerceHero() {
  return (
    <div className="w-full relative container max-w-full min-h-screen">
      <div className="mt-32 bg-accent/50 rounded-2xl relative">
        <motion.section
          className="w-full px-4 py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Curate your products
              </span>
              <br />
              <span className="text-foreground">into simple collections.</span>
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Use this page to group your products into themed collections,
              making it easy for customers to explore.
            </motion.p>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-12">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            className="group relative bg-muted/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] w-full overflow-hidden transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          >
            <a href={category.href} className="absolute inset-0 z-20">
              <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-[clamp(1.5rem,4vw,2.5rem)] font-bold relative z-10 text-primary my-2 sm:my-4 group-hover:text-primary/90 transition-colors duration-300">
                {category.title}
              </h2>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={category.image}
                  alt={category.title}
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
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
