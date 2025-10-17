import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type AuthModalProps = { trigger: React.ReactNode };

const AuthModal = ({ trigger }: AuthModalProps) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup" | "reset">("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signInWithEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMessage(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage(error.message); else { setOpen(false); }
  }

  async function signUpWithEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMessage(null);
    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (!error && data.user) {
      // Best-effort profile insert (if table exists)
      await supabase.from("profiles").upsert({ id: data.user.id, full_name: fullName }).catch(() => {});
    }
    setLoading(false);
    if (error) setMessage(error.message); else setMessage("Check your email to confirm your account.");
  }

  async function sendReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMessage(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) setMessage(error.message); else setMessage("Reset link sent. Check your email.");
  }

  async function oauth(provider: "google" | "github") {
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setMessage(error.message);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="p-6">
          <DialogTitle className="text-center mb-4">Welcome</DialogTitle>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-4">
            <div className="flex justify-center gap-6">
              <button className={`text-sm font-medium ${tab==='signin'?'text-pear':'text-text-medium'}`} onClick={()=>setTab('signin')}>Sign In</button>
              <button className={`text-sm font-medium ${tab==='signup'?'text-pear':'text-text-medium'}`} onClick={()=>setTab('signup')}>Sign Up</button>
              <button className={`text-sm font-medium ${tab==='reset'?'text-pear':'text-text-medium'}`} onClick={()=>setTab('reset')}>Forgot</button>
            </div>
          </Tabs>

          {tab === 'signin' && (
            <form onSubmit={signInWithEmail} className="space-y-3">
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="password" type="password" placeholder="Password" required />
              <Button className="w-full" disabled={loading} type="submit">Sign In</Button>
              <div className="text-center text-sm text-text-medium">or</div>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" onClick={()=>oauth('google')} variant="outline">Google</Button>
                <Button type="button" onClick={()=>oauth('github')} variant="outline">GitHub</Button>
              </div>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={signUpWithEmail} className="space-y-3">
              <Input name="name" placeholder="Full name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="password" type="password" placeholder="Password" required />
              <Button className="w-full" disabled={loading} type="submit">Create account</Button>
            </form>
          )}

          {tab === 'reset' && (
            <form onSubmit={sendReset} className="space-y-3">
              <Input name="email" type="email" placeholder="Email" required />
              <Button className="w-full" disabled={loading} type="submit">Send reset link</Button>
            </form>
          )}

          {!!message && <div className="mt-3 text-sm text-center text-text-medium">{message}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;


