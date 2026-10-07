import { NextRequest, NextResponse } from "next/server";
import { getSchemeById } from "@/lib/schemes-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scheme = getSchemeById(id);
  if (!scheme) {
    return NextResponse.json({ error: "Scheme not found." }, { status: 404 });
  }
  return NextResponse.json({ scheme });
}
