/**
 * LLMProvider abstraction layer.
 *
 * This interface allows swapping between different LLM providers without
 * changing client code. Currently supports Gemini, with OpenAI as a
 * future implementation.
 *
 * Key principle: All outputs must be grounded in verified data,
 * never invented.
 */

export interface ProfileExtractionRequest {
  text: string;
}

export interface ExplainEligibilityRequest {
  profile: Record<string, unknown>;
  scheme: Record<string, unknown>;
  eligibility: Record<string, unknown>;
}

export interface SchemeSearchRequest {
  userMessage: string;
  targetGroup?: "Student" | "Woman" | "Senior Citizen";
  state?: string;
}

export interface LLMResponse {
  text: string;
  source: "ai" | "fallback";
  model?: string;
  tokensUsed?: number;
}

export abstract class LLMProvider {
  abstract name: string;
  abstract isAvailable(): Promise<boolean>;

  abstract extractProfile(req: ProfileExtractionRequest): Promise<LLMResponse>;
  abstract explainEligibility(req: ExplainEligibilityRequest): Promise<LLMResponse>;
  abstract answerCivicQuestion(msg: string): Promise<LLMResponse>;
}

export class LLMProviderFactory {
  private static instance: LLMProvider;

  static getProvider(): LLMProvider {
    if (!LLMProviderFactory.instance) {
      const isNode = typeof window === "undefined";
      if (!isNode) {
        // Frontend: return a stub that calls the backend
        LLMProviderFactory.instance = new FrontendLLMStub();
      } else {
        // Backend: instantiate based on environment
        // Priority: GROQ > GEMINI > OPENAI > FALLBACK
        const provider = process.env.LLM_PROVIDER || "groq";
        
        if (process.env.GROQ_API_KEY && provider !== "openai" && provider !== "gemini") {
          const { GroqProvider } = require("./providers/groq");
          LLMProviderFactory.instance = new GroqProvider();
        } else if (process.env.GEMINI_API_KEY && provider !== "openai") {
          const { GeminiProvider } = require("./providers/gemini");
          LLMProviderFactory.instance = new GeminiProvider();
        } else if (process.env.OPENAI_API_KEY) {
          const { OpenAIProvider } = require("./providers/openai");
          LLMProviderFactory.instance = new OpenAIProvider();
        } else {
          // Fallback: deterministic rules-based mode (always available)
          const { FallbackLLMProvider } = require("./providers/fallback");
          LLMProviderFactory.instance = new FallbackLLMProvider();
        }
      }
    }
    return LLMProviderFactory.instance;
  }

  static setProvider(provider: LLMProvider) {
    LLMProviderFactory.instance = provider;
  }
}

/**
 * Stub for frontend usage (calls backend endpoints)
 */
class FrontendLLMStub extends LLMProvider {
  name = "Frontend Stub";

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async extractProfile(req: ProfileExtractionRequest): Promise<LLMResponse> {
    // This is called from the frontend but uses the backend API
    // Actual implementation is in the API route
    throw new Error("FrontendLLMStub.extractProfile should not be called directly");
  }

  async explainEligibility(req: ExplainEligibilityRequest): Promise<LLMResponse> {
    throw new Error("FrontendLLMStub.explainEligibility should not be called directly");
  }

  async answerCivicQuestion(msg: string): Promise<LLMResponse> {
    throw new Error("FrontendLLMStub.answerCivicQuestion should not be called directly");
  }
}
