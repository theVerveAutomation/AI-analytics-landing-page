import ClientLayout from "./ClientLayout";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
