/**
 * Groq API LLM Provider.
 *
 * Uses Groq's API for fast LLM inference:
 * - Profile extraction
 * - Eligibility explanations
 * - Civic question answering
 *
 * Groq is recommended for hackathon demos due to speed.
 * All responses must cite verified scheme data.
 */

import { LLMProvider, LLMResponse } from "../llmProvider";

export class GroqProvider extends LLMProvider {
  name = "Groq (Fast Inference)";
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = process.env.GROQ_API_KEY || "";
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.log("GROQ_API_KEY not set, falling back to demo mode");
      return false;
    }
    
    // Try a quick test call to verify the API key works
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal as any,
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          temperature: 0.1,
          max_tokens: 10,
          messages: [{ role: "user", content: "ok" }],
        }),
      });
      clearTimeout(timeout);
      
      if (res.ok) {
        console.log("✓ Groq API is available and responding");
        return true;
      } else {
        console.warn(`Groq API returned ${res.status}, falling back to demo mode`);
        return false;
      }
    } catch (err) {
      console.warn("Groq API unavailable, falling back to demo mode:", (err as Error).message);
      return false;
    }
  }

  async extractProfile(req: {
    text: string;
  }): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Groq API key not configured");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal as any,
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          temperature: 0.2,
          max_tokens: 500,
          messages: [
            {
              role: "system",
              content:
                "Extract a structured profile from free-text description for matching to Indian government welfare schemes. " +
                "Return ONLY valid JSON with keys: age (number|null), gender ('Male'|'Female'|null), " +
                "state (Indian state name|null), category ('General'|'OBC'|'SC'|'ST'|'EWS'|null), " +
                "familyIncome (annual INR number|null), educationLevel ('School'|'Diploma'|'Undergraduate'|'Postgraduate'|null), " +
                "occupation (string|null), disability (boolean|null), name (string|null). " +
                "Do not invent values. Return empty/null for unknown fields.",
            },
            {
              role: "user",
              content: req.text,
            },
          ],
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.statusText}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("No response from Groq");

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!parsed) throw new Error("Could not parse Groq response as JSON");

      return {
        text: JSON.stringify(parsed),
        source: "ai",
        model: "Groq Mixtral 8x7B",
      };
    } catch (err) {
      console.error("Groq profile extraction failed:", err);
      throw err;
    }
  }

  async explainEligibility(req: {
    profile: Record<string, unknown>;
    scheme: Record<string, unknown>;
    eligibility: Record<string, unknown>;
  }): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Groq API key not configured");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          signal: controller.signal as any,
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            temperature: 0.3,
            max_tokens: 300,
            messages: [
              {
                role: "system",
                content:
                  "You are Janसहायक, a civic assistant explaining government scheme eligibility in 2-3 sentences, plain language. " +
                  "MUST only use facts given. Never invent eligibility rules, amounts, or deadlines. " +
                  "If information is unknown, say so.",
              },
              {
                role: "user",
                content:
                  `Scheme: ${req.scheme?.name || "Unknown"}\n` +
                  `Status: ${req.eligibility?.status || "Unknown"}\n` +
                  `Rules: ${JSON.stringify(req.eligibility?.reasons || [])}\n\n` +
                  `Explain plainly whether this scheme likely applies.`,
              },
            ],
          }),
        }
      );
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.statusText}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error("No response from Groq");

      return {
        text,
        source: "ai",
        model: "Groq Mixtral 8x7B",
      };
    } catch (err) {
      console.error("Groq explanation failed:", err);
      throw err;
    }
  }

  async answerCivicQuestion(msg: string): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error("Groq API key not configured");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          signal: controller.signal as any,
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            temperature: 0.4,
            max_tokens: 500,
            messages: [
              {
                role: "system",
                content:
                  "You are Janसहायक, an Indian civic information assistant. " +
                  "Provide helpful information about government schemes, benefits, and civic services in India. " +
                  "Be clear, honest, and cite official sources when known. " +
                  "Encourage users to verify final eligibility on official government portals.",
              },
              {
                role: "user",
                content: msg,
              },
            ],
          }),
        }
      );
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.statusText}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error("No response from Groq");

      return {
        text,
        source: "ai",
        model: "Groq Mixtral 8x7B",
      };
    } catch (err) {
      console.error("Groq civic question failed:", err);
      throw err;
    }
  }
}
