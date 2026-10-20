"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ConnectionUiStatus } from "@/contexts/ConnectionContext";
import {
  CONNECTION_GIF_PATHS,
  loadConnectionGifs,
  type ConnectionGifSrcs,
} from "@/lib/connectionGifs";

export function ConnectionStatusModal({
  open,
  status,
  onRetry,
}: {
  open: boolean;
  status: ConnectionUiStatus;
  onRetry: () => void;
}) {
  const [gifSrcs, setGifSrcs] = useState<ConnectionGifSrcs>(CONNECTION_GIF_PATHS);

  useEffect(() => {
    let active = true;
    let revoke = () => {};

    void loadConnectionGifs().then((loaded) => {
      if (!active) {
        loaded.revoke();
        return;
      }
      revoke = loaded.revoke;
      setGifSrcs(loaded.srcs);
    });

    return () => {
      active = false;
      revoke();
    };
  }, []);

  if (!open || status === "connected") return null;

  const offline = status === "offline";
  const restored = status === "restored";
  const gifSrc = gifSrcs[status];
  const showGif = gifSrc.startsWith("blob:");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-labelledby="connection-status-title"
      aria-describedby="connection-status-description"
    >
      <div className="connection-modal-backdrop absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" aria-hidden />
      <div
        key={status}
        className="connection-modal-panel relative w-full max-w-sm overflow-hidden rounded-2xl bg-white text-center shadow-2xl ring-1 ring-blue-200"
      >
        <div
          className={
            offline
              ? "h-2 bg-gradient-to-r from-red-500 via-rose-500 to-red-600"
              : restored
                ? "h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
                : "h-2 bg-gradient-to-r from-sky-500 via-blue-500 to-blue-700"
          }
        />
        <div
          className={
            offline
              ? "flex flex-col items-center gap-4 bg-gradient-to-b from-red-50 to-white px-8 pt-7 pb-8"
              : restored
                ? "flex flex-col items-center gap-4 bg-gradient-to-b from-green-50 to-white px-8 pt-7 pb-8"
                : "flex flex-col items-center gap-4 bg-gradient-to-b from-sky-50 to-white px-8 pt-7 pb-8"
          }
        >
          {showGif ? (
            <img
              key={gifSrc}
              src={gifSrc}
              alt=""
              width={220}
              height={220}
              className="h-36 w-36 border-0 object-contain"
              draggable={false}
            />
          ) : (
            <div className="h-36 w-36" aria-hidden />
          )}

          <div className="connection-content-in flex flex-col gap-1.5">
            <p
              className={
                offline
                  ? "text-xs font-semibold tracking-[0.16em] text-red-700 uppercase"
                  : restored
                    ? "text-xs font-semibold tracking-[0.16em] text-green-700 uppercase"
                    : "text-xs font-semibold tracking-[0.16em] text-sky-700 uppercase"
              }
            >
              {restored ? "Connected" : offline ? "Network" : "Reconnecting"}
            </p>
            <h2
              id="connection-status-title"
              className="text-xl font-semibold tracking-tight text-blue-950"
            >
              {restored ? "You are back online" : offline ? "No connection" : "Trying to reconnect"}
            </h2>
            <p
              id="connection-status-description"
              className="text-sm leading-6 text-muted-foreground"
            >
              {restored
                ? "You can continue where you left off."
                : offline
                  ? "The server could not be reached. Check your network, then try again."
                  : "The connection was lost. The ledger is trying to reach the server."}
            </p>
          </div>
        </div>

        {offline ? (
          <div className="connection-content-in flex justify-center border-t border-red-100 bg-red-50/40 px-6 py-4">
            <Button
              type="button"
              size="sm"
              className="action-hover cursor-pointer bg-blue-800 px-4 text-white hover:bg-blue-900"
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
