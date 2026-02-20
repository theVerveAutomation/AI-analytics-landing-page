"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { userLoginStore } from "@/store/loginUserStore";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: {
  children: React.ReactNode;
}) {
    const router = useRouter();
  const setUser = userLoginStore((s) => s.setUser);
  const setLoading = userLoginStore((s) => s.setLoading);
 useEffect(() => {
    const getLoginUser = async (user_id: string) => {
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("*, organizations(*)")
        .eq("id", user_id)
        .single();

      if (error || !prof) {
        setUser(null);
        setLoading(false);
        return router.replace("/Login");
      }

      setUser(prof);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      
      if (!session?.user) {
        setUser(null);
        setLoading(false); 
        return router.replace("/Login");
      }

      // 4. DATABASE FIX: Only fetch profile on load or sign in, ignore token refreshes
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        getLoginUser(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, setLoading, setUser]);

  return children;
}
