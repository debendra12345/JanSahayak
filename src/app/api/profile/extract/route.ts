import { NextRequest, NextResponse } from "next/server";
import { extractProfile } from "@/lib/extractProfile";
import { getDb } from "@/lib/db";
import { getOrCreateClientId } from "@/lib/clientId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Please describe yourself in a sentence or two (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const result = await extractProfile(text);

    try {
      const clientId = await getOrCreateClientId();
      const db = getDb();
      db.prepare(
        `INSERT INTO profiles (client_id, profile_json, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(client_id) DO UPDATE SET profile_json = excluded.profile_json, updated_at = excluded.updated_at`
      ).run(clientId, JSON.stringify(result.profile));
    } catch {
      // Persisting the profile is a nice-to-have; never fail the request over it.
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[profile/extract] failed", err);
    return NextResponse.json(
      { error: "Could not process that profile right now. Please try again." },
      { status: 500 }
    );
  }
}
