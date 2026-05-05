import { useState, useCallback, useEffect } from 'react'

// ── Cache des voix chargé dès que disponible (Android Chrome async) ──────────
let cachedVoices = []

function loadVoices() {
  const v = window.speechSynthesis?.getVoices() ?? []
  if (v.length) cachedVoices = v
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices() // synchrone sur iOS/Safari et desktop
  // Android Chrome charge les voix de manière asynchrone via cet événement
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
}

function getFrenchVoice() {
  if (!cachedVoices.length) loadVoices() // dernier recours si l'event n'a pas encore tiré
  // Priorité : voix fr-FR, sinon fr-*, sinon null (le navigateur choisira)
  return (
    cachedVoices.find(v => v.lang === 'fr-FR') ??
    cachedVoices.find(v => v.lang.startsWith('fr')) ??
    null
  )
}

// ── Module-level : une seule section parle à la fois ─────────────────────────
let stopPrevious = null
let keepAliveTimer = null

function clearKeepAlive() {
  if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null }
}

// Contournement du bug de pause sur iOS ET certains Android WebView (~15s)
function startKeepAlive() {
  clearKeepAlive()
  keepAliveTimer = setInterval(() => {
    if (window.speechSynthesis?.paused && window.speechSynthesis?.speaking) {
      window.speechSynthesis.resume()
    }
  }, 8000)
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return

    // Toggle off si ce bouton parle déjà
    if (isSpeaking) {
      window.speechSynthesis.cancel() // déclenche onerror('interrupted') → finish()
      return
    }

    // Couper le précédent s'il y en a un
    if (stopPrevious) stopPrevious()
    clearKeepAlive()
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-FR'
    utterance.rate = 0.88  // légèrement plus lent pour la clarté en urgence
    utterance.pitch = 1
    utterance.volume = 1

    // Voix française si disponible (iOS sync, Android async via voiceschanged)
    const frVoice = getFrenchVoice()
    if (frVoice) utterance.voice = frVoice

    // Guard contre les appels doubles (cancel déclenche parfois onerror + onend)
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      clearKeepAlive()
      setIsSpeaking(false)
      if (stopPrevious === localStop) stopPrevious = null
    }

    const localStop = () => {
      window.speechSynthesis.cancel()
      finish()
    }

    utterance.onend = finish
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') console.warn('TTS error:', e.error)
      finish()
    }

    stopPrevious = localStop
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
    startKeepAlive()
  }, [isSpeaking])

  // Nettoyage si le composant est démonté pendant la lecture
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        clearKeepAlive()
        window.speechSynthesis?.cancel()
      }
    }
  }, [isSpeaking])

  return { isSpeaking, speak }
}
