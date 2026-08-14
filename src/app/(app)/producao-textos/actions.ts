"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireImprensa() {
  const session = await auth();
  if (!canManage(session, "IMPRENSA")) {
    throw new Error("Você não tem permissão para editar a produção de textos.");
  }
}

export async function updateStat(formData: FormData) {
  await requireImprensa();
  const mes = String(formData.get("mes") || "");
  const categoria = String(formData.get("categoria") || "");
  const org = String(formData.get("org") || "");
  const quantidade = Number(formData.get("quantidade") || 0);
  const tema = String(formData.get("tema") || "");
  if (!mes || !categoria || !org) return;
  await prisma.textProductionStat.upsert({
    where: { mes_categoria_org: { mes, categoria, org } },
    update: { quantidade, tema },
    create: { mes, categoria, org, quantidade, tema },
  });
  revalidatePath("/producao-textos");
  revalidatePath("/");
}

export async function createItem(formData: FormData) {
  await requireImprensa();
  const mes = String(formData.get("mes") || "");
  const categoria = String(formData.get("categoria") || "");
  const org = String(formData.get("org") || "");
  const assunto = String(formData.get("assunto") || "").trim();
  const numero = String(formData.get("numero") || "") || null;
  if (!mes || !categoria || !org || !assunto) return;
  await prisma.textProductionItem.create({ data: { mes, categoria, org, assunto, numero } });
  revalidatePath("/producao-textos");
}

export async function deleteItem(formData: FormData) {
  await requireImprensa();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.textProductionItem.delete({ where: { id } });
  revalidatePath("/producao-textos");
}
