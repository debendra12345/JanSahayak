import { NextRequest, NextResponse } from "next/server";
import { extractProfile } from "@/lib/extractProfile";
import { getDb } from "@/lib/db";
import { getOrCreateClientId } from "@/lib/clientId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const overrides = body?.overrides || {};

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Please describe yourself in a sentence or two (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const result = await extractProfile(text);

    // Apply structured field overrides (prefer structured fields over extracted values)
    if (overrides.age !== undefined) result.profile.age = overrides.age;
    if (overrides.state) result.profile.state = overrides.state;
    if (overrides.gender) result.profile.gender = overrides.gender;
    if (overrides.annualIncome !== undefined) result.profile.familyIncome = overrides.annualIncome;
    if (overrides.education) result.profile.educationLevel = overrides.education;

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
