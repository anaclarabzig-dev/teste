import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, "seed-data.generated.json");
  if (!existsSync(dataPath)) {
    console.log(
      "Nenhum prisma/seed-data.generated.json encontrado. Rode `node scripts/convert-backup.mjs <backup.json>` primeiro, ou crie usuários manualmente."
    );
    return;
  }
  const data = JSON.parse(readFileSync(dataPath, "utf-8"));

  for (const u of data.users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    });
  }

  if (data.calendarActivities.length) {
    await prisma.calendarActivity.createMany({ data: data.calendarActivities });
  }
  for (const n of data.newsletters) {
    await prisma.newsletter.upsert({
      where: { data: n.data },
      update: { responsavel: n.responsavel },
      create: n,
    });
  }
  if (data.industryEvents.length) {
    await prisma.industryEvent.createMany({ data: data.industryEvents });
  }
  if (data.trips.length) {
    await prisma.trip.createMany({ data: data.trips });
  }
  if (data.vacations.length) {
    await prisma.vacation.createMany({ data: data.vacations });
  }
  for (const s of data.textStats) {
    await prisma.textProductionStat.upsert({
      where: { mes_categoria_org: { mes: s.mes, categoria: s.categoria, org: s.org } },
      update: { quantidade: s.quantidade, tema: s.tema },
      create: s,
    });
  }
  if (data.textItems.length) {
    await prisma.textProductionItem.createMany({ data: data.textItems });
  }
  if (data.pressTeam.length) {
    await prisma.pressTeamMember.createMany({ data: data.pressTeam });
  }
  if (data.spokespersons.length) {
    await prisma.spokesperson.createMany({ data: data.spokespersons });
  }
  if (data.relationshipAgenda.length) {
    await prisma.relationshipAgenda.createMany({ data: data.relationshipAgenda });
  }
  if (data.journalismTeam.length) {
    await prisma.journalismTeamMember.createMany({ data: data.journalismTeam });
  }
  if (data.agencyMembers.length) {
    await prisma.agencyMember.createMany({ data: data.agencyMembers });
  }
  if (data.designActivities.length) {
    await prisma.designActivity.createMany({ data: data.designActivities });
  }
  if (data.multimediaActivities.length) {
    await prisma.multimediaActivity.createMany({ data: data.multimediaActivities });
  }
  if (data.changeLog.length) {
    await prisma.changeLog.createMany({ data: data.changeLog });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
