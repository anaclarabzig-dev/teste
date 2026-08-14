"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireImprensa() {
  const session = await auth();
  if (!canManage(session, "IMPRENSA")) {
    throw new Error("Você não tem permissão para editar dados da imprensa.");
  }
}

export async function createPressMember(formData: FormData) {
  await requireImprensa();
  const nome = String(formData.get("nome") || "").trim();
  if (!nome) return;
  await prisma.pressTeamMember.create({
    data: {
      nome,
      ramal: String(formData.get("ramal") || "") || null,
      area: String(formData.get("area") || "") || null,
      atividades: String(formData.get("atividades") || "") || null,
    },
  });
  revalidatePath("/imprensa");
}

export async function deletePressMember(formData: FormData) {
  await requireImprensa();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.pressTeamMember.delete({ where: { id } });
  revalidatePath("/imprensa");
}

export async function createSpokesperson(formData: FormData) {
  await requireImprensa();
  const nome = String(formData.get("nome") || "").trim();
  if (!nome) return;
  await prisma.spokesperson.create({
    data: {
      nome,
      area: String(formData.get("area") || "") || null,
      agenda: String(formData.get("agenda") || "") || null,
    },
  });
  revalidatePath("/imprensa");
}

export async function deleteSpokesperson(formData: FormData) {
  await requireImprensa();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.spokesperson.delete({ where: { id } });
  revalidatePath("/imprensa");
}

export async function createRelationship(formData: FormData) {
  await requireImprensa();
  const nome = String(formData.get("nome") || "").trim();
  const data = String(formData.get("data") || "");
  if (!nome || !data) return;
  await prisma.relationshipAgenda.create({
    data: {
      nome,
      data,
      portaVoz: String(formData.get("portaVoz") || ""),
      temaSugerido: String(formData.get("temaSugerido") || "") || null,
      jornalistaVeiculo: String(formData.get("jornalistaVeiculo") || "") || null,
    },
  });
  revalidatePath("/imprensa");
}

export async function deleteRelationship(formData: FormData) {
  await requireImprensa();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.relationshipAgenda.delete({ where: { id } });
  revalidatePath("/imprensa");
}
