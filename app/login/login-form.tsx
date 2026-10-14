"use client";

import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { ErrorModal, LoadingModal, SuccessModal } from "@/components/status-modals";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const checkId = useRef(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const id = ++checkId.current;

    setError(null);
    setSuccessOpen(false);

    if (!email || !password) {
      const message = "Enter your email and password.";
      setError(message);
      toast.failed({
        title: "Unable to sign in",
        description: message,
      });
      return;
    }

    setLoadingOpen(true);

    const result = await login(email, password);
    if (checkId.current !== id) return;
    setLoadingOpen(false);

    if (result.error) {
      const message = result.isServerUnreachable
        ? "The account service could not be reached."
        : result.error;
      setError(message);
      toast.failed({
        title: "Unable to sign in",
        description: message,
      });
      return;
    }

    setSuccessOpen(true);
    toast.success({
      title: "Signed in",
      description: "Your account was accepted. The ledger is being prepared.",
    });
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-xs font-medium tracking-wide text-blue-950">
          Email
        </Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-blue-700"
            aria-hidden
          />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@smctgroup.ph"
            aria-invalid={error ? true : undefined}
            className="h-12 rounded-xl border-blue-100 bg-white pr-3 pl-11 shadow-sm focus-visible:border-blue-700 focus-visible:ring-blue-200"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-xs font-medium tracking-wide text-blue-950">
          Password
        </Label>
        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-blue-700"
            aria-hidden
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={error ? true : undefined}
            className="h-12 rounded-xl border-blue-100 bg-white pr-3 pl-11 shadow-sm focus-visible:border-blue-700 focus-visible:ring-blue-200"
            required
          />
        </div>
      </div>
      <LoadingModal
        open={loadingOpen}
        onOpenChangeAction={(open) => {
          if (!open) checkId.current += 1;
          setLoadingOpen(open);
        }}
      />
      <ErrorModal
        open={error !== null}
        onOpenChange={(open) => {
          if (!open) setError(null);
        }}
        title="Unable to sign in"
        description={error ?? ""}
      />
      <SuccessModal
        open={successOpen}
        onOpenChange={(open) => {
          setSuccessOpen(open);
          if (!open) router.push("/loading");
        }}
        title="Signed in"
        description="Your account was accepted. The ledger is being prepared."
      />
      <Button
        type="submit"
        size="lg"
        className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-[linear-gradient(90deg,#1e40af_0%,#1d4ed8_25%,#0ea5e9_50%,#1e40af_50%,#1e40af_100%)] bg-[length:200%_100%] bg-[position:100%_0] text-white shadow-md shadow-blue-900/20 transition-[background-position] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-transparent hover:bg-[position:0%_0]"
        disabled={loadingOpen}
      >
        {loadingOpen ? "Checking account" : "Sign in"}
      </Button>
    </form>
  );
}
