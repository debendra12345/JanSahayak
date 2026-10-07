import { EligibilityResult, Scheme, UserProfile } from "./types";

export interface ExplanationResult {
  text: string;
  source: "ai" | "template";
}

export function buildTemplateExplanation(
  profile: UserProfile,
  scheme: Scheme,
  eligibility: EligibilityResult
): string {
  const name = profile.name ? profile.name : "You";
  const passed = eligibility.reasons.filter((r) => r.passed === true);
  const failed = eligibility.reasons.filter((r) => r.passed === false);
  const unknown = eligibility.reasons.filter((r) => r.passed === "unknown");

  const parts: string[] = [];

  if (eligibility.status === "Eligible") {
    parts.push(
      `${name} appear${profile.name ? "s" : ""} to be fully eligible for ${scheme.name}.`
    );
  } else if (eligibility.status === "Likely Eligible") {
    parts.push(
      `${name} likely qualif${profile.name ? "ies" : "y"} for ${scheme.name}, based on the details shared so far.`
    );
  } else {
    parts.push(
      `${name} ${profile.name ? "does" : "do"} not currently meet all requirements for ${scheme.name}.`
    );
  }

  if (passed.length) {
    parts.push(
      "Matched: " + passed.map((r) => r.detail).join(" ")
    );
  }
  if (failed.length) {
    parts.push("Not matched: " + failed.map((r) => r.detail).join(" "));
  }
  if (unknown.length) {
    parts.push(
      "Please confirm: " + unknown.map((r) => r.detail).join(" ")
    );
  }

  parts.push(
    `This scheme offers: ${scheme.benefit}. It is administered by ${scheme.department} and was last verified on ${scheme.lastVerified}.`
  );

  return parts.join(" ");
}

async function explainWithAI(
  profile: UserProfile,
  scheme: Scheme,
  eligibility: EligibilityResult
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "You are Janसहायक, a civic assistant explaining government scheme eligibility in simple, warm, plain language (3-5 sentences). " +
                  "You MUST only use the facts given below — never invent eligibility criteria, amounts, or deadlines. " +
                  "If some criteria are 'unknown', mention that the user should confirm those details.\n\n" +
                  `Scheme: ${scheme.name}\n` +
                  `Benefit: ${scheme.benefit}\n` +
                  `Department: ${scheme.department}\n` +
                  `Eligibility status: ${eligibility.status}\n` +
                  `Reasoning: ${JSON.stringify(eligibility.reasons)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
        },
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return content ?? null;
  } catch {
    return null;
  }
}

export async function explainEligibility(
  profile: UserProfile,
  scheme: Scheme,
  eligibility: EligibilityResult
): Promise<ExplanationResult> {
  const ai = await explainWithAI(profile, scheme, eligibility);
  if (ai) return { text: ai, source: "ai" };
  return {
    text: buildTemplateExplanation(profile, scheme, eligibility),
    source: "template",
  };
}
