import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategorieById } from '../data/categories'

// Supprime les accents et met en minuscule — "Brûlure" → "brulure"
function normalize(str) {
  return (str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

// Renvoie jusqu'à 5 fiches correspondant à la requête, triées par pertinence
function getSuggestions(query, allFiches) {
  const q = normalize(query)
  if (q.length < 2) return []

  return allFiches
    .map(fiche => {
      const title  = normalize(fiche.titre)
      const tags   = (fiche.tags ?? []).map(t => normalize(t)).join(' ')
      const obj    = normalize(fiche.objectif ?? '')
      const cat    = normalize(fiche.categorie)

      let score = 0
      if (title.startsWith(q))   score = 100
      else if (title.includes(q)) score = 80
      else if (tags.includes(q))  score = 50
      else if (obj.includes(q))   score = 30
      else if (cat.includes(q))   score = 20

      return { fiche, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ fiche }) => fiche)
}

// Surligne la partie correspondant à la requête dans le titre original
function HighlightText({ text, query }) {
  const normText  = normalize(text)
  const normQuery = normalize(query)
  if (normQuery.length < 2) return <span>{text}</span>

  const idx = normText.indexOf(normQuery)
  if (idx === -1) return <span>{text}</span>

  const len = normQuery.length
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-deep)', borderRadius: '3px', padding: '0 2px' }}>
        {text.slice(idx, idx + len)}
      </span>
      {text.slice(idx + len)}
    </>
  )
}

export default function SearchBar({ value, onChange, allFiches = [] }) {
  const navigate    = useNavigate()
  const [open, setOpen]           = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef  = useRef()
  const blurTimer = useRef()

  const suggestions  = getSuggestions(value, allFiches)
  const showDropdown = open && suggestions.length > 0

  useEffect(() => { setActiveIdx(-1) }, [value])

  useEffect(() => {
    if (value.length >= 2 && suggestions.length === 0) setOpen(false)
  }, [suggestions.length, value.length])

  const selectSuggestion = (fiche) => {
    clearTimeout(blurTimer.current)
    onChange('')
    setOpen(false)
    navigate(`/fiche/${fiche.id}`)
  }

  const handleChange = (v) => {
    onChange(v)
    setOpen(true)
  }

  const handleKeyDown = (e) => {
    if (!showDropdown) {
      if (e.key === 'Escape') { onChange(''); setOpen(false) }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0)           selectSuggestion(suggestions[activeIdx])
      else if (suggestions.length === 1) selectSuggestion(suggestions[0])
      else                          setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
      onChange('')
    }
  }

  const handleSuggestionPointerDown = (e) => e.preventDefault()
  const handleBlur  = () => { blurTimer.current = setTimeout(() => setOpen(false), 150) }
  const handleFocus = () => { clearTimeout(blurTimer.current); if (suggestions.length > 0) setOpen(true) }

  return (
    <div className="relative w-full" style={{ zIndex: 40 }}>
      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: showDropdown ? 'var(--accent)' : 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Rechercher — brûlure, hémorragie, NRBC…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            border: `1px solid ${showDropdown ? 'var(--accent)' : 'var(--border-strong)'}`,
            borderRadius: showDropdown ? '12px 12px 0 0' : '12px',
            outline: 'none',
            width: '100%',
            padding: '15px 48px 15px 46px',
          }}
        />
        {value && (
          <button
            onPointerDown={e => e.preventDefault()}
            onClick={() => { onChange(''); setOpen(false); inputRef.current?.focus() }}
            aria-label="Effacer"
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0,
              padding: '0 16px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:text-[var(--text)] transition-colors flex items-center"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown suggestions */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--accent)',
          borderTop: '1px solid var(--border)',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card-hover)',
          zIndex: 50,
        }}>
          {suggestions.map((fiche, i) => {
            const cat      = getCategorieById(fiche.categorie)
            const isActive = i === activeIdx
            return (
              <button
                key={fiche.id}
                onPointerDown={handleSuggestionPointerDown}
                onClick={() => selectSuggestion(fiche)}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: isActive ? 'var(--surface-subtle)' : 'transparent',
                  border: 'none',
                  borderTop: i > 0 ? '1px solid var(--divider)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '56px',
                  transition: 'background 0.1s',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0, color: cat?.couleur }}>{cat?.icone ?? '📄'}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text)', fontSize: '15px', fontFamily: 'var(--font-display)', fontWeight: 600, lineHeight: 1.2 }}>
                    <HighlightText text={fiche.titre} query={value} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                    {cat?.label}
                  </div>
                </div>

                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                  stroke={isActive ? 'var(--accent)' : 'var(--text-faint)'} strokeWidth={2.5}
                  style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          })}

          <div style={{
            padding: '7px 16px',
            borderTop: '1px solid var(--divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              {suggestions.length} résultat{suggestions.length > 1 ? 's' : ''}
            </span>
            <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>
              ↵ ouvrir · ↑↓ naviguer · Esc fermer
            </span>
          </div>
        </div>
      )}

      {/* Hint sans accents */}
      {!showDropdown && !value && (
        <div style={{ color: 'var(--text-faint)', fontSize: '12px', marginTop: '8px', paddingLeft: '4px' }}>
          Les accents ne sont pas nécessaires — tapez <em style={{ color: 'var(--text-muted)' }}>brulure</em>, <em style={{ color: 'var(--text-muted)' }}>hemorragie</em>, <em style={{ color: 'var(--text-muted)' }}>nrbc</em>…
        </div>
      )}
    </div>
  )
}
