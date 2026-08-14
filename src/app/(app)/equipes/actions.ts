"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!isAdmin(session)) throw new Error("Apenas administradores podem editar as equipes.");
}

export async function createAgencyMember(formData: FormData) {
  await requireAdmin();
  const nome = String(formData.get("nome") || "").trim();
  if (!nome) return;
  const atividadesRaw = String(formData.get("atividades") || "");
  const atividades = atividadesRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  await prisma.agencyMember.create({
    data: {
      nome,
      funcao: String(formData.get("funcao") || "") || null,
      cor: null,
      atividades: JSON.stringify(atividades),
    },
  });
  revalidatePath("/equipes");
}

export async function deleteAgencyMember(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.agencyMember.delete({ where: { id } });
  revalidatePath("/equipes");
}

export async function createJournalismMember(formData: FormData) {
  await requireAdmin();
  const nome = String(formData.get("nome") || "").trim();
  const cargo = String(formData.get("cargo") || "").trim();
  if (!nome || !cargo) return;
  await prisma.journalismTeamMember.create({ data: { nome, cargo } });
  revalidatePath("/equipes");
}

export async function deleteJournalismMember(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.journalismTeamMember.delete({ where: { id } });
  revalidatePath("/equipes");
}
