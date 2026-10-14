"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ConnectionStatusModal } from "@/components/connection-status-modal";
import { api } from "@/lib/api";
import { isNetworkFailure, subscribeConnectionLost } from "@/lib/connectionEvents";

export type ConnectionUiStatus = "connected" | "reconnecting" | "offline" | "restored";

type ConnectionContextValue = {
  status: ConnectionUiStatus;
  retry: () => void;
};

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined);

const RETRY_DELAY_MS = 3_000;
const MAX_RETRIES = 8;
const RESTORED_DISPLAY_MS = 1_800;
const PING_TIMEOUT_MS = 8_000;

async function pingServer(): Promise<boolean> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return false;
  }
  try {
    await api.get("/profile", { timeout: PING_TIMEOUT_MS });
    return true;
  } catch (error) {
    if (isNetworkFailure(error)) return false;
    return true;
  }
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within ConnectionProvider");
  }
  return context;
}

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionUiStatus>("connected");
  const statusRef = useRef<ConnectionUiStatus>("connected");
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryAttemptRef = useRef(0);
  const pingInFlightRef = useRef(false);

  const setStatusSafe = useCallback((next: ConnectionUiStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const clearRestoredTimer = useCallback(() => {
    if (restoredTimerRef.current) {
      clearTimeout(restoredTimerRef.current);
      restoredTimerRef.current = null;
    }
  }, []);

  const markRestored = useCallback(() => {
    clearRetryTimer();
    retryAttemptRef.current = 0;
    setStatusSafe("restored");
    clearRestoredTimer();
    restoredTimerRef.current = setTimeout(() => {
      setStatusSafe("connected");
    }, RESTORED_DISPLAY_MS);
  }, [clearRestoredTimer, clearRetryTimer, setStatusSafe]);

  const scheduleRetry = useCallback(
    function scheduleRetryFn() {
      clearRetryTimer();
      retryTimerRef.current = setTimeout(async () => {
        if (statusRef.current === "connected") return;

        const ok = await pingServer();
        if (ok) {
          markRestored();
          return;
        }

        retryAttemptRef.current += 1;
        if (retryAttemptRef.current >= MAX_RETRIES) {
          setStatusSafe("offline");
          return;
        }

        scheduleRetryFn();
      }, RETRY_DELAY_MS);
    },
    [clearRetryTimer, markRestored, setStatusSafe]
  );

  const beginReconnecting = useCallback(() => {
    if (statusRef.current === "reconnecting" || statusRef.current === "offline") {
      return;
    }

    clearRestoredTimer();
    retryAttemptRef.current = 0;
    setStatusSafe("reconnecting");
    scheduleRetry();
  }, [clearRestoredTimer, scheduleRetry, setStatusSafe]);

  const retry = useCallback(async () => {
    if (pingInFlightRef.current) return;

    pingInFlightRef.current = true;
    clearRetryTimer();
    setStatusSafe("reconnecting");
    retryAttemptRef.current = 0;

    try {
      const ok = await pingServer();
      if (ok) {
        markRestored();
      } else {
        setStatusSafe("offline");
        scheduleRetry();
      }
    } finally {
      pingInFlightRef.current = false;
    }
  }, [clearRetryTimer, markRestored, scheduleRetry, setStatusSafe]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      beginReconnecting();
    }

    const onBrowserOffline = () => beginReconnecting();
    const onBrowserOnline = () => {
      void retry();
    };

    window.addEventListener("offline", onBrowserOffline);
    window.addEventListener("online", onBrowserOnline);

    return () => {
      window.removeEventListener("offline", onBrowserOffline);
      window.removeEventListener("online", onBrowserOnline);
    };
  }, [beginReconnecting, retry]);

  useEffect(() => {
    return subscribeConnectionLost(() => {
      beginReconnecting();
    });
  }, [beginReconnecting]);

  useEffect(() => {
    return () => {
      clearRetryTimer();
      clearRestoredTimer();
    };
  }, [clearRestoredTimer, clearRetryTimer]);

  const showModal = status !== "connected";

  return (
    <ConnectionContext.Provider value={{ status, retry }}>
      {children}
      <ConnectionStatusModal
        open={showModal}
        status={status}
        onRetry={() => void retry()}
      />
    </ConnectionContext.Provider>
  );
}
