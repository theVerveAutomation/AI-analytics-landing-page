import { createBrowserClient } from "@supabase/ssr";

export const AlertSupabase = createBrowserClient(
    process.env.NEXT_PUBLIC_ALERT_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_ALERT_SUPABASE_PUBLISHABLE_KEY!
  );
