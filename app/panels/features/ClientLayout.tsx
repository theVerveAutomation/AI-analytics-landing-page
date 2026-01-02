"use client";
import React, { useState } from "react";
import MobileHeader from "@/components/MobileHeader";
import { Feature, Profile } from "@/types";
// import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Sidebar from "@/components/SideBar";

export default function ClientLayout({
  children,
  profile,
  features,
}: {
  children: React.ReactNode;
  profile: Profile;
  features: Feature[];
}) {
  // const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // const [openEmployees, setOpenEmployees] = useState(
  //   pathname.startsWith("/panels/features/employees")
  // );
}
