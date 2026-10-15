"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ErrorModal } from "@/components/status-modals";
import { useUser, type User } from "@/contexts/UserContext";

const roleDashboards: Record<string, string> = {
  admin: "/admin",
  uploader: "/uploader",
  employee: "/viewer/customer-search",
  viewer: "/viewer",
};

interface WithAuthOptions {
  requiredRole?: string | string[];
  fallbackPath?: string;
}

export function accountRole(user: User | null): string | null {
  const role = user?.role || user?.roles?.[0]?.name;
  return role ? role.toLowerCase() : null;
}

function roleAllowed(role: string | null, requiredRole?: string | string[]) {
  if (!requiredRole || !role) return true;
  const required = (Array.isArray(requiredRole) ? requiredRole : [requiredRole]).map((item) =>
    item.toLowerCase()
  );
  return required.includes(role);
}

export function AuthGuard({
  children,
  requiredRole,
  fallbackPath = "/",
}: {
  children: ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
}) {
  const { user, isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const role = accountRole(user);
  const allowed = !isLoading && isAuthenticated && !!user && roleAllowed(role, requiredRole);
  const blocked = !isLoading && !allowed;
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    if (blocked) setNoticeOpen(true);
  }, [blocked]);

  function leave() {
    if (!isAuthenticated || !user) {
      router.replace(fallbackPath);
      return;
    }
    router.replace(roleDashboards[role ?? ""] ?? fallbackPath);
  }

  if (!allowed) {
    return (
      <>
        <div hidden inert>
          {children}
        </div>
        <div className="bg-logo-tile flex min-h-svh items-center justify-center px-6">
          <p className="text-sm font-medium text-blue-950">
            {blocked ? "Entry refused." : "Checking your account."}
          </p>
          <ErrorModal
            open={noticeOpen}
            onOpenChangeAction={(open) => {
              setNoticeOpen(open);
              if (!open) leave();
            }}
            title="Entry refused"
            description="You are not allowed to do such entry."
          />
        </div>
      </>
    );
  }

  return children;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function WithAuthComponent(props: P) {
    return (
      <AuthGuard requiredRole={options.requiredRole} fallbackPath={options.fallbackPath}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
