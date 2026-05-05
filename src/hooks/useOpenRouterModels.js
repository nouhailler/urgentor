import { useState, useCallback } from 'react'

const CACHE_KEY = 'urgentor_or_models'

export function loadCachedORModels() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return { models: [], lastFetch: null }
    return JSON.parse(raw)
  } catch {
    return { models: [], lastFetch: null }
  }
}

export function useOpenRouterModels(apiKey) {
  const cached = loadCachedORModels()
  const [models, setModels] = useState(cached.models)
  const [lastFetch, setLastFetch] = useState(cached.lastFetch)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (apiKey?.trim()) headers['Authorization'] = `Bearer ${apiKey.trim()}`

      const res = await fetch('https://openrouter.ai/api/v1/models', { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const free = data.data
        .filter(m => m.id.endsWith(':free'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(m => ({
          id: m.id,
          name: m.name.replace(/\s*\(free\)\s*/i, '').trim(),
          contextLength: m.context_length ?? null
        }))

      const cache = { models: free, lastFetch: new Date().toISOString() }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      setModels(free)
      setLastFetch(cache.lastFetch)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  return { models, lastFetch, loading, error, refresh }
}

export function formatLastFetch(iso) {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return "à l'instant"
  if (diff < 3_600_000) return `il y a ${Math.floor(diff / 60_000)} min`
  if (diff < 86_400_000) return `il y a ${Math.floor(diff / 3_600_000)}h`
  return new Date(iso).toLocaleDateString('fr-FR')
}
