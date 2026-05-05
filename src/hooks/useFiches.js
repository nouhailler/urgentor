import { useState, useMemo } from 'react'
import { TOUTES_FICHES, searchFiches, getFichesByCategorie } from '../data/ficheIndex'

const LS_KEY = 'urgentor_fiches_custom'

function loadCustomFiches() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}

export function useFiches() {
  const [query, setQuery] = useState('')
  const [categorieActive, setCategorieActive] = useState(null)
  const [customFiches, setCustomFiches] = useState(loadCustomFiches)

  const allFiches = useMemo(() => [...TOUTES_FICHES, ...customFiches], [customFiches])

  const fichesFiltrees = useMemo(() => {
    let result = allFiches
    if (categorieActive) {
      result = result.filter(f => f.categorie === categorieActive)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(f =>
        f.titre.toLowerCase().includes(q) ||
        f.objectif?.toLowerCase().includes(q) ||
        f.tags?.some(t => t.toLowerCase().includes(q)) ||
        f.categorie.toLowerCase().includes(q)
      )
    }
    return result
  }, [allFiches, query, categorieActive])

  const saveFiche = (fiche) => {
    const updated = [...customFiches.filter(f => f.id !== fiche.id), fiche]
    setCustomFiches(updated)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
  }

  const deleteFiche = (id) => {
    const updated = customFiches.filter(f => f.id !== id)
    setCustomFiches(updated)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
  }

  const isCustom = (id) => customFiches.some(f => f.id === id)

  const exportFiches = (fiches) => {
    const blob = new Blob([JSON.stringify(fiches, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `urgentor-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importFiches = (jsonText) => {
    const data = JSON.parse(jsonText)
    const incoming = Array.isArray(data) ? data : [data]
    const merged = [...customFiches]
    let added = 0
    for (const f of incoming) {
      if (!f.id || !f.titre) throw new Error(`Fiche invalide : champs id et titre requis`)
      if (!merged.some(existing => existing.id === f.id)) {
        merged.push({ ...f, source: f.source ?? 'utilisateur' })
        added++
      }
    }
    setCustomFiches(merged)
    localStorage.setItem(LS_KEY, JSON.stringify(merged))
    return added
  }

  return {
    fichesFiltrees,
    allFiches,
    query,
    setQuery,
    categorieActive,
    setCategorieActive,
    saveFiche,
    deleteFiche,
    isCustom,
    exportFiches,
    importFiches
  }
}
