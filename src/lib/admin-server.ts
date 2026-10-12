import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { studioContentSchema, type StudioContent } from "./studio-content-schema";

const REPOSITORY = "tazervdroidnn-oss/tayzaslzrnails";
const CONTENT_PATH = "src/data/studio-content.json";
const COOKIE_NAME = "tayza_admin_session";
const SESSION_AGE_SECONDS = 12 * 60 * 60;

class AdminError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
const attempts = new Map<string, { count: number; until: number }>();

function settingsReady() {
  return Boolean(
    process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12 &&
    process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32 &&
    process.env.ADMIN_GITHUB_TOKEN
  );
}

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new AdminError(503, "Configuração do painel incompleta.");
  return value;
}

function hash(value: string, key: string) {
  return createHmac("sha256", key).update(value).digest("hex");
}

function equal(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function cookieValue() {
  const body = Buffer.from(JSON.stringify({
    role: "owner",
    expiry: Date.now() + SESSION_AGE_SECONDS * 1000,
  })).toString("base64url");
  return body + "." + hash(body, secret());
}

function isAuthorized(request: Request) {
  if (!settingsReady()) return false;
  const cookies = request.headers.get("cookie") || "";
  const raw = cookies.split(";").map((p) => p.trim()).find((p) => p.startsWith(COOKIE_NAME + "="));
  if (!raw) return false;
  const value = raw.slice(COOKIE_NAME.length + 1);
  const [body, signature, extra] = value.split(".");
  if (!body || !signature || extra || !equal(hash(body, secret()), signature)) return false;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return data.role === "owner" && typeof data.expiry === "number" && data.expiry > Date.now();
  } catch { return false; }
}

function setCookie(request: Request, value: string, expired = false) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return COOKIE_NAME + "=" + value + "; Path=/; HttpOnly; SameSite=Strict" +
    secure + "; Max-Age=" + (expired ? 0 : SESSION_AGE_SECONDS);
}

function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new AdminError(403, "Requisição não autorizada.");
  }
}

function json(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function github(method: "GET" | "PUT", path: string, body?: Record<string, unknown>) {
  const token = process.env.ADMIN_GITHUB_TOKEN;
  if (!token) throw new AdminError(503, "Token do GitHub não configurado.");
  const response = await fetch(
    "https://api.github.com/repos/" + REPOSITORY + "/contents/" + path,
    {
      method,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + token,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "tayza-studio-admin",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    }
  );
  if (!response.ok) {
    if (response.status === 409 || response.status === 422) {
      throw new AdminError(409, "Os arquivos foram alterados. Atualize o painel e tente novamente.");
    }
    throw new AdminError(502, "Não foi possível acessar o GitHub (" + response.status + ").");
  }
  return response.json() as Promise<{ sha?: string; content?: string; content_sha?: string; content?: string; download_url?: string; }>;
}

async function readContent(): Promise<{ data: StudioContent; revision: string }> {
  const file = await github("GET", CONTENT_PATH);
  if (!file.content || !file.sha) throw new AdminError(502, "O arquivo de configuração não foi encontrado.");
  const data = studioContentSchema.parse(JSON.parse(Buffer.from(file.content.replace(/\s/g, ""), "base64").toString("utf8")));
  return { data, revision: file.sha };
}

function assertAuth(request: Request) {
  if (!isAuthorized(request)) throw new AdminError(401, "Sua sessão expirou. Entre novamente.");
}

async function parsePost(request: Request) {
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    throw new AdminError(415, "Formato de envio inválido.");
  }
  if (Number(request.headers.get("content-length") || 0) > 4_000_000) {
    throw new AdminError(413, "Arquivo muito grande.");
  }
  const raw = await request.text();
  if (raw.length > 4_000_000) throw new AdminError(413, "Arquivo muito grande.");
  try { return JSON.parse(raw) as Record<string, unknown>; }
  catch { throw new AdminError(400, "Dados inválidos."); }
}

function checkRateLimit(request: Request, success: boolean) {
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const now = Date.now();
  if (attempts.size > 3000) attempts.clear();
  const hit = attempts.get(ip);
  if (hit && hit.until > now && hit.count >= 8) throw new AdminError(429, "Muitas tentativas. Tente novamente em 15 minutos.");
  if (success) attempts.delete(ip);
  else attempts.set(ip, { count: (hit && hit.until > now ? hit.count : 0) + 1, until: now + 15 * 60 * 1000 });
}

function validateImage(mime: unknown, buffer: Buffer) {
  if (buffer.length < 12 || buffer.length > 2_500_000) {
    throw new AdminError(413, "Envie uma foto de até 2,5 MB.");
  }
  if (mime === "image/jpeg" && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (mime === "image/png" && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return "png";
  if (mime === "image/webp" && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  throw new AdminError(400, "Use uma imagem JPG, PNG ou WebP válida.");
}

export async function adminGet(request: Request) {
  try {
    if (!isAuthorized(request)) return json({ authenticated: false, configured: settingsReady() });
    const latest = await readContent();
    return json({ authenticated: true, ...latest });
  } catch (error) { return errorResponse(error); }
}

export async function adminPost(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await parsePost(request);
    if (body.action === "login") {
      if (!settingsReady()) throw new AdminError(503, "Configure as variáveis de ambiente na Vercel para ativar o painel.");
      const password = typeof body.password === "string" ? body.password : "";
      const actual = process.env.ADMIN_PASSWORD || "";
      // Timing-safe comparison of keyed digests. Neither the password nor the key is sent to the client.
      const correct = equal(hash(password, secret()), hash(actual, secret()));
      checkRateLimit(request, correct);
      if (!correct) throw new AdminError(401, "Senha incorreta.");
      return json({ ok: true }, 200, { "Set-Cookie": setCookie(request, cookieValue()) });
    }
    if (body.action === "logout") {
      return json({ ok: true }, 200, { "Set-Cookie": setCookie(request, "", true) });
    }
    assertAuth(request);
    if (body.action === "save") {
      const validated = studioContentSchema.safeParse(body.data);
      if (!validated.success) throw new AdminError(400, validated.error.issues[0]?.message || "Dados inválidos.");
      const latest = await readContent();
      if (body.revision !== latest.revision) {
        throw new AdminError(409, "Alguém atualizou o site. Recarregue os dados antes de salvar.");
      }
      const result = await github("PUT", CONTENT_PATH, {
        message: "Atualizar conteúdo pelo painel Tayza Nails",
        content: Buffer.from(JSON.stringify(validated.data, null, 2) + "\n").toString("base64"),
        sha: latest.revision,
        branch: "main",
      });
      // Return new SHA to allow subsequent edits without reloading.
      const current = await readContent();
      return json({ ok: true, revision: current.revision });
    }
    if (body.action === "upload") {
      if (typeof body.base64 !== "string" ||
        body.base64.length > 3_500_000 ||
        !/^[a-zA-Z0-9+/]+={0,2}$/.test(body.base64)) {
        throw new AdminError(400, "Foto inválida ou grande demais.");
      }
      const buffer = Buffer.from(body.base64, "base64");
      const ext = validateImage(body.mime, buffer);
      const path = "public/admin-images/" + randomUUID() + "." + ext;
      await github("PUT", path, {
        message: "Adicionar foto pelo painel Tayza Nails",
        content: body.base64,
        branch: "main",
      });
      return json({ ok: true, image: path.replace(/^public/, "") });
    }
    throw new AdminError(400, "Ação desconhecida.");
  } catch (error) { return errorResponse(error); }
}

function errorResponse(error: unknown) {
  if (error instanceof AdminError) return json({ error: error.message }, error.status);
  console.error("Admin request failed", error);
  return json({ error: "Não foi possível concluir a operação. Tente novamente." }, 500);
}
