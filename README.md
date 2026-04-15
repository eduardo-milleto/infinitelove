# infinitelove 🌻💖

Site privado do namoro do Eduardo com a Isabella. Estética Stardew Valley (cozy, pixel) blendada com o design system do Claude (parchment warm, terracotta, serif editorial).

- **Contador infinito** desde 18 de abril de 2025.
- **Galeria de momentos**: fotos + historinha + meme.
- **Auth privado**: só 2 usuários, signup desabilitado.

## Stack

**Frontend** (`apps/web`) — deploy na Vercel
- Vite + React 19 + TanStack Router + TanStack Query
- React Aria Components, TailwindCSS v4
- Fontes: Lora (serif) + Pixelify Sans / Press Start 2P (pixel accents)

**Backend** (`apps/api`) — deploy no Railway
- Hono + @hono/node-server
- Better Auth (email/password, cookie httpOnly)
- Drizzle ORM + PostgreSQL
- `sharp` para otimizar uploads, `file-type` para validar mime real
- Railway Volume em `/data/photos`

**Shared** (`packages/shared`) — zod schemas e constantes compartilhadas.

## Dev local

Pré-requisitos: Node 20+, pnpm 9+, Postgres rodando local (ou use Docker).

```bash
# 1. instalar deps
pnpm install

# 2. criar banco local (uma vez)
createdb infinitelove

# 3. configurar env
cp apps/api/.env.example apps/api/.env
# edite BETTER_AUTH_SECRET para algo aleatório de 32+ chars
#   openssl rand -hex 32

cp apps/web/.env.example apps/web/.env

# 4. gerar + aplicar migrations
pnpm db:generate
pnpm db:migrate

# 5. seed dos 2 usuários (Eduardo + Isabella)
pnpm seed

# 6. rodar tudo
pnpm dev
#  → api em http://localhost:3001
#  → web em http://localhost:5173
```

Login inicial (troque após primeiro acesso):

- `eduardo@infinitelove.local` / `casalfodadms`
- `isabella@infinitelove.local` / `casalfodadms`

> ⚠️ A senha de seed está no `.env.example` apenas pra facilitar o bootstrap.
> **Troquem pela UI assim que logarem** — não deixem credenciais compartilhadas.

## Deploy

### Railway (backend + Postgres)

1. Novo projeto no Railway → conecta repo `infinitelove`.
2. Adicione o plugin **Postgres** (copia a `DATABASE_URL` nas envs do service).
3. Adicione um **Service** apontando pra este repo, com:
   - Root directory: `/` (a `railway.json` fica em `apps/api/railway.json` e aponta o Dockerfile)
   - Ou setar manualmente `dockerfilePath: apps/api/Dockerfile`
4. Crie um **Volume** e monte em `/data/photos`.
5. Envs do service:
   - `NODE_ENV=production`
   - `BETTER_AUTH_SECRET=` (32+ bytes aleatórios)
   - `BETTER_AUTH_URL=https://<seu-api>.up.railway.app`
   - `WEB_URL=https://<seu-site>.vercel.app`
   - `PHOTOS_DIR=/data/photos`
   - `SEED_PASSWORD=` (só se quiser rodar seed remoto)
6. Deploy. As migrations rodam automaticamente no start (`db:migrate && start`).
7. Seed: `railway run pnpm --filter api seed` (uma única vez).

### Vercel (frontend)

1. New Project → importe o repo.
2. Root directory: `apps/web`.
3. Framework: **Vite** (detecta pelo `vercel.json`).
4. Env: `VITE_API_URL=https://<seu-api>.up.railway.app`.
5. Deploy.

### Primeira verificação pós-deploy

- [ ] `GET https://api/health` retorna `{ ok: true }`
- [ ] Login funciona em produção
- [ ] Contador atualiza a cada segundo
- [ ] Upload de uma foto funciona e aparece no feed
- [ ] Logout + login como o outro usuário mostra o mesmo conteúdo
- [ ] `GET /api/moments` sem cookie retorna 401

## Estrutura

```
infinitelove/
├── apps/
│   ├── api/                  # Hono backend
│   │   ├── src/
│   │   │   ├── auth.ts       # Better Auth
│   │   │   ├── db/           # Drizzle schema + client
│   │   │   ├── lib/storage.ts  # sharp + file-type + volume
│   │   │   ├── middleware/
│   │   │   ├── routes/       # moments, photos
│   │   │   └── index.ts
│   │   ├── scripts/          # migrate, seed
│   │   ├── Dockerfile
│   │   └── railway.json
│   └── web/                  # Vite + React frontend
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── routes/       # TanStack Router (file-based)
│       │   └── styles/index.css   # Claude tokens + pixel accents
│       └── vercel.json
├── packages/
│   └── shared/               # zod schemas
└── README.md
```

## Design notes

- **Paleta base**: parchment `#f5f4ed` + ivory `#faf9f5` + terracotta `#c96442` (Claude).
- **Romance accents**: love pink (`#ff477e`, `#ffb3c6`) usado só em CTAs "love" e elementos afetivos.
- **Typography**: Lora para títulos + historinha (editorial); Press Start 2P só nos dígitos do contador (game flavor).
- **Shadows**: ring shadows warm (`0 0 0 1px #d1cfc5`) e whisper shadows (`rgba(0,0,0,0.05) 0 4px 24px`), não drop shadows pesadas.
- **Pixel frames**: usados somente em 1 momento de destaque (contador). O resto é Claude limpo.

## Scripts úteis

```bash
pnpm dev            # roda api + web em paralelo
pnpm build          # builda tudo
pnpm typecheck      # tsc em todos os workspaces
pnpm db:generate    # gera SQL de migration a partir do schema Drizzle
pnpm db:migrate     # aplica migrations no DB
pnpm db:push        # push direto do schema (só dev)
pnpm seed           # cria Eduardo + Isabella
```
