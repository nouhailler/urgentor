import { useState } from 'react'

const LS_KEY = 'urgentor_settings'

export const PROVIDERS = {
  anthropic: {
    label: 'Anthropic',
    color: '#CC785C',
    placeholder: 'sk-ant-api03-...',
    models: [
      { id: 'claude-opus-4-7', label: 'Claude Opus 4.7 (le plus puissant)' },
      { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (recommandé)' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rapide)' }
    ]
  },
  openai: {
    label: 'OpenAI',
    color: '#10A37F',
    placeholder: 'sk-proj-...',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (recommandé)' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (rapide)' },
      { id: 'o3-mini', label: 'o3-mini (raisonnement)' }
    ]
  },
  openrouter: {
    label: 'OpenRouter',
    color: '#6366F1',
    placeholder: 'sk-or-v1-...',
    models: [] // dynamique — chargés via useOpenRouterModels
  }
}

const DEFAULTS = {
  anthropic: { key: '', model: 'claude-sonnet-4-6' },
  openai: { key: '', model: 'gpt-4o' },
  openrouter: { key: '', model: 'anthropic/claude-sonnet-4-5' }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return structuredClone(DEFAULTS)
    const parsed = JSON.parse(raw)
    return {
      anthropic: { ...DEFAULTS.anthropic, ...parsed.anthropic },
      openai: { ...DEFAULTS.openai, ...parsed.openai },
      openrouter: { ...DEFAULTS.openrouter, ...parsed.openrouter }
    }
  } catch {
    return structuredClone(DEFAULTS)
  }
}

export function saveSettings(settings) {
  localStorage.setItem(LS_KEY, JSON.stringify(settings))
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  const updateProvider = (provider, patch) => {
    const updated = { ...settings, [provider]: { ...settings[provider], ...patch } }
    setSettings(updated)
    saveSettings(updated)
  }

  const hasKey = (provider) => !!settings[provider]?.key?.trim()

  const configuredProviders = Object.keys(PROVIDERS).filter(hasKey)

  return { settings, updateProvider, hasKey, configuredProviders }
}
