import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft, Camera, Check, ImagePlus, LayoutDashboard, Loader2, LockKeyhole,
  LogOut, Plus, Save, Trash2,
} from "lucide-react";
import type { StudioContent } from "../lib/studio-content-schema";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração | Tayza Nails" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: AdminPanel,
});

type GalleryItem = StudioContent["lashes"][number];
type GalleryKey = "lashes" | "nails";
type Tab = "inicio" | "servicos" | "cilios" | "unhas" | "contato";

async function api(payload?: Record<string, unknown>) {
  const response = await fetch("/api/studio-admin", {
    method: payload ? "POST" : "GET",
    credentials: "same-origin",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({ error: "Erro inesperado do servidor." }));
  if (!response.ok) throw new Error(body.error || "Não foi possível concluir a ação.");
  return body as {
    authenticated?: boolean; configured?: boolean;
    data?: StudioContent; revision?: string; image?: string;
  };
}

function Field({ label, value, onChange, multiline = false, hint }: {
  label: string; value: string; onChange: (value: string) => void;
  multiline?: boolean; hint?: string;
}) {
  const common = "mt-2 w-full rounded-xl border border-amber-300/20 bg-[#1c1029] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/80 focus:ring-2 focus:ring-amber-300/10";
  return (
    <label className="block min-w-0">
      <span className="text-sm font-medium text-amber-100">{label}</span>
      {multiline
        ? <textarea rows={3} className={common + " resize-y"} value={value} onChange={(e) => onChange(e.target.value)} />
        : <input className={common} value={value} onChange={(e) => onChange(e.target.value)} />}
      {hint && <span className="mt-1 block text-xs text-white/50">{hint}</span>}
    </label>
  );
}

function PhotoInput({ label, url, busy, onUpload, onUrl }: {
  label: string; url: string; busy: boolean;
  onUpload: (file: File) => void; onUrl: (value: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-300/20 bg-[#2b173b]/70 p-4">
      <div className="flex items-center gap-4">
        <div className="size-24 shrink-0 overflow-hidden rounded-xl border border-amber-300/30 bg-black/30">
          <img src={url} alt={label} className="size-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-sm font-semibold text-amber-100">{label}</p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-amber-300/50 px-4 py-2 text-sm text-amber-200 transition hover:bg-amber-200/10">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            {busy ? "Enviando..." : "Trocar foto"}
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) onUpload(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <p className="mt-2 text-xs text-white/50">JPG, PNG ou WebP, até 2,5 MB</p>
        </div>
      </div>
      <Field label="Ou informe o endereço da imagem" value={url} onChange={onUrl} />
    </div>
  );
}

function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<StudioContent | null>(null);
  const [revision, setRevision] = useState("");
  const [tab, setTab] = useState<Tab>("inicio");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const result = await api();
      setConfigured(result.configured !== false);
      setAuthenticated(result.authenticated === true);
      if (result.authenticated && result.data) {
        setContent(result.data);
        setRevision(result.revision || "");
        setDirty(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de conexão.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);

  function edit(update: (current: StudioContent) => StudioContent) {
    setContent((prev) => prev ? update(prev) : prev);
    setDirty(true);
    setNotice("");
    setError("");
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await api({ action: "login", password });
      setPassword("");
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível entrar."); }
    finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true);
    try {
      await api({ action: "logout" });
      setAuthenticated(false); setContent(null); setRevision(""); setDirty(false);
      setNotice(""); setError("");
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao sair."); }
    finally { setBusy(false); }
  }

  async function save() {
    if (!content) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await api({ action: "save", data: content, revision });
      setRevision(result.revision || "");
      setDirty(false);
      setNotice("Alterações salvas no GitHub! A publicação no site será atualizada após o deploy da hospedagem.");
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível salvar."); }
    finally { setBusy(false); }
  }

  async function upload(file: File, key: string, apply: (url: string) => void) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2_500_000) {
      setError("Escolha uma foto JPG, PNG ou WebP de até 2,5 MB.");
      return;
    }
    setUploading(key); setError(""); setNotice("");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = "";
      for (let i = 0; i < bytes.length; i += 32768) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
      }
      const result = await api({ action: "upload", mime: file.type, base64: btoa(binary) });
      if (!result.image) throw new Error("A foto não foi enviada.");
      apply(result.image);
      setNotice("Foto enviada. Clique em Salvar alterações para vinculá-la ao site.");
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao enviar foto."); }
    finally { setUploading(null); }
  }

  function editGallery(group: GalleryKey, id: string, key: keyof GalleryItem, value: string) {
    edit((s) => ({
      ...s,
      [group]: s[group].map((item) => item.id === id ? { ...item, [key]: value } : item),
    }));
  }

  function gallery(group: GalleryKey) {
    if (!content) return null;
    const items = content[group];
    return (
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-amber-200">{group === "lashes" ? "Trabalhos de cílios" : "Trabalhos de unhas"}</h2>
            <p className="mt-1 text-sm text-white/60">Atualize os nomes, fotos e valores que aparecem no site.</p>
          </div>
          <button
            type="button"
            disabled={items.length >= 30}
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 px-4 py-2 text-sm text-amber-100 hover:bg-amber-300/10 disabled:opacity-40"
            onClick={() => edit((s) => ({
              ...s,
              [group]: [...s[group], { id: "item-" + Date.now(), name: "Novo trabalho", price: "R$ 0,00", image: "/alongamento1.jpeg", alt: "Trabalho do studio" }],
            }))}
          >
            <Plus className="size-4" /> Adicionar
          </button>
        </div>
        {items.length === 0 && <p className="rounded-xl border border-white/10 p-6 text-white/60">Nenhum trabalho cadastrado.</p>}
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((item, i) => (
            <article key={item.id} className="space-y-4 rounded-2xl border border-amber-300/20 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-amber-200">Trabalho {i + 1}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-rose-200 hover:text-rose-100"
                  onClick={() => edit((s) => ({ ...s, [group]: s[group].filter((entry) => entry.id !== item.id) }))}
                ><Trash2 className="size-4" /> Excluir</button>
              </div>
              <PhotoInput
                label="Foto do trabalho"
                url={item.image}
                busy={uploading === item.id}
                onUpload={(file) => void upload(file, item.id, (url) => editGallery(group, item.id, "image", url))}
                onUrl={(value) => editGallery(group, item.id, "image", value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" value={item.name} onChange={(v) => editGallery(group, item.id, "name", v)} />
                <Field label="Preço" value={item.price} onChange={(v) => editGallery(group, item.id, "price", v)} />
              </div>
              <Field label="Descrição da imagem" value={item.alt} onChange={(v) => editGallery(group, item.id, "alt", v)} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#190c27] text-amber-200">
      <Loader2 className="mr-3 size-6 animate-spin" /> Carregando painel...
    </div>
  );

  if (!authenticated) return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#50204d,#180b27_70%)] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-amber-300/30 bg-[#25122f] p-8 shadow-2xl sm:p-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-amber-200/80 hover:text-amber-200"><ArrowLeft className="size-4" /> Voltar ao site</a>
        <div className="mx-auto mt-7 grid size-16 place-items-center rounded-2xl border border-amber-300/50 bg-amber-300/10 text-amber-200"><LockKeyhole className="size-8" /></div>
        <p className="mt-5 text-center text-xs uppercase tracking-[.3em] text-amber-200/70">Área exclusiva</p>
        <h1 className="mt-2 text-center font-display text-4xl text-amber-200">Tayza Nails</h1>
        <p className="mt-2 text-center text-sm text-white/65">Painel de administração do studio</p>
        {!configured ? (
          <div className="mt-8 rounded-xl border border-amber-300/30 bg-amber-200/10 p-4 text-sm text-amber-100">
            Painel aguardando configuração na Vercel. O responsável técnico deve cadastrar ADMIN_PASSWORD, ADMIN_SESSION_SECRET e ADMIN_GITHUB_TOKEN nas variáveis de ambiente.
          </div>
        ) : (
          <form onSubmit={(e) => void login(e)} className="mt-8 space-y-5">
            <label className="block text-sm text-amber-100">
              Senha da proprietária
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="mt-2 w-full rounded-xl border border-amber-300/30 bg-[#190e26] px-4 py-3 text-white outline-none focus:border-amber-300"
              />
            </label>
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e2b951] via-[#f7de96] to-[#c9a04b] px-6 py-3 font-semibold text-[#24132d] transition hover:brightness-110 disabled:opacity-60">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />} Entrar no painel
            </button>
          </form>
        )}
        {error && <p role="alert" className="mt-4 rounded-xl border border-rose-300/40 bg-rose-900/30 p-3 text-sm text-rose-100">{error}</p>}
        <p className="mt-8 text-center text-xs text-white/40">Acesso restrito à proprietária do studio.</p>
      </div>
    </div>
  );

  if (!content) return (
    <div className="min-h-screen bg-[#190c27] p-8 text-white">
      <h1 className="font-display text-3xl text-amber-200">Não foi possível carregar o conteúdo</h1>
      {error && <p className="mt-3 text-rose-200">{error}</p>}
      <button className="mt-5 underline" onClick={() => void refresh()}>Tentar novamente</button>
    </div>
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "inicio", label: "Página inicial" },
    { id: "servicos", label: "Serviços" },
    { id: "cilios", label: "Cílios" },
    { id: "unhas", label: "Unhas" },
    { id: "contato", label: "Contato e pagamentos" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#4c1747,#1b0e2c_68%)] text-white">
      <header className="border-b border-amber-300/20 bg-[#190d27]/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-amber-300/10 text-amber-200"><LayoutDashboard className="size-6" /></div>
            <div>
              <p className="font-display text-2xl italic text-amber-200">Tayza Nails</p>
              <p className="text-xs uppercase tracking-[.18em] text-white/50">Painel administrativo</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" target="_blank" rel="noreferrer" className="text-amber-200 hover:underline">Ver site ↗</a>
            <button disabled={busy} type="button" onClick={() => void logout()} className="inline-flex items-center gap-2 text-white/75 hover:text-white"><LogOut className="size-4" /> Sair</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[220px_minmax(0,1fr)] sm:px-8">
        <aside className="space-y-2 self-start rounded-2xl border border-amber-300/20 bg-[#261333]/80 p-3 md:sticky md:top-6">
          <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-[.2em] text-amber-300/70">Gerenciar site</p>
          {tabs.map((entry) => (
            <button
              key={entry.id} type="button"
              onClick={() => setTab(entry.id)}
              className={"w-full rounded-xl px-4 py-3 text-left text-sm transition " +
                (tab === entry.id ? "bg-amber-200 font-semibold text-[#25142d]" : "text-white/75 hover:bg-white/10 hover:text-white")}
            >{entry.label}</button>
          ))}
        </aside>

        <main className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-amber-300/60">Gerenciamento</p>
              <h1 className="mt-1 font-display text-4xl text-amber-200">Seu studio, do seu jeito</h1>
              <p className="mt-1 text-sm text-white/60">Faça alterações e clique em salvar para publicar no repositório.</p>
            </div>
            <button
              type="button" disabled={busy || Boolean(uploading) || !dirty}
              onClick={() => void save()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d8ae51] to-[#ffe4a1] px-6 py-3 text-sm font-bold text-[#29132d] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Salvar alterações
            </button>
          </div>

          {notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-300/30 bg-emerald-800/25 p-4 text-sm text-emerald-100"><Check className="mt-0.5 size-4 shrink-0" /> {notice}</div>}
          {error && <div role="alert" className="rounded-xl border border-rose-300/30 bg-rose-900/30 p-4 text-sm text-rose-100">{error}</div>}
          {dirty && <p className="text-xs font-medium text-amber-200/80">Você tem alterações ainda não salvas.</p>}
          <div className="rounded-[1.75rem] border border-amber-300/20 bg-[#251431]/85 p-5 shadow-xl sm:p-8">
            {tab === "inicio" && (
              <section className="space-y-5">
                <h2 className="font-display text-3xl text-amber-200">Informações da página inicial</h2>
                <Field label="Nome do studio" value={content.brand} onChange={(v) => edit((s) => ({ ...s, brand: v }))} />
                <Field label="Frase superior" multiline value={content.hero.eyebrow} onChange={(v) => edit((s) => ({ ...s, hero: { ...s.hero, eyebrow: v } }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Título principal" value={content.hero.title} onChange={(v) => edit((s) => ({ ...s, hero: { ...s.hero, title: v } }))} />
                  <Field label="Palavra em destaque" value={content.hero.emphasis} onChange={(v) => edit((s) => ({ ...s, hero: { ...s.hero, emphasis: v } }))} />
                </div>
                <Field label="Texto de apresentação" multiline value={content.hero.intro} onChange={(v) => edit((s) => ({ ...s, hero: { ...s.hero, intro: v } }))} />
                <h3 className="border-t border-white/10 pt-5 font-display text-2xl text-amber-200">Fotos de destaque</h3>
                <p className="text-sm text-white/60">As fotos se alternam suavemente no topo do site.</p>
                {content.hero.images.map((img, index) => (
                  <PhotoInput
                    key={index} label={"Foto de destaque " + (index + 1)} url={img}
                    busy={uploading === "hero-" + index}
                    onUpload={(file) => void upload(file, "hero-" + index, (url) => edit((s) => ({
                      ...s, hero: { ...s.hero, images: s.hero.images.map((old, i) => i === index ? url : old) }
                    })))}
                    onUrl={(value) => edit((s) => ({ ...s, hero: { ...s.hero, images: s.hero.images.map((old, i) => i === index ? value : old) } }))}
                  />
                ))}
                <button
                  type="button" disabled={content.hero.images.length >= 4}
                  onClick={() => edit((s) => ({ ...s, hero: { ...s.hero, images: [...s.hero.images, "/alongamento1.jpeg"] } }))}
                  className="inline-flex items-center gap-2 text-sm text-amber-200 disabled:opacity-40"
                ><ImagePlus className="size-4" /> Adicionar foto de destaque</button>
                {content.hero.images.length > 1 && <button
                  type="button"
                  onClick={() => edit((s) => ({ ...s, hero: { ...s.hero, images: s.hero.images.slice(0, -1) } }))}
                  className="ml-5 text-sm text-rose-200"
                >Remover última foto</button>}
              </section>
            )}
            {tab === "servicos" && (
              <section className="space-y-5">
                <h2 className="font-display text-3xl text-amber-200">Serviços oferecidos</h2>
                <p className="text-sm text-white/60">Estes são os quadradinhos da seção “Tudo para suas unhas”.</p>
                {content.services.map((service) => (
                  <div key={service.id} className="space-y-4 rounded-2xl border border-white/10 bg-white/[.04] p-5">
                    <div className="grid gap-4 sm:grid-cols-[80px_1fr_145px]">
                      <Field label="Ícone" value={service.icon} onChange={(v) => edit((s) => ({ ...s, services: s.services.map((it) => it.id === service.id ? { ...it, icon: v } : it) }))} />
                      <Field label="Nome" value={service.name} onChange={(v) => edit((s) => ({ ...s, services: s.services.map((it) => it.id === service.id ? { ...it, name: v } : it) }))} />
                      <Field label="A partir de" value={service.startingPrice} onChange={(v) => edit((s) => ({ ...s, services: s.services.map((it) => it.id === service.id ? { ...it, startingPrice: v } : it) }))} />
                    </div>
                    <Field label="Descrição" multiline value={service.description} onChange={(v) => edit((s) => ({ ...s, services: s.services.map((it) => it.id === service.id ? { ...it, description: v } : it) }))} />
                    {content.services.length > 1 && <button type="button" className="inline-flex items-center gap-1 text-xs text-rose-200" onClick={() => edit((s) => ({ ...s, services: s.services.filter((it) => it.id !== service.id) }))}><Trash2 className="size-4" /> Remover serviço</button>}
                  </div>
                ))}
                <button type="button" disabled={content.services.length >= 12} className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 px-4 py-2 text-sm text-amber-200 disabled:opacity-40" onClick={() => edit((s) => ({ ...s, services: [...s.services, { id: "serv-" + Date.now(), icon: "✧", name: "Novo serviço", startingPrice: "R$ 0", description: "Descrição do serviço." }] }))}><Plus className="size-4" /> Adicionar serviço</button>
              </section>
            )}
            {tab === "cilios" && gallery("lashes")}
            {tab === "unhas" && gallery("nails")}
            {tab === "contato" && (
              <section className="space-y-5">
                <h2 className="font-display text-3xl text-amber-200">Contato e pagamentos</h2>
                <Field
                  label="WhatsApp com DDI e DDD"
                  hint="Exemplo: 5599999999999. Apenas números, sem espaços ou símbolos."
                  value={content.contact.whatsapp}
                  onChange={(v) => edit((s) => ({ ...s, contact: { ...s.contact, whatsapp: v } }))}
                />
                <Field
                  label="Usuário do Instagram (sem @)"
                  value={content.contact.instagram}
                  onChange={(v) => edit((s) => ({ ...s, contact: { ...s.contact, instagram: v } }))}
                />
                <h3 className="border-t border-white/10 pt-5 font-display text-2xl text-amber-200">Formas de pagamento aceitas</h3>
                {([
                  ["card", "Cartão"],
                  ["pix", "Pix"],
                  ["cash", "Dinheiro em espécie"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4 text-sm">
                    <input
                      type="checkbox" checked={content.payments[key]}
                      onChange={(e) => edit((s) => ({ ...s, payments: { ...s.payments, [key]: e.target.checked } }))}
                      className="size-4 accent-amber-300"
                    /> {label}
                  </label>
                ))}
              </section>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-12">
            <p className="text-xs text-white/45">As imagens e os dados são armazenados no repositório do projeto. O site precisa concluir o deploy para mostrar as novidades.</p>
            <button type="button" disabled={busy || Boolean(uploading) || !dirty} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 px-6 py-3 text-sm font-semibold text-amber-200 hover:bg-amber-200/10 disabled:opacity-40">
              <Save className="size-4" /> Salvar alterações
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
