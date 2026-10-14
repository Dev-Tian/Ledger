"use client";

import { noInternetSrc } from "@/app/loading/no-internet-src";
import { Button } from "@/components/ui/button";
import type { ConnectionUiStatus } from "@/contexts/ConnectionContext";

export function ConnectionStatusModal({
  open,
  status,
  onRetry,
}: {
  open: boolean;
  status: ConnectionUiStatus;
  onRetry: () => void;
}) {
  if (!open || status === "connected") return null;

  const offline = status === "offline";
  const restored = status === "restored";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-labelledby="connection-status-title"
      aria-describedby="connection-status-description"
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white text-center shadow-2xl ring-1 ring-blue-200">
        <div
          className={
            offline
              ? "flex flex-col items-center gap-3 bg-red-700 px-6 py-7 text-white"
              : "flex flex-col items-center gap-3 bg-blue-700 px-6 py-7 text-white"
          }
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-sm">
            <img src={noInternetSrc} alt="" width={128} height={128} className="size-14" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wide uppercase">
              {restored ? "Connected" : offline ? "Error" : "Please wait"}
            </p>
            <h2 id="connection-status-title" className="text-lg font-semibold">
              {restored ? "Connected" : offline ? "No connection" : "Reconnecting"}
            </h2>
            <p
              id="connection-status-description"
              className={offline ? "text-sm text-red-100" : "text-sm text-blue-100"}
            >
              {restored
                ? "You are back online. You can continue where you left off."
                : offline
                  ? "The server could not be reached. Check your network, then try again."
                  : "The connection was lost. The ledger is trying to reach the server."}
            </p>
          </div>
        </div>
        {offline ? (
          <div className="flex justify-center bg-background px-6 py-4">
            <Button
              type="button"
              size="sm"
              className="bg-blue-800 px-3 text-white hover:bg-blue-900"
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
