import Navigation from "@/components/Navigation";

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        navType="shopNav"
        navigation={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Collections", section: "collections" },
        ]}
      />
      {children}
    </div>
  );
}
