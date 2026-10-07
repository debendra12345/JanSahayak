/**
 * Gemini API LLM Provider.
 *
 * Uses Google Gemini API for:
 * - Profile extraction
 * - Eligibility explanations
 * - Civic question answering
 *
 * All responses must cite verified scheme data.
 */

import { LLMProvider, LLMResponse } from "../llmProvider";

export class GeminiProvider extends LLMProvider {
  name = "Gemini (Google AI)";
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY || "";
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.log("GEMINI_API_KEY not set, falling back to demo mode");
      return false;
    }
    return true;
  }

  async extractProfile(req: {
    text: string;
  }): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        signal: controller.signal as any,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Extract a structured profile from this free-text description for matching to Indian government welfare schemes. " +
                    "Return ONLY JSON with keys: age (number|null), gender ('Male'|'Female'|null), " +
                    "state (Indian state name|null), category ('General'|'OBC'|'SC'|'ST'|'EWS'|null), " +
                    "familyIncome (annual INR number|null), educationLevel ('School'|'Diploma'|'Undergraduate'|'Postgraduate'|null), " +
                    "occupation (string|null), disability (boolean|null), name (string|null). " +
                    "Do not invent values.\n\n" +
                    req.text,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
          },
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.statusText}`);
      }

      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) throw new Error("No response from Gemini");

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!parsed) throw new Error("Could not parse Gemini response as JSON");

      return {
        text: JSON.stringify(parsed),
        source: "ai",
        model: "Gemini 1.5 Flash",
      };
    } catch (err) {
      console.error("Gemini profile extraction failed:", err);
      throw err;
    }
  }

  async explainEligibility(req: {
    profile: Record<string, unknown>;
    scheme: Record<string, unknown>;
    eligibility: Record<string, unknown>;
  }): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          signal: controller.signal as any,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      "You are Janसहायक, a civic assistant explaining government scheme eligibility in 2-3 sentences, plain language. " +
                      "MUST only use facts given below. Never invent eligibility rules.\n\n" +
                      `Scheme: ${req.scheme?.name || "Unknown"}\n` +
                      `Eligibility Status: ${req.eligibility?.status || "Unknown"}\n` +
                      `Rules Met: ${JSON.stringify(req.eligibility?.reasons || [])}\n` +
                      `Explain simply whether this scheme likely applies to this person.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 300,
            },
          }),
        }
      );
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.statusText}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response from Gemini");

      return {
        text,
        source: "ai",
        model: "Gemini 1.5 Flash",
      };
    } catch (err) {
      console.error("Gemini explanation failed:", err);
      throw err;
    }
  }

  async answerCivicQuestion(msg: string): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          signal: controller.signal as any,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      "You are Janसहायक, an Indian civic information assistant. " +
                      "Provide helpful information about government schemes, benefits, and civic services. " +
                      "Be clear, honest, and cite official sources when known.\n\n" +
                      msg,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 500,
            },
          }),
        }
      );
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.statusText}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response from Gemini");

      return {
        text,
        source: "ai",
        model: "Gemini 1.5 Flash",
      };
    } catch (err) {
      console.error("Gemini civic question failed:", err);
      throw err;
    }
  }
}
