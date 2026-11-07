import { cookies } from "next/headers";
import { onNewOrder } from "@/lib/orders";

// cacheComponents: true is set in next.config.ts — do NOT add runtime/dynamic exports here

/* GET /api/orders/stream — admin subscribes to new orders (Server-Sent Events) */
export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return new Response("Non autorisé", { status: 401 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const cleanup = () => {
    unsubscribe?.();
    unsubscribe = null;
    if (heartbeat) clearInterval(heartbeat);
    heartbeat = null;
  };

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        try { controller.enqueue(encoder.encode(chunk)); }
        catch { cleanup(); }
      };

      send(`retry: 3000\n\n`);
      send(`event: ready\ndata: ok\n\n`);

      unsubscribe = onNewOrder((order) => {
        send(`event: order\ndata: ${JSON.stringify({ id: order.id, total: order.total })}\n\n`);
      });

      // keep the connection alive through proxies
      heartbeat = setInterval(() => send(`: ping\n\n`), 20_000);

      req.signal.addEventListener("abort", () => {
        cleanup();
        try { controller.close(); } catch { /* already closed */ }
      });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream; charset=utf-8",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
