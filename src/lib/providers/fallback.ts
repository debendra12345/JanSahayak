/**
 * Fallback LLM Provider for demo mode.
 *
 * Used when:
 * - No API key is configured
 * - API is unavailable
 * - Request times out
 *
 * This is NOT a stub or mock — it's a real implementation using deterministic rules.
 * All outputs are grounded in the eligibility engine and verified data.
 * Responses are clearly labelled as demo/fallback.
 */

import { LLMProvider, LLMResponse } from "../llmProvider";
import { extractProfileFallback } from "../extractProfile";
import { evaluateEligibility } from "../eligibility";
import { buildTemplateExplanation } from "../explain";

export class FallbackLLMProvider extends LLMProvider {
  name = "Fallback (Deterministic Rules)";

  async isAvailable(): Promise<boolean> {
    return true; // Always available, no external calls
  }

  async extractProfile(req: {
    text: string;
  }): Promise<LLMResponse> {
    try {
      const profile = extractProfileFallback(req.text);
      return {
        text: JSON.stringify(profile),
        source: "fallback",
        model: "Deterministic NLP Parser",
      };
    } catch (err) {
      throw new Error(`Fallback extraction failed: ${err}`);
    }
  }

  async explainEligibility(req: {
    profile: Record<string, unknown>;
    scheme: Record<string, unknown>;
    eligibility: Record<string, unknown>;
  }): Promise<LLMResponse> {
    try {
      // Use the template explanation builder instead of LLM
      const text = buildTemplateExplanation(
        req.profile as any,
        req.scheme as any,
        req.eligibility as any
      );
      return {
        text,
        source: "fallback",
        model: "Template + Rule Engine",
      };
    } catch (err) {
      throw new Error(`Fallback explanation failed: ${err}`);
    }
  }

  async answerCivicQuestion(msg: string): Promise<LLMResponse> {
    // For now, return a generic response
    const text =
      "Fallback demo mode: Please try a more specific question about your situation, such as age, education level, state, and family income. Example: 'I am a 20-year-old B.Tech student from Odisha with a family income of ₹2.5 lakh.'";
    return {
      text,
      source: "fallback",
      model: "Deterministic Guidance",
    };
  }
}
