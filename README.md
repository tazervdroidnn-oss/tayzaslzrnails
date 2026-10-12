# Nails & Lashes Studio

crie uma pagina sobre minha conta de nails, um ladingpage, sobre unhas e cilios e manunteção

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tayzaslzrnails.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5625cf8d-cb37-4dc8-992a-f74f34ae2ef1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Painel administrativo da proprietária

Acesse a rota **/admin** no domínio do site. A proprietária pode editar textos, serviços, preços, galeria, fotos, contatos e meios de pagamento.

### Ativação segura na Vercel

No projeto Vercel ligado a este repositório, vá em Settings → Environment Variables e configure para Production:

- `ADMIN_PASSWORD`: senha exclusiva da proprietária (mínimo 12 caracteres).
- `ADMIN_SESSION_SECRET`: segredo aleatório de pelo menos 32 caracteres, diferente da senha.
- `ADMIN_GITHUB_TOKEN`: token fine-grained restrito a este repositório, com Contents → Read and write.

Nunca publique senhas e tokens no GitHub, JavaScript do site ou mensagens. Faça um redeploy da produção depois de configurar as variáveis. A página pública funciona sem elas, mas o acesso ao painel ficará bloqueado.

Ao salvar, o painel cria um commit atualizando `src/data/studio-content.json` na branch main. Novas imagens são publicadas em `public/admin-images/`. O deploy da Vercel precisa estar conectado ao GitHub e à branch main para publicar as alterações automaticamente. Cada envio de imagem também cria um commit; clique em Salvar alterações para vincular a foto à página.

O painel usa um cookie de sessão assinado, HTTP-only, com validade de 12 horas. Exige POSTs de mesma origem, valida entradas e arquivos JPG/PNG/WebP e inclui limitação básica de tentativas de login por instância. Em produção com exposição significativa, adicione proteção WAF/rate limiting centralizado.

Se outra pessoa editar o conteúdo no GitHub durante sua sessão, atualize o painel antes de salvar.
