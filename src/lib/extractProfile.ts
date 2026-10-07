import { Category, EducationLevel, Gender, ProfileExtractionResult, UserProfile } from "./types";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

/**
 * Deterministic, fully offline extraction used whenever no LLM key is
 * configured or the LLM call fails/times out. This is real parsing logic
 * (not a stub) so the demo never silently breaks.
 */
export function extractProfileFallback(text: string): UserProfile {
  const t = text.toLowerCase();
  const profile: UserProfile = { rawText: text };

  // Age: "19 year old", "19 years", "age 19", "19yo"
  const ageMatch =
    t.match(/(\d{1,2})\s*[- ]?\s*(?:years?|yrs?|yo)\b/) ||
    t.match(/age\s*[:\-]?\s*(\d{1,2})/);
  if (ageMatch) profile.age = parseInt(ageMatch[1], 10);

  // Gender
  if (/\b(female|girl|woman|she|her)\b/.test(t)) profile.gender = "Female";
  else if (/\b(male|boy|man|he\b|his\b)\b/.test(t)) profile.gender = "Male";

  // State
  const foundState = INDIAN_STATES.find((s) => t.includes(s.toLowerCase()));
  if (foundState) profile.state = foundState;

  // Category
  if (/\bsc\b|scheduled caste/.test(t)) profile.category = "SC";
  else if (/\bst\b|scheduled tribe/.test(t)) profile.category = "ST";
  else if (/\bobc\b|other backward/.test(t)) profile.category = "OBC";
  else if (/\bews\b|economically weaker/.test(t)) profile.category = "EWS";
  else if (/general category|\bgeneral\b/.test(t)) profile.category = "General";

  // Family income - supports lakh/thousand/plain numbers
  const lakhMatch = t.match(/(\d+(?:\.\d+)?)\s*lakh/);
  const thousandMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:k\b|thousand)/);
  const plainIncomeMatch = t.match(
    /(?:income|earns?|salary)[^\d₹]{0,15}(?:₹|rs\.?|inr)?\s*(\d[\d,]{3,})/
  );
  if (lakhMatch) {
    profile.familyIncome = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (thousandMatch) {
    profile.familyIncome = Math.round(parseFloat(thousandMatch[1]) * 1000);
  } else if (plainIncomeMatch) {
    profile.familyIncome = parseInt(plainIncomeMatch[1].replace(/,/g, ""), 10);
  }

  // Education level
  if (/\bpg\b|post[- ]?graduat|master'?s|m\.?tech|m\.?a\b|m\.?sc\b/.test(t)) {
    profile.educationLevel = "Postgraduate";
  } else if (/\bug\b|undergraduat|bachelor|b\.?tech|b\.?a\b|b\.?sc\b|college/.test(t)) {
    profile.educationLevel = "Undergraduate";
  } else if (/diploma|polytechnic/.test(t)) {
    profile.educationLevel = "Diploma";
  } else if (/class\s*(1[0-2]|[6-9])|school|10th|12th/.test(t)) {
    profile.educationLevel = "School";
  }

  // Occupation
  if (/student|studying|pursuing/.test(t)) profile.occupation = "student";
  else if (/unemployed/.test(t)) profile.occupation = "unemployed";
  else if (/farmer/.test(t)) profile.occupation = "farmer";

  // Disability
  if (/disab|differently[- ]?abled|pwd\b|handicap/.test(t)) {
    profile.disability = true;
  }

  // Name (very light heuristic: "I am <Name>," / "my name is <Name>")
  const nameMatch =
    text.match(/my name is ([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)?)/) ||
    text.match(/I(?:'m| am) ([A-Z][a-zA-Z]+)(?:,| a | an |\s)/);
  if (nameMatch) profile.name = nameMatch[1];

  return profile;
}

const REQUIRED_FIELDS: (keyof UserProfile)[] = [
  "age",
  "gender",
  "state",
  "category",
  "familyIncome",
  "educationLevel",
  "occupation",
];

function missingFields(profile: UserProfile): string[] {
  return REQUIRED_FIELDS.filter((f) => profile[f] === undefined).map(String);
}

async function extractProfileWithAI(text: string): Promise<UserProfile | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Extract a structured profile from the user's free-text description for an Indian government welfare-scheme matcher. " +
              "Return ONLY strict JSON with keys: name (string|null), age (number|null), gender ('Male'|'Female'|null), " +
              "state (Indian state name|null), category ('General'|'OBC'|'SC'|'ST'|'EWS'|null), " +
              "familyIncome (annual INR number|null), educationLevel ('School'|'Diploma'|'Undergraduate'|'Postgraduate'|null), " +
              "occupation (string|null), disability (boolean|null). Do not invent values that are not stated or clearly implied.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    const profile: UserProfile = { rawText: text };
    if (parsed.name) profile.name = parsed.name;
    if (typeof parsed.age === "number") profile.age = parsed.age;
    if (parsed.gender === "Male" || parsed.gender === "Female")
      profile.gender = parsed.gender as Gender;
    if (parsed.state) profile.state = parsed.state;
    if (["General", "OBC", "SC", "ST", "EWS"].includes(parsed.category))
      profile.category = parsed.category as Category;
    if (typeof parsed.familyIncome === "number")
      profile.familyIncome = parsed.familyIncome;
    if (
      ["School", "Diploma", "Undergraduate", "Postgraduate"].includes(
        parsed.educationLevel
      )
    )
      profile.educationLevel = parsed.educationLevel as EducationLevel;
    if (parsed.occupation) profile.occupation = parsed.occupation;
    if (typeof parsed.disability === "boolean") profile.disability = parsed.disability;

    return profile;
  } catch {
    return null;
  }
}

export async function extractProfile(text: string): Promise<ProfileExtractionResult> {
  const ai = await extractProfileWithAI(text);
  if (ai) {
    return { profile: ai, source: "ai", missingFields: missingFields(ai) };
  }
  const fallback = extractProfileFallback(text);
  return {
    profile: fallback,
    source: "fallback",
    missingFields: missingFields(fallback),
  };
}
