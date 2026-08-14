// One-off conversion tool: reads the legacy system's JSON backup and produces
// prisma/seed-data.generated.json, which the Prisma seed script consumes.
// User passwords are bcrypt-hashed here so the generated file (which IS
// committed) never contains plaintext credentials.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Uso: node scripts/convert-backup.mjs <caminho-do-backup.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputPath, "utf-8"));

const norm = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

// Build a first-name -> setor map from férias data (most reliable source).
const setorByFirstName = {};
for (const f of raw.ferias || []) {
  const first = norm(f.nome.split(" ")[0]);
  if (first) setorByFirstName[first] = f.setor;
}

// Manual overrides for usernames that don't map cleanly to a first name.
const manualSetor = {
  admin: null,
  eudesbenicio: "imprensa",
  gilberto: "agencia",
  cintia: "imprensa",
  augusto: "agencia",
  leluvis: "agencia",
  rafacosta: "imprensa",
  guilhermepera: "agencia",
  iuritorres: "agencia",
};

function guessSetor(username, nome) {
  const u = norm(username);
  if (u === "admin") return null;
  if (u in manualSetor) return manualSetor[u];
  const first = norm(nome.split(" ")[0]) || u;
  return setorByFirstName[first] || setorByFirstName[u] || "imprensa";
}

const users = (raw.users || []).map((u) => {
  const isAdmin = norm(u.nome) === "admin";
  const setor = guessSetor(u.nome, u.nome);
  return {
    username: norm(u.nome) || u.id,
    name: u.nome,
    passwordHash: bcrypt.hashSync(u.senha, 10),
    role: isAdmin ? "ADMIN" : setor === "agencia" ? "AGENCIA" : "IMPRENSA",
    setor: isAdmin ? null : setor === "agencia" ? "AGENCIA" : "IMPRENSA",
  };
});

const calendarActivities = (raw.agenciaCalendarioAtividades || []).map((a) => ({
  nome: a.nome,
  data: a.data,
  hora: a.hora || null,
  categoria: a.categoria || "outro",
  aDefinir: !!a.aDefinir,
  isNews: !!a.isNews,
}));

const newsletters = Object.entries(raw.agenciaCalendarioNewsletters || {}).map(
  ([data, responsavel]) => ({ data, responsavel })
);

const industryEvents = [];
const ce = raw.calendarioEventos || {};
if (ce.recesso2026)
  industryEvents.push({ titulo: "Recesso 2026", periodo: ce.recesso2026, mes: null, descricao: null, data: null });
if (ce.recesso2027)
  industryEvents.push({ titulo: "Recesso 2027", periodo: ce.recesso2027, mes: null, descricao: null, data: null });
for (const [mes, list] of Object.entries(ce.eventosPorMes || {})) {
  for (const ev of list) {
    industryEvents.push({ titulo: ev.nome, periodo: ev.data || null, mes, descricao: null, data: null });
  }
}

const trips = (raw.atividades?.viagens || []).map((v) => ({
  evento: v.evento,
  nome: v.nome,
  local: v.local,
  dataInicio: v.dataInicio,
  dataFim: v.dataFim,
}));

const vacations = (raw.ferias || []).map((f) => ({
  nome: f.nome,
  setor: f.setor === "agencia" ? "AGENCIA" : "IMPRENSA",
  dataInicio: f.dataInicio,
  dataFim: f.dataFim,
}));

const textStats = [];
const textItems = [];
for (const [mes, monthData] of Object.entries(raw.producaoTextos || {})) {
  const dados = monthData.dados || {};
  for (const [categoria, porOrg] of Object.entries(dados)) {
    for (const [org, stat] of Object.entries(porOrg)) {
      textStats.push({
        mes,
        categoria,
        org,
        quantidade: stat.quantidade || 0,
        tema: stat.tema || "",
      });
    }
  }
  for (const categoria of [
    "releases",
    "avisos",
    "posicionamentos",
    "notas",
    "artigos",
    "briefings",
    "entrevistas",
  ]) {
    const porOrgList = monthData[categoria] || {};
    for (const [org, items] of Object.entries(porOrgList)) {
      for (const item of items || []) {
        textItems.push({
          mes,
          categoria,
          org: org.toUpperCase(),
          assunto: item.assunto || "",
          numero: item.numero || null,
        });
      }
    }
  }
}

const pressTeam = (raw.imprensa || []).map((p) => ({
  nome: p.nome,
  ramal: p.ramal || null,
  area: p.area || null,
  atividades: p.atividades || null,
}));

const spokespersons = (raw.portaVozes || []).map((p) => ({
  nome: p.nome,
  area: p.area || null,
  agenda: p.agenda || null,
}));

const relationshipAgenda = (raw.agendaRelacionamento || []).map((r) => ({
  data: r.data,
  portaVoz: r.portaVoz,
  nome: r.nome,
  temaSugerido: r.temaSugerido || null,
  jornalistaVeiculo: r.jornalistaVeiculo || null,
}));

const journalismTeam = (raw.equipeJornalismo || []).map((j) => ({
  nome: j.nome,
  cargo: j.cargo,
}));

const agencyMembers = (raw.agenciaMembros || []).map((m) => ({
  nome: m.nome,
  funcao: m.funcao || null,
  cor: m.cor || null,
  atividades: JSON.stringify(m.atividades || []),
}));

const designActivities = (raw.designAtividades || []).map((d) => ({
  demandante: d.demandante || null,
  executor: d.executor || null,
  demanda: d.demanda || null,
  descricao: d.descricao || null,
  quantidade: d.quantidade || 0,
  dataInicio: d.dataInicio || null,
  dataEntrega: d.dataEntrega || null,
  usoIA: d.usoIA || null,
  linkAcesso: d.linkAcesso || null,
}));

const multimediaActivities = (raw.multimidiaAtividades || []).map((m) => ({
  demandante: m.demandante || null,
  executor: m.executor || null,
  demanda: m.demanda || null,
  formato: m.formato || null,
  fotos: m.fotos || 0,
  audioTime: m.audioTime || null,
  videoTime: m.videoTime || null,
  upload: m.upload || null,
  dataSolicitacao: m.dataSolicitacao || null,
  dataEntrega: m.dataEntrega || null,
}));

const changeLog = (raw.changeHistory || []).map((c) => ({
  description: c.description,
  collectionPath: c.collectionPath,
  deletedItem: JSON.stringify(c.deletedItem || {}),
  timestamp: c.timestamp || null,
}));

const out = {
  users,
  calendarActivities,
  newsletters,
  industryEvents,
  trips,
  vacations,
  textStats,
  textItems,
  pressTeam,
  spokespersons,
  relationshipAgenda,
  journalismTeam,
  agencyMembers,
  designActivities,
  multimediaActivities,
  changeLog,
};

const outPath = path.join(process.cwd(), "prisma", "seed-data.generated.json");
writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Gerado ${outPath}`);
console.log(
  Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length]))
);
