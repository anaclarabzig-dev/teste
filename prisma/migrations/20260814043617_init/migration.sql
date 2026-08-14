-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'IMPRENSA', 'AGENCIA');

-- CreateEnum
CREATE TYPE "Setor" AS ENUM ('IMPRENSA', 'AGENCIA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'IMPRENSA',
    "setor" "Setor",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarActivity" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT,
    "categoria" TEXT NOT NULL,
    "aDefinir" BOOLEAN NOT NULL DEFAULT false,
    "isNews" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryEvent" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "periodo" TEXT,
    "mes" TEXT,
    "data" TEXT,

    CONSTRAINT "IndustryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacation" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "setor" "Setor" NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL,

    CONSTRAINT "Vacation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextProductionStat" (
    "id" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "tema" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TextProductionStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextProductionItem" (
    "id" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "numero" TEXT,

    CONSTRAINT "TextProductionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PressTeamMember" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ramal" TEXT,
    "area" TEXT,
    "atividades" TEXT,

    CONSTRAINT "PressTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spokesperson" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "area" TEXT,
    "agenda" TEXT,

    CONSTRAINT "Spokesperson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipAgenda" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "portaVoz" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "temaSugerido" TEXT,
    "jornalistaVeiculo" TEXT,

    CONSTRAINT "RelationshipAgenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalismTeamMember" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,

    CONSTRAINT "JournalismTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyMember" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT,
    "cor" TEXT,
    "atividades" TEXT NOT NULL,

    CONSTRAINT "AgencyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignActivity" (
    "id" TEXT NOT NULL,
    "demandante" TEXT,
    "executor" TEXT,
    "demanda" TEXT,
    "descricao" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "dataInicio" TEXT,
    "dataEntrega" TEXT,
    "usoIA" TEXT,
    "linkAcesso" TEXT,

    CONSTRAINT "DesignActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultimediaActivity" (
    "id" TEXT NOT NULL,
    "demandante" TEXT,
    "executor" TEXT,
    "demanda" TEXT,
    "formato" TEXT,
    "fotos" INTEGER NOT NULL DEFAULT 0,
    "audioTime" TEXT,
    "videoTime" TEXT,
    "upload" TEXT,
    "dataSolicitacao" TEXT,
    "dataEntrega" TEXT,

    CONSTRAINT "MultimediaActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "collectionPath" TEXT NOT NULL,
    "deletedItem" TEXT NOT NULL,
    "timestamp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_data_key" ON "Newsletter"("data");

-- CreateIndex
CREATE UNIQUE INDEX "TextProductionStat_mes_categoria_org_key" ON "TextProductionStat"("mes", "categoria", "org");
