"use client";

import { useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/contexts/UserContext";
import { accountRole, AuthGuard } from "@/hoc/withAuth";

const roleDashboards: Record<string, string> = {
  admin: "/admin",
  uploader: "/uploader",
  employee: "/viewer/customer-search",
  viewer: "/viewer",
};

interface WithPageOptions {
  requireAuth?: boolean;
  requiredRole?: string | string[];
  fallbackPath?: string;
}

export function withPage<P extends object>(
  Component: ComponentType<P>,
  options: WithPageOptions = {}
) {
  return function WithPageComponent(props: P) {
    if (!options.requireAuth && !options.requiredRole) {
      return <Component {...props} />;
    }

    return (
      <AuthGuard requiredRole={options.requiredRole} fallbackPath={options.fallbackPath}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

export function withAuthPage<P extends object>(
  Component: ComponentType<P>,
  requiredRole?: string | string[]
) {
  return withPage(Component, { requireAuth: true, requiredRole });
}

export function withPublicPage<P extends object>(
  Component: ComponentType<P>,
  options: { redirectIfAuthenticated?: boolean } = {}
) {
  return function WithPublicPageComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!options.redirectIfAuthenticated || isLoading || !isAuthenticated || !user) return;
      const role = accountRole(user);
      router.replace((role && roleDashboards[role]) || "/");
    }, [isAuthenticated, isLoading, router, user]);

    return <Component {...props} />;
  };
}
