"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireAgencia() {
  const session = await auth();
  if (!canManage(session, "AGENCIA")) {
    throw new Error("Você não tem permissão para editar design/multimídia.");
  }
}

export async function createDesign(formData: FormData) {
  await requireAgencia();
  const demanda = String(formData.get("demanda") || "").trim();
  if (!demanda) return;
  await prisma.designActivity.create({
    data: {
      demandante: String(formData.get("demandante") || "") || null,
      executor: String(formData.get("executor") || "") || null,
      demanda,
      descricao: String(formData.get("descricao") || "") || null,
      quantidade: Number(formData.get("quantidade") || 0),
      dataInicio: String(formData.get("dataInicio") || "") || null,
      dataEntrega: String(formData.get("dataEntrega") || "") || null,
      usoIA: String(formData.get("usoIA") || "") || null,
      linkAcesso: String(formData.get("linkAcesso") || "") || null,
    },
  });
  revalidatePath("/design-multimidia");
}

export async function deleteDesign(formData: FormData) {
  await requireAgencia();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.designActivity.delete({ where: { id } });
  revalidatePath("/design-multimidia");
}

export async function createMultimedia(formData: FormData) {
  await requireAgencia();
  const demanda = String(formData.get("demanda") || "").trim();
  if (!demanda) return;
  await prisma.multimediaActivity.create({
    data: {
      demandante: String(formData.get("demandante") || "") || null,
      executor: String(formData.get("executor") || "") || null,
      demanda,
      formato: String(formData.get("formato") || "") || null,
      fotos: Number(formData.get("fotos") || 0),
      audioTime: String(formData.get("audioTime") || "") || null,
      videoTime: String(formData.get("videoTime") || "") || null,
      upload: String(formData.get("upload") || "") || null,
      dataSolicitacao: String(formData.get("dataSolicitacao") || "") || null,
      dataEntrega: String(formData.get("dataEntrega") || "") || null,
    },
  });
  revalidatePath("/design-multimidia");
}

export async function deleteMultimedia(formData: FormData) {
  await requireAgencia();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.multimediaActivity.delete({ where: { id } });
  revalidatePath("/design-multimidia");
}
