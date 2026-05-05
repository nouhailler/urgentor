import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { loadSettings } from '../hooks/useSettings'
import HelpPanel from './HelpPanel'

export default function Navbar() {
  const location = useLocation()
  const settings = loadSettings()
  const hasAnyKey = Object.values(settings).some(p => p?.key?.trim())
  const isSettings = location.pathname === '/parametres'
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <>
    <nav
      style={{
        backgroundColor: '#0a0a1a',
        borderBottom: '2px solid #CC0000',
        paddingTop: 'calc(0.75rem + env(safe-area-inset-top))'
      }}
      className="sticky top-0 z-50 px-4 pb-3"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          style={{ fontFamily: 'Oswald, sans-serif', textDecoration: 'none' }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-2xl">🚨</span>
          <span style={{ color: '#CC0000', fontSize: '22px', letterSpacing: '2px', fontWeight: 700 }}>
            URGENTOR
          </span>
          <span style={{ color: '#666', fontSize: '12px' }} className="hidden sm:inline">
            Premiers Secours
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            style={{
              color: location.pathname === '/' ? '#CC0000' : '#9ca3af',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '14px',
              textDecoration: 'none'
            }}
            className="px-3 py-2 rounded hover:bg-gray-800 transition-colors hidden sm:block"
          >
            Bibliothèque
          </Link>

          <Link
            to="/gestion"
            title="Gestion des fiches"
            style={{
              color: location.pathname === '/gestion' ? '#CC0000' : '#9ca3af',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '14px',
              textDecoration: 'none'
            }}
            className="px-3 py-2 rounded hover:bg-gray-800 transition-colors hidden sm:block"
          >
            📂 Gérer
          </Link>

          {/* Bouton Aide contextuelle */}
          <button
            onClick={() => setHelpOpen(o => !o)}
            title="Aide"
            style={{
              color: helpOpen ? '#CC0000' : '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minHeight: '40px',
              minWidth: '40px'
            }}
            className="p-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={helpOpen ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Icône Paramètres */}
          <Link
            to="/parametres"
            title="Paramètres"
            style={{
              color: isSettings ? '#CC0000' : (hasAnyKey ? '#9ca3af' : '#F39C12'),
              textDecoration: 'none',
              position: 'relative'
            }}
            className="p-2 rounded hover:bg-gray-800 transition-colors flex items-center"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isSettings ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {/* Point orange si aucune clé configurée */}
            {!hasAnyKey && (
              <span
                style={{ backgroundColor: '#F39C12', width: '7px', height: '7px', top: '6px', right: '6px' }}
                className="absolute rounded-full"
              />
            )}
          </Link>

          {/* Bouton nouvelle fiche */}
          <Link
            to="/nouvelle-fiche"
            style={{
              backgroundColor: '#CC0000',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '14px',
              textDecoration: 'none',
              minHeight: '40px'
            }}
            className="px-4 py-2 rounded text-white font-semibold hover:bg-red-700 transition-colors whitespace-nowrap flex items-center"
          >
            <span className="hidden sm:inline">+ Nouvelle fiche</span>
            <span className="sm:hidden text-xl leading-none">+</span>
          </Link>
        </div>
      </div>
    </nav>

    <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
  </>
  )
}
