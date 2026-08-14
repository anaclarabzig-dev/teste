-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'IMPRENSA',
    "setor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CalendarActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT,
    "categoria" TEXT NOT NULL,
    "aDefinir" BOOLEAN NOT NULL DEFAULT false,
    "isNews" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "IndustryEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "periodo" TEXT,
    "data" TEXT
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vacation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TextProductionStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mes" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "tema" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "TextProductionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mes" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "numero" TEXT
);

-- CreateTable
CREATE TABLE "PressTeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "ramal" TEXT,
    "area" TEXT,
    "atividades" TEXT
);

-- CreateTable
CREATE TABLE "Spokesperson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "area" TEXT,
    "agenda" TEXT
);

-- CreateTable
CREATE TABLE "RelationshipAgenda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "portaVoz" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "temaSugerido" TEXT,
    "jornalistaVeiculo" TEXT
);

-- CreateTable
CREATE TABLE "JournalismTeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AgencyMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "funcao" TEXT,
    "cor" TEXT,
    "atividades" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DesignActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "demandante" TEXT,
    "executor" TEXT,
    "demanda" TEXT,
    "descricao" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "dataInicio" TEXT,
    "dataEntrega" TEXT,
    "usoIA" TEXT,
    "linkAcesso" TEXT
);

-- CreateTable
CREATE TABLE "MultimediaActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "demandante" TEXT,
    "executor" TEXT,
    "demanda" TEXT,
    "formato" TEXT,
    "fotos" INTEGER NOT NULL DEFAULT 0,
    "audioTime" TEXT,
    "videoTime" TEXT,
    "upload" TEXT,
    "dataSolicitacao" TEXT,
    "dataEntrega" TEXT
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "collectionPath" TEXT NOT NULL,
    "deletedItem" TEXT NOT NULL,
    "timestamp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_data_key" ON "Newsletter"("data");

-- CreateIndex
CREATE UNIQUE INDEX "TextProductionStat_mes_categoria_org_key" ON "TextProductionStat"("mes", "categoria", "org");
