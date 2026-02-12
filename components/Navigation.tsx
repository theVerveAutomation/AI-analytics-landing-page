"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Sun,
  Menu,
  ArrowUpRight,
  Search,
  ShoppingBasket,
} from "lucide-react";
import { useTheme } from "next-themes";
import vapLogo from "@/assets/vap-logo.jpeg";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavigationProps {
  navType: "homePageNav" | "shopNav" | "demoPageNav";
  navigation?: { label: string; href?: string; section?: string }[];
}

const Navigation = ({ navType, navigation }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (link: {
    label: string;
    href?: string;
    section?: string;
  }) => {
    if (link.href) {
      router.push(link.href);
    } else if (link.section) {
      scrollToSection(link.section);
    }
  };

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 dark:bg-background/90 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent border-none shadow-none"
      }`}
      style={{
        transition: "background 0.3s, box-shadow 0.3s",
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 min-h-[64px]">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Image
              src={vapLogo}
              alt="VAP Logo"
              className="h-12 w-auto rounded-md cursor-pointer bg-background hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/")}
            />
          </div>

          {/* center Links */}
          <div className="hidden md:flex items-center flex-1 justify-center gap-2 flex-wrap min-w-0">
            {navigation?.map((item) => (
              <Button
                key={item.label}
                variant="link"
                className="text-foreground/80 dark:text-foreground/70 hover:text-primary transition-colors font-medium whitespace-nowrap px-2"
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right: Actions buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {navType === "homePageNav" && (
              <>
                {/* Login - pill on lg+, simple on md and below */}
                <Button
                  onClick={() => router.push("/Login")}
                  variant="secondary"
                  className="hidden lg:flex cursor-pointer bg-secondary p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span className="pl-4 py-2 text-sm font-medium">Login</span>
                  <div className="rounded-full flex items-center justify-center bg-background w-10 h-10 ml-2 group-hover:scale-110 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Button>
                <Button
                  onClick={() => router.push("/Login")}
                  variant="secondary"
                  className="hidden md:flex lg:hidden px-4 py-2 text-sm font-medium"
                >
                  Login
                </Button>
                {/* Request Access - gradient pill on lg+, simple on md and below */}
                <Button
                  onClick={() => router.push("/BookDemo")}
                  className="hidden lg:flex bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-300 font-semibold px-6 rounded-full"
                >
                  Request Access
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  onClick={() => router.push("/BookDemo")}
                  className="hidden md:flex lg:hidden px-4 py-2 text-sm font-medium bg-primary text-primary-foreground"
                >
                  Request Access
                </Button>
              </>
            )}
            {navType === "shopNav" && (
              <>
                {/* search and cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer relative group hover:text-primary transition-colors"
                >
                  <Search className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer relative group hover:text-primary transition-colors"
                >
                  <ShoppingBasket className="w-5 h-5" />
                </Button>
              </>
            )}
            {/* Theme toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
            {/* Mobile Sheet Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[360px] p-0 bg-background/95 backdrop-blur-md border-r border-border/50"
              >
                <SheetHeader className="p-6 text-left border-b border-border/50">
                  <SheetTitle className="flex items-center">
                    <Image
                      src={vapLogo}
                      alt="VAP Logo"
                      className="h-10 w-auto rounded-md"
                    />
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col p-6 space-y-1">
                  {navigation?.map((link) => (
                    <Button
                      key={link.label}
                      variant="ghost"
                      onClick={() => handleNavClick(link)}
                      className="justify-start px-2 h-12 text-base font-medium hover:bg-accent/50 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Button>
                  ))}
                </nav>

                <Separator className="mx-6" />

                <div className="p-6 flex flex-col gap-4">
                  {navType === "homePageNav" && (
                    <>
                      <Button
                        onClick={() => router.push("/Login")}
                        variant="outline"
                        className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => router.push("/BookDemo")}
                        className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Request Access
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                  {navType === "shopNav" && (
                    <>
                      <Button
                        variant="outline"
                        className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        Search
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors relative"
                      >
                        <ShoppingBasket className="w-4 h-4" />
                        Cart
                        <span className="absolute right-3 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          3
                        </span>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
