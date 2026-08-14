# DirCom Online

Sistema de atividades, calendários, férias, produção de textos, imprensa e
design/multimídia da equipe de comunicação, migrado a partir do backup do
sistema anterior.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma 6 + PostgreSQL
- Auth.js (NextAuth v5) com login por usuário/senha e sessão JWT

## Como rodar localmente

Requer um banco PostgreSQL (local ou na nuvem — pode usar o mesmo banco do
deploy, veja a seção seguinte).

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e gere um AUTH_SECRET
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Acesse `http://localhost:3000`.

## Deploy na Vercel

1. Crie um banco Postgres gratuito: no painel da Vercel, aba **Storage** →
   **Create Database** → **Postgres** (ou use o **Neon** diretamente em
   neon.tech). Copie a `DATABASE_URL` gerada.
2. Importe o repositório na Vercel (**Add New → Project**, selecione
   `anaclarabzig-dev/teste`, branch `claude/sistema-atividades-online-2mzgu7`).
3. Em **Environment Variables**, adicione:
   - `DATABASE_URL`: a connection string do passo 1
   - `AUTH_SECRET`: um valor aleatório (gere com `openssl rand -base64 32`)
4. Clique em **Deploy**. O Prisma Client é gerado automaticamente no build
   (script `postinstall`).
5. Depois do primeiro deploy, rode as migrações e o seed **uma vez**, do seu
   computador, apontando pra `DATABASE_URL` de produção:
   ```bash
   set DATABASE_URL=postgresql://...   (Windows PowerShell: $env:DATABASE_URL="...")
   npx prisma migrate deploy
   npx prisma db seed
   ```
6. Acesse a URL que a Vercel gerou (ex: `teste.vercel.app`) e faça login
   normalmente.

## Login inicial

Os usuários foram importados do backup do sistema anterior, com as **senhas
originais preservadas** (armazenadas como hash bcrypt — nunca em texto puro
no código). O usuário `admin` tem a senha original `admin`; recomenda-se
trocá-la assim que possível.

Papéis:

- **ADMIN**: acesso total a todos os módulos.
- **AGENCIA**: pode editar Calendário, Newsletters, Eventos, Viagens, Design
  & Multimídia e a equipe da Agência.
- **IMPRENSA**: pode editar Equipe de Imprensa, Porta-vozes, Agenda de
  Relacionamento e Produção de Textos.
- Férias podem ser cadastradas por cada setor para si mesmo; admin gerencia
  as duas.
- Todos os usuários logados podem **visualizar** todos os módulos.

## Reimportar dados de um novo backup

O conversor lê o JSON exportado do sistema antigo e gera
`prisma/seed-data.generated.json` (senhas já com hash bcrypt — este arquivo
é seguro para versionar):

```bash
node scripts/convert-backup.mjs /caminho/para/backup.json
npx prisma db seed
```

## Estrutura dos módulos

- **Calendário**: atividades da agência, rodízio de newsletters, eventos do
  setor industrial e viagens da equipe.
- **Férias**: controle de férias por setor (Imprensa / Agência).
- **Produção de Textos**: releases, avisos, posicionamentos, notas, artigos,
  briefings e entrevistas por organização (CNI, SENAI, SESI, IEL) e por mês.
- **Imprensa**: equipe, porta-vozes e agenda de relacionamento com
  jornalistas.
- **Design & Multimídia**: demandas de design (artes, thumbnails) e de
  multimídia (foto, áudio, vídeo).
- **Equipes**: membros das equipes de Agência e Jornalismo.
- **Histórico**: registro de itens removidos do sistema anterior.

## Deploy

Qualquer plataforma compatível com Next.js (Vercel, Railway, etc.) funciona.
Para produção, troque o SQLite por Postgres/MySQL alterando o
`datasource` em `prisma/schema.prisma` e a variável `DATABASE_URL`, e defina
um `AUTH_SECRET` aleatório e seguro.
