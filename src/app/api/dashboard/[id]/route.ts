import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getOrCreateClientId } from "@/lib/clientId";
import { ApplicationStatus } from "@/lib/types";

const VALID_STATUSES: ApplicationStatus[] = ["Saved", "Applied", "Approved", "Rejected"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const status = body?.status as ApplicationStatus | undefined;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const clientId = await getOrCreateClientId();
    const db = getDb();
    const result = db
      .prepare(
        `UPDATE saved_applications SET status = ?, updated_at = datetime('now')
         WHERE id = ? AND client_id = ?`
      )
      .run(status, id, clientId);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[dashboard/[id]] failed", err);
    return NextResponse.json(
      { error: "Could not update status right now. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = await getOrCreateClientId();
    const db = getDb();
    db.prepare(`DELETE FROM saved_applications WHERE id = ? AND client_id = ?`).run(
      id,
      clientId
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[dashboard/[id]] delete failed", err);
    return NextResponse.json(
      { error: "Could not remove this item right now." },
      { status: 500 }
    );
  }
}
