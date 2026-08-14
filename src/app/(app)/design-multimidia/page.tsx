import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/permissions";
import DesignMultimidiaClient from "./DesignMultimidiaClient";

export default async function DesignMultimidiaPage() {
  const session = await auth();
  const [design, multimedia] = await Promise.all([
    prisma.designActivity.findMany({ orderBy: { dataEntrega: "desc" } }),
    prisma.multimediaActivity.findMany({ orderBy: { dataEntrega: "desc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Design &amp; Multimídia</h1>
        <p className="text-sm text-neutral-500">
          Demandas de design (thumbnails, artes) e multimídia (foto, áudio, vídeo).
        </p>
      </div>
      <DesignMultimidiaClient design={design} multimedia={multimedia} canEdit={canManage(session, "AGENCIA")} />
    </div>
  );
}
