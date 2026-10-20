import type Echo from "laravel-echo";
import type Pusher from "pusher-js";

import { sanctum } from "@/lib/api";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

type ReverbEcho = Echo<"reverb">;

const ACTIVITY_LOGS_CHANNEL =
  process.env.NEXT_PUBLIC_ECHO_ACTIVITY_LOGS_CHANNEL ?? "activity-logs";

const ACTIVITY_LOG_EVENTS = [
  ".ActivityLogCreated",
  ".log.created",
  "ActivityLogCreated",
] as const;

let echo: ReverbEcho | null = null;

function reverbConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_REVERB_APP_KEY?.trim());
}

export async function getEcho(): Promise<ReverbEcho | null> {
  if (typeof window === "undefined") return null;
  if (!reverbConfigured()) return null;
  if (echo) return echo;

  const [{ default: EchoClient }, { default: Pusher }] = await Promise.all([
    import("laravel-echo"),
    import("pusher-js"),
  ]);

  window.Pusher = Pusher;

  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http";
  const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? "8080");

  echo = new EchoClient({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${process.env.NEXT_PUBLIC_SANCTUM_API_URL}/broadcasting/auth`,
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        sanctum
          .post("/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            callback(error as Error, null);
          });
      },
    }),
  });

  return echo;
}

function eventPayload(event: unknown): unknown {
  if (!event || typeof event !== "object") return event;
  const record = event as { log?: unknown; data?: unknown };
  return record.log ?? record.data ?? event;
}

/** Private channel `activity-logs` (override with NEXT_PUBLIC_ECHO_ACTIVITY_LOGS_CHANNEL). */
export async function subscribeActivityLogs(
  onLog: (payload: unknown) => void,
): Promise<() => void> {
  const client = await getEcho();
  if (!client) return () => {};

  const handler = (event: unknown) => {
    onLog(eventPayload(event));
  };

  const channel = client.private(ACTIVITY_LOGS_CHANNEL);
  for (const name of ACTIVITY_LOG_EVENTS) {
    channel.listen(name, handler);
  }

  return () => {
    for (const name of ACTIVITY_LOG_EVENTS) {
      channel.stopListening(name, handler);
    }
    client.leave(ACTIVITY_LOGS_CHANNEL);
  };
}
