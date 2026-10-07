import { NextRequest, NextResponse } from "next/server";
import { getSchemeById } from "@/lib/schemes-data";
import { evaluateEligibility } from "@/lib/eligibility";
import { explainEligibility } from "@/lib/explain";
import { UserProfile } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scheme = getSchemeById(id);
    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const profile = body?.profile as UserProfile | undefined;
    if (!profile) {
      return NextResponse.json({ error: "Missing profile in request body." }, { status: 400 });
    }

    const eligibility = evaluateEligibility(profile, scheme);
    const explanation = await explainEligibility(profile, scheme, eligibility);

    return NextResponse.json({ eligibility, explanation });
  } catch (err) {
    console.error("[schemes/[id]/explain] failed", err);
    return NextResponse.json(
      { error: "Could not generate an explanation right now. Please try again." },
      { status: 500 }
    );
  }
}
