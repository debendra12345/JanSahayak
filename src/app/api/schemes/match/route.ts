import { NextRequest, NextResponse } from "next/server";
import { matchSchemes } from "@/lib/eligibility";
import { SCHEMES, getSchemeById } from "@/lib/schemes-data";
import { MatchedScheme, UserProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const profile = body?.profile as UserProfile | undefined;

    if (!profile) {
      return NextResponse.json({ error: "Missing profile in request body." }, { status: 400 });
    }

    const results = matchSchemes(profile, SCHEMES);
    const matched: MatchedScheme[] = results
      .map((eligibility) => {
        const scheme = getSchemeById(eligibility.schemeId);
        return scheme ? { scheme, eligibility } : null;
      })
      .filter((m): m is MatchedScheme => m !== null);

    return NextResponse.json({ matches: matched });
  } catch (err) {
    console.error("[schemes/match] failed", err);
    return NextResponse.json(
      { error: "Could not match schemes right now. Please try again." },
      { status: 500 }
    );
  }
}
