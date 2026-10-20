export const CONNECTION_GIF_PATHS = {
  reconnecting: "/reconnecting.gif",
  offline: "/no-connection.gif",
  restored: "/networking.gif",
} as const;

export type ConnectionGifKey = keyof typeof CONNECTION_GIF_PATHS;

export type ConnectionGifSrcs = Record<ConnectionGifKey, string>;

/** Load GIFs into blob URLs so they still render when the network drops. */
export async function loadConnectionGifs(): Promise<{
  srcs: ConnectionGifSrcs;
  revoke: () => void;
}> {
  const objectUrls: string[] = [];
  const srcs = { ...CONNECTION_GIF_PATHS };

  await Promise.all(
    (Object.keys(CONNECTION_GIF_PATHS) as ConnectionGifKey[]).map(async (key) => {
      try {
        const response = await fetch(CONNECTION_GIF_PATHS[key], { cache: "force-cache" });
        if (!response.ok) return;
        const blob = await response.blob();
        if (!blob.type.startsWith("image/")) return;
        const url = URL.createObjectURL(blob);
        objectUrls.push(url);
        srcs[key] = url;
      } catch {
        // Keep public path fallback if preload fails.
      }
    }),
  );

  return {
    srcs,
    revoke: () => {
      for (const url of objectUrls) URL.revokeObjectURL(url);
    },
  };
}
