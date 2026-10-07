import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { getOrCreateClientId } from "@/lib/clientId";
import { getSchemeById } from "@/lib/schemes-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const schemeId = body?.schemeId as string | undefined;
    if (!schemeId || !getSchemeById(schemeId)) {
      return NextResponse.json({ error: "Unknown scheme." }, { status: 400 });
    }

    const clientId = await getOrCreateClientId();
    const db = getDb();

    const existing = db
      .prepare(`SELECT id FROM saved_applications WHERE client_id = ? AND scheme_id = ?`)
      .get(clientId, schemeId) as { id: string } | undefined;

    if (existing) {
      return NextResponse.json({ id: existing.id, alreadySaved: true });
    }

    const id = randomUUID();
    db.prepare(
      `INSERT INTO saved_applications (id, client_id, scheme_id, status, created_at, updated_at)
       VALUES (?, ?, ?, 'Saved', datetime('now'), datetime('now'))`
    ).run(id, clientId, schemeId);

    return NextResponse.json({ id, alreadySaved: false });
  } catch (err) {
    console.error("[dashboard/save] failed", err);
    return NextResponse.json(
      { error: "Could not save this scheme right now. Please try again." },
      { status: 500 }
    );
  }
}
