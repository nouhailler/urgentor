import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { loadSettings } from '../hooks/useSettings'
import HelpPanel from './HelpPanel'

function Logo() {
  return (
    <span
      style={{
        width: '38px', height: '38px', flexShrink: 0,
        background: 'var(--brand)', borderRadius: '11px',
        boxShadow: 'var(--shadow-logo)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </span>
  )
}

export default function Navbar() {
  const location = useLocation()
  const settings = loadSettings()
  const hasAnyKey = Object.values(settings).some(p => p?.key?.trim())
  const isSettings = location.pathname === '/parametres'
  const isHome = location.pathname === '/'
  const isGestion = location.pathname === '/gestion'
  const [helpOpen, setHelpOpen] = useState(false)

  const navLink = (active) => ({
    color: active ? 'var(--accent-deep)' : 'var(--text-secondary)',
    background: active ? 'var(--accent-soft)' : 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: active ? 600 : 500,
    textDecoration: 'none',
  })

  const iconBtn = (active) => ({
    color: active ? 'var(--accent-deep)' : 'var(--text-muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    minHeight: '40px',
    minWidth: '40px',
    position: 'relative',
  })

  return (
    <>
    <nav
      style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
      }}
      className="sticky top-0 z-50 px-4 pb-3"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }} className="flex items-center gap-2.5 flex-shrink-0">
          <Logo />
          <span className="flex flex-col leading-none">
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.2px' }}>
              URGENTOR
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', fontSize: '9.5px', letterSpacing: '2px', marginTop: '2px' }} className="hidden sm:inline uppercase">
              Premiers Secours
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/" style={navLink(isHome)} className="px-3 py-2 rounded-[10px] transition-colors hidden sm:block">
            Bibliothèque
          </Link>

          <Link to="/gestion" title="Gestion des fiches" style={navLink(isGestion)} className="px-3 py-2 rounded-[10px] transition-colors hidden sm:block">
            Gérer
          </Link>

          {/* Aide contextuelle */}
          <button onClick={() => setHelpOpen(o => !o)} title="Aide" style={iconBtn(helpOpen)} className="p-2 rounded-[10px] hover:bg-[var(--chip-bg)] transition-colors flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={helpOpen ? 2.2 : 1.9}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Paramètres */}
          <Link to="/parametres" title="Paramètres" style={{ ...iconBtn(isSettings), color: isSettings ? 'var(--accent-deep)' : (hasAnyKey ? 'var(--text-muted)' : 'var(--warning)') }} className="p-2 rounded-[10px] hover:bg-[var(--chip-bg)] transition-colors flex items-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isSettings ? 2.2 : 1.9}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!hasAnyKey && (
              <span style={{ backgroundColor: 'var(--warning)', width: '7px', height: '7px', top: '6px', right: '6px' }} className="absolute rounded-full" />
            )}
          </Link>

          {/* CTA Nouvelle fiche */}
          <Link
            to="/nouvelle-fiche"
            style={{
              backgroundColor: 'var(--ink)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              textDecoration: 'none',
              minHeight: '40px',
            }}
            className="px-4 py-2 rounded-[10px] text-white font-semibold hover:bg-[var(--ink-hover)] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            <span className="hidden sm:inline">Nouvelle fiche</span>
          </Link>
        </div>
      </div>
    </nav>

    <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
  </>
  )
}
