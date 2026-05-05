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

  // Les positions restent alignées car chaque char accenté
  // (é, û, ç…) compte pour 1 dans l'original ET dans la forme normalisée.
  const len = normQuery.length
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ backgroundColor: '#CC000055', color: '#FF9999', borderRadius: '2px', padding: '0 1px' }}>
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

  // Réinitialise la sélection clavier à chaque nouvelle frappe
  useEffect(() => { setActiveIdx(-1) }, [value])

  // Ferme le dropdown si on tape ≥ 2 chars mais aucune suggestion
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
      else                          setOpen(false) // filtre la grille
    } else if (e.key === 'Escape') {
      setOpen(false)
      onChange('')
    }
  }

  // Empêche l'input de perdre le focus lors d'un tap sur une suggestion
  const handleSuggestionPointerDown = (e) => e.preventDefault()

  const handleBlur  = () => { blurTimer.current = setTimeout(() => setOpen(false), 150) }
  const handleFocus = () => { clearTimeout(blurTimer.current); if (suggestions.length > 0) setOpen(true) }

  return (
    <div className="relative w-full" style={{ zIndex: 40 }}>
      {/* ── Input ─────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: showDropdown ? '#CC0000' : '#666' }}>
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
          placeholder="brulure, malaise, gaz, noyade…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '18px',
            backgroundColor: '#16213e',
            color: '#f0f0f0',
            border: `2px solid ${showDropdown ? '#CC0000' : (value ? '#CC0000' : '#2a2a4a')}`,
            borderBottomLeftRadius:  showDropdown ? 0 : '8px',
            borderBottomRightRadius: showDropdown ? 0 : '8px',
            borderRadius: showDropdown ? '8px 8px 0 0' : '8px',
            outline: 'none',
            width: '100%',
            padding: '16px 48px 16px 52px',
          }}
          autoFocus
        />
        {value && (
          <button
            onPointerDown={e => e.preventDefault()}
            onClick={() => { onChange(''); setOpen(false); inputRef.current?.focus() }}
            aria-label="Effacer"
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0,
              padding: '0 16px', color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:text-white transition-colors flex items-center"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Dropdown suggestions ───────────────────────────────────── */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#16213e',
          border: '2px solid #CC0000',
          borderTop: '1px solid #2a0000',
          borderRadius: '0 0 10px 10px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
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
                  padding: '13px 16px',
                  backgroundColor: isActive ? '#2a0a0a' : 'transparent',
                  border: 'none',
                  borderTop: i > 0 ? '1px solid #1e1e3a' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '56px',
                  transition: 'background 0.1s',
                }}
              >
                {/* Icône catégorie */}
                <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{cat?.icone ?? '📄'}</span>

                {/* Titre + catégorie */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: isActive ? '#FFFFFF' : '#f0f0f0',
                    fontSize: '16px',
                    fontFamily: 'Oswald, sans-serif',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                  }}>
                    <HighlightText text={fiche.titre} query={value} />
                  </div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
                    {cat?.label}
                  </div>
                </div>

                {/* Flèche */}
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                  stroke={isActive ? '#CC0000' : '#333'} strokeWidth={2.5}
                  style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          })}

          {/* Pied de dropdown — indication */}
          <div style={{
            padding: '7px 16px',
            borderTop: '1px solid #1e1e3a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ color: '#444', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace' }}>
              {suggestions.length} résultat{suggestions.length > 1 ? 's' : ''}
            </span>
            <span style={{ color: '#333', fontSize: '11px' }}>
              ↵ ouvrir · ↑↓ naviguer · Esc fermer
            </span>
          </div>
        </div>
      )}

      {/* Hint sans accents sous l'input */}
      {!showDropdown && !value && (
        <div style={{ color: '#444', fontSize: '12px', marginTop: '6px', paddingLeft: '4px' }}>
          Les accents ne sont pas nécessaires — tapez <em style={{ color: '#555' }}>brulure</em>, <em style={{ color: '#555' }}>hemorragie</em>, <em style={{ color: '#555' }}>nrbc</em>…
        </div>
      )}
    </div>
  )
}
