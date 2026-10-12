import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/studio-admin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { adminGet } = await import("../../lib/admin-server");
        return adminGet(request);
      },
      POST: async ({ request }) => {
        const { adminPost } = await import("../../lib/admin-server");
        return adminPost(request);
      },
    },
  },
});
