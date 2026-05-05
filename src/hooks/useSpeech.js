import { useState, useCallback, useEffect } from 'react'

// Module-level: une seule section parle à la fois
let stopPrevious = null
let iosTimer = null

function clearIOSTimer() {
  if (iosTimer) { clearInterval(iosTimer); iosTimer = null }
}

// iOS bug : speechSynthesis se met en pause après ~15s
function startIOSTimer() {
  clearIOSTimer()
  iosTimer = setInterval(() => {
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
    clearIOSTimer()
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-FR'
    utterance.rate = 0.88  // légèrement plus lent pour la clarté en urgence
    utterance.pitch = 1
    utterance.volume = 1

    // Chercher une voix française disponible
    const voices = window.speechSynthesis.getVoices()
    const frVoice = voices.find(v => v.lang.startsWith('fr'))
    if (frVoice) utterance.voice = frVoice

    // Guard contre les appels doubles (cancel déclenche parfois onerror + onend)
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      clearIOSTimer()
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
    startIOSTimer()
  }, [isSpeaking])

  // Nettoyage si le composant est démonté pendant la lecture
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        clearIOSTimer()
        window.speechSynthesis?.cancel()
      }
    }
  }, [isSpeaking])

  return { isSpeaking, speak }
}
