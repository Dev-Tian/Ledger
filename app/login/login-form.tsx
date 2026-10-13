"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { ErrorModal, LoadingModal, SuccessModal } from "@/components/status-modals";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, signIn } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
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

    try {
      await signIn(email, password);
      if (checkId.current !== id) return;
      setLoadingOpen(false);
      setSuccessOpen(true);
      toast.success({
        title: "Signed in",
        description: "Your account was accepted. The ledger is being prepared.",
      });
    } catch (caught) {
      if (checkId.current !== id) return;
      setLoadingOpen(false);
      const message =
        caught instanceof ApiError
          ? caught.message
          : "The account service could not be reached.";
      setError(message);
      toast.failed({
        title: "Unable to sign in",
        description: message,
      });
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          className="h-10 bg-background"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          className="h-10 bg-background"
          required
        />
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
        className="mt-1 w-full cursor-pointer bg-blue-800 text-white hover:bg-blue-900"
        disabled={loadingOpen}
      >
        {loadingOpen ? "Checking account" : "Sign in"}
      </Button>
    </form>
  );
}
