/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */
import { getAPIKey, getBaseURL } from '~/lib/.server/llm/api-key';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ollama } from 'ollama-ai-provider';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createMistral } from '@ai-sdk/mistral';
import { createCohere } from '@ai-sdk/cohere';
import type { LanguageModelV1 } from 'ai';

export const DEFAULT_NUM_CTX = process.env.DEFAULT_NUM_CTX ? parseInt(process.env.DEFAULT_NUM_CTX, 10) : 32768;

type OptionalApiKey = string | undefined;

// ============================================================================
// 1. PROVEDORES NATIVOS (Usando SDKs Oficiais da Vercel AI)
// ============================================================================

export function getAnthropicModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'claude-3-7-sonnet-20250219', 'claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest'
  const anthropic = createAnthropic({ apiKey });
  return anthropic(model);
}

export function getOpenAIModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'o1', 'o3-mini', 'gpt-4o', 'gpt-4o-mini'
  const openai = createOpenAI({ apiKey });
  return openai(model);
}

export function getGoogleModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'gemini-2.0-flash', 'gemini-2.0-flash-thinking-exp', 'gemini-1.5-pro-latest'
  const google = createGoogleGenerativeAI({ apiKey });
  return google(model, { structuredOutputs: true });
}

export function getMistralModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'mistral-large-latest', 'pixtral-large-latest', 'mistral-small-latest'
  const mistral = createMistral({ apiKey });
  return mistral(model);
}

export function getCohereAIModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'command-r-plus-08-2024', 'command-r-08-2024'
  const cohere = createCohere({ apiKey });
  return cohere(model);
}

// ============================================================================
// 2. PROVEDORES COMPATÍVEIS COM OPENAI (Custom baseURLs)
// ============================================================================

export function getDeepseekModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'deepseek-chat' (V3), 'deepseek-reasoner' (R1)
  const deepseek = createOpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey,
  });
  return deepseek(model);
}

export function getXAIModel(apiKey: OptionalApiKey, model: string) {
  // Modelos de referência: 'grok-3', 'grok-3-thinking', 'grok-2-latest'
  const xai = createOpenAI({
    baseURL: 'https://api.x.ai/v1',
    apiKey,
  });
  return xai(model);
}

export function getGroqModel(apiKey: OptionalApiKey, model: string) {
  // Focado em velocidade: Llama 3.3 70B, Mixtral 8x7B, etc.
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey,
  });
  return groq(model);
}

export function getTogetherAIModel(apiKey: OptionalApiKey, model: string) {
  // Agregador robusto para Open Source: Llama 3.1 405B, Qwen 2.5 72B
  const together = createOpenAI({
    baseURL: 'https://api.together.xyz/v1',
    apiKey,
  });
  return together(model);
}

export function getPerplexityModel(apiKey: OptionalApiKey, model: string) {
  // Focado em Search/Reasoning: 'sonar-reasoning-pro', 'sonar-pro'
  const perplexity = createOpenAI({
    baseURL: 'https://api.perplexity.ai',
    apiKey,
  });
  return perplexity(model);
}

export function getHuggingFaceModel(apiKey: OptionalApiKey, model: string) {
  const hf = createOpenAI({
    baseURL: 'https://api-inference.huggingface.co/v1/',
    apiKey,
  });
  return hf(model);
}

export function getOpenAILikeModel(baseURL: string, apiKey: OptionalApiKey, model: string) {
  // Para servidores genéricos compatíveis com API da OpenAI
  const custom = createOpenAI({ baseURL, apiKey });
  return custom(model);
}

// ============================================================================
// 3. LOCAIS E AGREGADORES EXTERNOS
// ============================================================================

export function getOpenRouterModel(apiKey: OptionalApiKey, model: string) {
  // Acesso universal a virtualmente qualquer modelo comercial ou open-source
  const openRouter = createOpenRouter({ apiKey });
  return openRouter.chat(model);
}

export function getLMStudioModel(baseURL: string, model: string) {
  const lmstudio = createOpenAI({
    baseURL: `${baseURL}/v1`,
    apiKey: 'not-needed',
  });
  return lmstudio(model);
}

export function getOllamaModel(baseURL: string, model: string) {
  // Adaptado para a interface moderna do provider oficial Ollama
  return ollama(model, {
    config: { baseURL: `${baseURL}/api` },
    numCtx: DEFAULT_NUM_CTX,
  });
}

// ============================================================================
// SELETOR PRINCIPAL (Entrypoint)
// ============================================================================

export function getModel(provider: string, model: string, env: Env, apiKeys?: Record<string, string>) {
  const apiKey = getAPIKey(env, provider, apiKeys);
  const baseURL = getBaseURL(env, provider);

  switch (provider) {
    case 'Anthropic':
      return getAnthropicModel(apiKey, model);
    case 'OpenAI':
      return getOpenAIModel(apiKey, model);
    case 'Google':
      return getGoogleModel(apiKey, model);
    case 'Deepseek':
      return getDeepseekModel(apiKey, model);
    case 'xAI':
      return getXAIModel(apiKey, model);
    case 'Groq':
      return getGroqModel(apiKey, model);
    case 'Together':
      return getTogetherAIModel(apiKey, model);
    case 'Perplexity':
      return getPerplexityModel(apiKey, model);
    case 'Mistral':
      return getMistralModel(apiKey, model);
    case 'Cohere':
      return getCohereAIModel(apiKey, model);
    case 'HuggingFace':
      return getHuggingFaceModel(apiKey, model);
    case 'OpenRouter':
      return getOpenRouterModel(apiKey, model);
    case 'LMStudio':
      return getLMStudioModel(baseURL, model);
    case 'OpenAILike':
      return getOpenAILikeModel(baseURL, apiKey, model);
    default:
      return getOllamaModel(baseURL, model);
  }
}
