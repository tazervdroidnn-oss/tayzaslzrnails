import { z } from "zod";

const line = (max: number) => z.string().trim().min(1).max(max);
const image = z.string().trim().max(500).refine(
  (value) =>
    (/^\/(?!\/)[\p{L}\p{N}%._~!$&'()+,;=@\/-]+$/u.test(value) ||
      /^https:\/\/[a-zA-Z0-9.-]+(?:\/[^\s<>"']*)?$/.test(value)),
  "Use um endereço HTTPS ou um caminho de imagem do site."
);
const galleryItem = z.object({
  id: line(80),
  name: line(90),
  price: line(30),
  image,
  alt: line(160),
  description: z.string().trim().max(200).optional(),
}).strict();

export const studioContentSchema = z.object({
  brand: line(65),
  hero: z.object({
    eyebrow: line(100),
    title: line(100),
    emphasis: line(70),
    intro: line(320),
    images: z.array(image).min(1).max(4),
  }).strict(),
  contact: z.object({
    whatsapp: z.string().regex(/^\d{10,15}$/, "Informe o número com DDI e DDD, apenas dígitos."),
    instagram: z.string().regex(/^[a-zA-Z0-9._]{1,30}$/, "Informe somente o usuário do Instagram."),
  }).strict(),
  menu: z.array(z.object({
    id: line(40),
    title: line(40),
    subtitle: line(80),
    image,
    items: z.array(z.object({
      id: line(80),
      name: line(70),
      price: line(30),
      note: z.string().trim().max(40).optional(),
      description: z.string().trim().max(160).optional(),
    }).strict()).min(1).max(30),
  }).strict()).min(1).max(8),
  profile: z.object({
    name: line(60),
    role: line(90),
    bio: line(500),
    photo: image,
    location: line(60),
    experience: line(30),
    personal: z.string().regex(/^[a-zA-Z0-9._]{0,30}$/, "Informe somente o usuário do Instagram."),
  }).strict(),
  tips: z.array(z.object({
    id: line(40),
    title: line(40),
    items: z.array(line(160)).min(1).max(8),
  }).strict()).max(6),
  lashes: z.array(galleryItem).max(30),
  nails: z.array(galleryItem).max(30),
  payments: z.object({ card: z.boolean(), pix: z.boolean(), cash: z.boolean() }).strict()
    .refine((p) => p.card || p.pix || p.cash, "Selecione uma forma de pagamento."),
}).strict();

export type StudioContent = z.infer<typeof studioContentSchema>;
