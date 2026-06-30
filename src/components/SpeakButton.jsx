import { useSpeech } from '../hooks/useSpeech'

export default function SpeakButton({ text, color = '#0E7180' }) {
  const { isSpeaking, speak } = useSpeech()
  const idle = '#8A95A3'

  if (!('speechSynthesis' in window)) return null

  return (
    <button
      onClick={() => speak(text)}
      title={isSpeaking ? 'Arrêter la lecture' : 'Lire à voix haute'}
      style={{
        background: isSpeaking ? color + '18' : 'transparent',
        border: `1px solid ${isSpeaking ? color : 'transparent'}`,
        color: isSpeaking ? color : idle,
        padding: '6px 11px',
        borderRadius: '999px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: '12.5px',
        fontWeight: 500,
        transition: 'color 0.2s, border-color 0.2s, background 0.2s',
        minWidth: 'unset',
        minHeight: 'unset',
      }}
      onMouseEnter={e => { if (!isSpeaking) e.currentTarget.style.color = color }}
      onMouseLeave={e => { if (!isSpeaking) e.currentTarget.style.color = idle }}
    >
      {isSpeaking ? <StopIcon color={color} /> : <SpeakerIcon />}
      {isSpeaking ? <SoundWaves color={color} /> : <span>Écouter</span>}
    </button>
  )
}

function SpeakerIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 010 14.14"/>
      <path d="M15.54 8.46a5 5 0 010 7.07"/>
    </svg>
  )
}

function StopIcon({ color }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={color} stroke="none">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  )
}

function SoundWaves({ color }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: '3px',
            backgroundColor: color,
            borderRadius: '2px',
            animation: `speak-wave 0.7s ease-in-out ${delay}s infinite alternate`,
            height: `${8 + i * 3}px`,
          }}
        />
      ))}
    </span>
  )
}
