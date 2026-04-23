/*
 * @ts-nocheck
 */
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ollama } from 'ollama-ai-provider';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createMistral } from '@ai-sdk/mistral';
import { createCohere } from '@ai-sdk/cohere';

// Configuração de Contexto Padrão
export const DEFAULT_NUM_CTX = 32768;

// --- Funções de Inicialização de Modelos ---

const getAnthropic = (apiKey: string, model: string) => createAnthropic({ apiKey })(model);

const getOpenAI = (apiKey: string, model: string, baseURL?: string) => 
  createOpenAI({ apiKey, baseURL: baseURL || 'https://api.openai.com/v1' })(model);

const getGoogle = (apiKey: string, model: string) => 
  createGoogleGenerativeAI({ apiKey })(model, { structuredOutputs: true });

const getMistral = (apiKey: string, model: string) => createMistral({ apiKey })(model);

const getCohere = (apiKey: string, model: string) => createCohere({ apiKey })(model);

const getOpenRouter = (apiKey: string, model: string) => createOpenRouter({ apiKey }).chat(model);

const getOllama = (model: string, baseURL: string = 'http://localhost:11434') => 
  ollama(model, { config: { baseURL: `${baseURL}/api` }, numCtx: DEFAULT_NUM_CTX });

// --- Seletor de Modelo Baseado na Chave e Provedor ---

/**
 * @param provider Nome do provedor (ex: 'OpenAI', 'Anthropic', 'Google')
 * @param model ID do modelo (ex: 'gpt-4o', 'claude-3-7-sonnet', 'gemini-2.0-flash')
 * @param apiKey A chave API direta
 * @param baseURL URL opcional para provedores locais ou compatíveis
 */
export function getModel(provider: string, model: string, apiKey: string, baseURL?: string) {
  
  // Normalização para evitar erros de case
  const p = provider.toLowerCase();

  switch (p) {
    case 'anthropic':
      return getAnthropic(apiKey, model);
    
    case 'openai':
      return getOpenAI(apiKey, model);

    case 'google':
      return getGoogle(apiKey, model);

    case 'deepseek':
      // DeepSeek V3 e R1
      return getOpenAI(apiKey, model, 'https://api.deepseek.com');

    case 'xai':
      // Grok 3 e Grok 2
      return getOpenAI(apiKey, model, 'https://api.x.ai/v1');

    case 'groq':
      return getOpenAI(apiKey, model, 'https://api.groq.com/openai/v1');

    case 'together':
      return getOpenAI(apiKey, model, 'https://api.together.xyz/v1');

    case 'perplexity':
      return getOpenAI(apiKey, model, 'https://api.perplexity.ai');

    case 'mistral':
      return getMistral(apiKey, model);

    case 'cohere':
      return getCohere(apiKey, model);

    case 'openrouter':
      return getOpenRouter(apiKey, model);

    case 'lmstudio':
      return getOpenAI('not-needed', model, `${baseURL || 'http://localhost:1234'}/v1`);

    case 'ollama':
      return getOllama(model, baseURL);

    case 'openailike':
      return getOpenAI(apiKey, model, baseURL);

    default:
      // Fallback para OpenAI se o provedor for desconhecido mas houver uma chave
      return getOpenAI(apiKey, model, baseURL);
  }
}

/**
 * LISTA DE MODELOS RECENTES (Referência para uso):
 * * OpenAI: 'o1', 'o3-mini', 'gpt-4o', 'gpt-4o-mini'
 * Anthropic: 'claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-latest', 'claude-3-5-haiku-20241022'
 * Google: 'gemini-2.0-flash-exp', 'gemini-2.0-flash-thinking-exp', 'gemini-1.5-pro'
 * DeepSeek: 'deepseek-chat' (V3), 'deepseek-reasoner' (R1)
 * xAI: 'grok-3', 'grok-2-1212'
 * Perplexity: 'sonar-reasoning-pro', 'sonar-pro'
 * Meta (via Groq/Together): 'llama-3.3-70b-versatile', 'llama-3.1-405b'
 */
