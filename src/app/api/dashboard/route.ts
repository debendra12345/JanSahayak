import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getOrCreateClientId } from "@/lib/clientId";
import { getSchemeById } from "@/lib/schemes-data";
import { UserProfile } from "@/lib/types";

export async function GET() {
  try {
    const clientId = await getOrCreateClientId();
    const db = getDb();

    const rows = db
      .prepare(
        `SELECT id, scheme_id as schemeId, status, created_at as createdAt, updated_at as updatedAt
         FROM saved_applications WHERE client_id = ? ORDER BY created_at DESC`
      )
      .all(clientId) as {
      id: string;
      schemeId: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }[];

    const applications = rows
      .map((r) => {
        const scheme = getSchemeById(r.schemeId);
        return scheme ? { ...r, scheme } : null;
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);

    const profileRow = db
      .prepare(`SELECT profile_json as profileJson FROM profiles WHERE client_id = ?`)
      .get(clientId) as { profileJson: string } | undefined;

    const profile: UserProfile | null = profileRow
      ? JSON.parse(profileRow.profileJson)
      : null;

    return NextResponse.json({ applications, profile });
  } catch (err) {
    console.error("[dashboard] failed", err);
    return NextResponse.json(
      { error: "Could not load your dashboard right now. Please try again." },
      { status: 500 }
    );
  }
}
