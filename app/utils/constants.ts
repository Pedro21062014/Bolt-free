import type { ModelInfo, OllamaApiResponse, OllamaModel } from './types';
import type { ProviderInfo } from '~/types/model';

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const PROVIDER_REGEX = /\[Provider: (.*?)\]\n\n/;
export const DEFAULT_MODEL = 'claude-3-7-sonnet-latest';
export const PROMPT_COOKIE_KEY = 'cachedPrompt';

const PROVIDER_LIST: ProviderInfo[] = [
  {
    name: 'Anthropic',
    staticModels: [
      {
        name: 'claude-4-opus-latest',
        label: 'Claude 4 Opus',
        provider: 'Anthropic',
        maxTokenAllowed: 8000,
      },
      {
        name: 'claude-4-sonnet-latest',
        label: 'Claude 4 Sonnet',
        provider: 'Anthropic',
        maxTokenAllowed: 8000,
      },
      {
        name: 'claude-4-haiku-latest',
        label: 'Claude 4 Haiku',
        provider: 'Anthropic',
        maxTokenAllowed: 8000,
      },
    ],
    getApiKeyLink: 'https://console.anthropic.com/settings/keys',
  },
  {
    name: 'Ollama',
    staticModels: [],
    getDynamicModels: getOllamaModels,
    getApiKeyLink: 'https://ollama.com/download',
    labelForGetApiKey: 'Download Ollama',
    icon: 'i-ph:cloud-arrow-down',
  },
  {
    name: 'OpenAILike',
    staticModels: [],
    getDynamicModels: getOpenAILikeModels,
  },
  {
    name: 'Cohere',
    staticModels: [
      { name: 'command-r2-plus', label: 'Command R2 Plus', provider: 'Cohere', maxTokenAllowed: 4096 },
      { name: 'command-r2', label: 'Command R2', provider: 'Cohere', maxTokenAllowed: 4096 },
    ],
    getApiKeyLink: 'https://dashboard.cohere.com/api-keys',
  },
  {
    name: 'OpenRouter',
    staticModels: [
      { name: 'openai/gpt-5', label: 'GPT-5 (OpenRouter)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      {
        name: 'anthropic/claude-4-sonnet',
        label: 'Anthropic: Claude 4 Sonnet (OpenRouter)',
        provider: 'OpenRouter',
        maxTokenAllowed: 8000,
      },
      {
        name: 'google/gemini-3.0-flash',
        label: 'Google Gemini 3.0 Flash (OpenRouter)',
        provider: 'OpenRouter',
        maxTokenAllowed: 8000,
      },
      {
        name: 'deepseek/deepseek-r2',
        label: 'DeepSeek R2 (OpenRouter)',
        provider: 'OpenRouter',
        maxTokenAllowed: 8000,
      },
      {
        name: 'meta-llama/llama-4-70b-instruct',
        label: 'Llama 4 70B Instruct (OpenRouter)',
        provider: 'OpenRouter',
        maxTokenAllowed: 8000,
      },
    ],
    getDynamicModels: getOpenRouterModels,
    getApiKeyLink: 'https://openrouter.ai/settings/keys',
  },
  {
    name: 'Google',
    staticModels: [
      { name: 'gemini-3.0-pro', label: 'Gemini 3.0 Pro', provider: 'Google', maxTokenAllowed: 8192 },
      { name: 'gemini-3.0-flash', label: 'Gemini 3.0 Flash', provider: 'Google', maxTokenAllowed: 8192 },
      { name: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'Google', maxTokenAllowed: 8192 },
    ],
    getApiKeyLink: 'https://aistudio.google.com/app/apikey',
  },
  {
    name: 'Groq',
    staticModels: [
      { name: 'llama-4-70b-versatile', label: 'Llama 4 70B Versatile', provider: 'Groq', maxTokenAllowed: 8000 },
      { name: 'deepseek-r2-distill-llama-70b', label: 'DeepSeek R2 Distill Llama 70B', provider: 'Groq', maxTokenAllowed: 8000 },
      { name: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', provider: 'Groq', maxTokenAllowed: 8000 },
    ],
    getApiKeyLink: 'https://console.groq.com/keys',
  },
  {
    name: 'HuggingFace',
    staticModels: [
      {
        name: 'meta-llama/Llama-4-70B-Instruct',
        label: 'Llama 4 70B Instruct',
        provider: 'HuggingFace',
        maxTokenAllowed: 8000,
      },
      {
        name: 'deepseek-ai/DeepSeek-R2',
        label: 'DeepSeek R2',
        provider: 'HuggingFace',
        maxTokenAllowed: 8000,
      },
      {
        name: 'Qwen/Qwen3-Coder-32B-Instruct',
        label: 'Qwen3 Coder 32B Instruct',
        provider: 'HuggingFace',
        maxTokenAllowed: 8000,
      },
    ],
    getApiKeyLink: 'https://huggingface.co/settings/tokens',
  },
  {
    name: 'OpenAI',
    staticModels: [
      { name: 'gpt-5', label: 'GPT-5', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'gpt-4.5', label: 'GPT-4.5', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'o4', label: 'o4', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'o3', label: 'o3', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'o1', label: 'o1', provider: 'OpenAI', maxTokenAllowed: 8000 },
    ],
    getApiKeyLink: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'xAI',
    staticModels: [
      { name: 'grok-3', label: 'Grok 3', provider: 'xAI', maxTokenAllowed: 8000 },
      { name: 'grok-2', label: 'Grok 2', provider: 'xAI', maxTokenAllowed: 8000 }
    ],
    getApiKeyLink: 'https://docs.x.ai/docs/quickstart#creating-an-api-key',
  },
  {
    name: 'Deepseek',
    staticModels: [
      { name: 'deepseek-r2', label: 'DeepSeek R2', provider: 'Deepseek', maxTokenAllowed: 8000 },
      { name: 'deepseek-v4', label: 'DeepSeek V4', provider: 'Deepseek', maxTokenAllowed: 8000 },
    ],
    getApiKeyLink: 'https://platform.deepseek.com/apiKeys',
  },
  {
    name: 'Mistral',
    staticModels: [
      { name: 'mistral-large-2', label: 'Mistral Large 2', provider: 'Mistral', maxTokenAllowed: 8000 },
      { name: 'pixtral-large-2', label: 'Pixtral Large 2', provider: 'Mistral', maxTokenAllowed: 8000 },
      { name: 'ministral-12b', label: 'Ministral 12B', provider: 'Mistral', maxTokenAllowed: 8000 },
    ],
    getApiKeyLink: 'https://console.mistral.ai/api-keys/',
  },
  {
    name: 'LMStudio',
    staticModels: [],
    getDynamicModels: getLMStudioModels,
    getApiKeyLink: 'https://lmstudio.ai/',
    labelForGetApiKey: 'Get LMStudio',
    icon: 'i-ph:cloud-arrow-down',
  },
];

export const DEFAULT_PROVIDER = PROVIDER_LIST[0];

const staticModels: ModelInfo[] = PROVIDER_LIST.map((p) => p.staticModels).flat();

export let MODEL_LIST: ModelInfo[] = [...staticModels];

const getOllamaBaseUrl = () => {
  const defaultBaseUrl = import.meta.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';

  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Frontend always uses localhost
    return defaultBaseUrl;
  }

  // Backend: Check if we're running in Docker
  const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

  return isDocker ? defaultBaseUrl.replace('localhost', 'host.docker.internal') : defaultBaseUrl;
};

async function getOllamaModels(): Promise<ModelInfo[]> {
  /*
   * if (typeof window === 'undefined') {
   * return [];
   * }
   */

  try {
    const baseUrl = getOllamaBaseUrl();
    const response = await fetch(`${baseUrl}/api/tags`);
    const data = (await response.json()) as OllamaApiResponse;

    return data.models.map((model: OllamaModel) => ({
      name: model.name,
      label: `${model.name} (${model.details.parameter_size})`,
      provider: 'Ollama',
      maxTokenAllowed: 8000,
    }));
  } catch (e) {
    console.error('Error getting Ollama models:', e);
    return [];
  }
}

async function getOpenAILikeModels(): Promise<ModelInfo[]> {
  try {
    const baseUrl = import.meta.env.OPENAI_LIKE_API_BASE_URL || '';

    if (!baseUrl) {
      return [];
    }

    const apiKey = import.meta.env.OPENAI_LIKE_API_KEY ?? '';
    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const res = (await response.json()) as any;

    return res.data.map((model: any) => ({
      name: model.id,
      label: model.id,
      provider: 'OpenAILike',
    }));
  } catch (e) {
    console.error('Error getting OpenAILike models:', e);
    return [];
  }
}

type OpenRouterModelsResponse = {
  data: {
    name: string;
    id: string;
    context_length: number;
    pricing: {
      prompt: number;
      completion: number;
    };
  }[];
};

async function getOpenRouterModels(): Promise<ModelInfo[]> {
  const data: OpenRouterModelsResponse = await (
    await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

  return data.data
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((m) => ({
      name: m.id,
      label: `${m.name} - in:$${(m.pricing.prompt * 1_000_000).toFixed(
        2,
      )} out:$${(m.pricing.completion * 1_000_000).toFixed(2)} - context ${Math.floor(m.context_length / 1000)}k`,
      provider: 'OpenRouter',
      maxTokenAllowed: 8000,
    }));
}

async function getLMStudioModels(): Promise<ModelInfo[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const baseUrl = import.meta.env.LMSTUDIO_API_BASE_URL || 'http://localhost:1234';
    const response = await fetch(`${baseUrl}/v1/models`);
    const data = (await response.json()) as any;

    return data.data.map((model: any) => ({
      name: model.id,
      label: model.id,
      provider: 'LMStudio',
    }));
  } catch (e) {
    console.error('Error getting LMStudio models:', e);
    return [];
  }
}

async function initializeModelList(): Promise<ModelInfo[]> {
  MODEL_LIST = [
    ...(
      await Promise.all(
        PROVIDER_LIST.filter(
          (p): p is ProviderInfo & { getDynamicModels: () => Promise<ModelInfo[]> } => !!p.getDynamicModels,
        ).map((p) => p.getDynamicModels()),
      )
    ).flat(),
    ...staticModels,
  ];
  return MODEL_LIST;
}

export {
  getOllamaModels,
  getOpenAILikeModels,
  getLMStudioModels,
  initializeModelList,
  getOpenRouterModels,
  PROVIDER_LIST,
};
