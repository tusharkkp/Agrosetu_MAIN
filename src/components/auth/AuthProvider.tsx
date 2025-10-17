import { ReactNode, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

import { createContext, useContext } from "react";

const AuthContext = createContext<AuthContextValue>({ user: null, session: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const u = newSession?.user ?? null;
      if (u) {
        try {
          const { data: prof } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", u.id).single();
          if (prof) {
            // attach profile fields to user metadata for easy access
            u.user_metadata = { ...u.user_metadata, full_name: prof.full_name, avatar_url: prof.avatar_url } as any;
          }
        } catch {}
      }
      setUser(u);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>{children}</AuthContext.Provider>
  );
};


