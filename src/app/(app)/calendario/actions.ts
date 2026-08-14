"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireAgencia() {
  const session = await auth();
  if (!canManage(session, "AGENCIA")) {
    throw new Error("Você não tem permissão para editar o calendário da agência.");
  }
}

export async function createAtividade(formData: FormData) {
  await requireAgencia();
  const nome = String(formData.get("nome") || "").trim();
  const data = String(formData.get("data") || "");
  if (!nome || !data) return;
  await prisma.calendarActivity.create({
    data: {
      nome,
      data,
      hora: String(formData.get("hora") || "") || null,
      categoria: String(formData.get("categoria") || "outro"),
      aDefinir: formData.get("aDefinir") === "on",
      isNews: formData.get("isNews") === "on",
    },
  });
  revalidatePath("/calendario");
  revalidatePath("/");
}

export async function deleteAtividade(formData: FormData) {
  await requireAgencia();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.calendarActivity.delete({ where: { id } });
  revalidatePath("/calendario");
  revalidatePath("/");
}

export async function createNewsletter(formData: FormData) {
  await requireAgencia();
  const data = String(formData.get("data") || "");
  const responsavel = String(formData.get("responsavel") || "").trim();
  if (!data || !responsavel) return;
  await prisma.newsletter.upsert({
    where: { data },
    update: { responsavel },
    create: { data, responsavel },
  });
  revalidatePath("/calendario");
}

export async function deleteNewsletter(formData: FormData) {
  await requireAgencia();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.newsletter.delete({ where: { id } });
  revalidatePath("/calendario");
}

export async function createEvento(formData: FormData) {
  await requireAgencia();
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return;
  await prisma.industryEvent.create({
    data: {
      titulo,
      periodo: String(formData.get("periodo") || "") || null,
      mes: String(formData.get("mes") || "") || null,
      descricao: String(formData.get("descricao") || "") || null,
    },
  });
  revalidatePath("/calendario");
}

export async function deleteEvento(formData: FormData) {
  await requireAgencia();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.industryEvent.delete({ where: { id } });
  revalidatePath("/calendario");
}

export async function createViagem(formData: FormData) {
  await requireAgencia();
  const evento = String(formData.get("evento") || "").trim();
  const nome = String(formData.get("nome") || "").trim();
  const local = String(formData.get("local") || "").trim();
  const dataInicio = String(formData.get("dataInicio") || "");
  const dataFim = String(formData.get("dataFim") || "");
  if (!evento || !nome || !dataInicio || !dataFim) return;
  await prisma.trip.create({
    data: { evento, nome, local, dataInicio, dataFim },
  });
  revalidatePath("/calendario");
}

export async function deleteViagem(formData: FormData) {
  await requireAgencia();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.trip.delete({ where: { id } });
  revalidatePath("/calendario");
}
