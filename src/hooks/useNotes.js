import { useState, useCallback } from 'react'

const LS_KEY = 'urgentor_notes'

export function loadAllNotes() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function hasNote(ficheId) {
  return !!loadAllNotes()[ficheId]?.trim()
}

export function useNotes(ficheId) {
  const [text, setText] = useState(() => loadAllNotes()[ficheId] ?? '')
  const [savedAt, setSavedAt] = useState(null)

  const save = useCallback((val) => {
    setText(val)
    const all = loadAllNotes()
    if (val.trim()) {
      all[ficheId] = val
    } else {
      delete all[ficheId]
    }
    localStorage.setItem(LS_KEY, JSON.stringify(all))
    setSavedAt(new Date())
  }, [ficheId])

  return { text, save, savedAt }
}
