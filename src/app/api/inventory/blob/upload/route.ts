import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser } from "@/lib/inventory-auth";

export async function POST(request: Request) {
  // Belt-and-suspenders alongside the proxy gate — never trust a Route
  // Handler is reachable only through it (see Next.js Proxy docs on
  // Server Functions bypassing a matcher).
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as HandleUploadBody;

  const result = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
      maximumSizeInBytes: 20 * 1024 * 1024,
      addRandomSuffix: true,
    }),
  });

  return Response.json(result);
}
