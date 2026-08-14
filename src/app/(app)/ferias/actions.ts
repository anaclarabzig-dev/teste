"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage, Setor } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createFerias(formData: FormData) {
  const session = await auth();
  const setor = String(formData.get("setor") || "") as Setor;
  if (!canManage(session, setor)) {
    throw new Error("Você não tem permissão para cadastrar férias deste setor.");
  }
  const nome = String(formData.get("nome") || "").trim();
  const dataInicio = String(formData.get("dataInicio") || "");
  const dataFim = String(formData.get("dataFim") || "");
  if (!nome || !dataInicio || !dataFim) return;
  await prisma.vacation.create({ data: { nome, setor, dataInicio, dataFim } });
  revalidatePath("/ferias");
  revalidatePath("/");
}

export async function deleteFerias(formData: FormData) {
  const session = await auth();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const record = await prisma.vacation.findUnique({ where: { id } });
  if (!record) return;
  if (!canManage(session, record.setor as Setor)) {
    throw new Error("Você não tem permissão para remover estas férias.");
  }
  await prisma.vacation.delete({ where: { id } });
  revalidatePath("/ferias");
  revalidatePath("/");
}
