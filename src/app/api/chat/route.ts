import { HashbrownOpenAI } from "@hashbrownai/openai";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response("No API key found", {
      status: 401,
    });
  }

  const stream = HashbrownOpenAI.stream.text({
    apiKey: apiKey,
    request: await req.json(),
  });

  const { readable, writable } = new TransformStream();

  (async () => {
    const writer = writable.getWriter();

    try {
      for await (const chunk of stream) {
        await writer.write(chunk);
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}
