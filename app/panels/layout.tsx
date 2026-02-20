import AuthProvider from "@/providers/AuthProvider";

export default function PanelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
