import { useEffect, useRef, useState } from 'react'
import type { AudioSource } from '../data/audioConfig'
import type { PlanetId } from '../data/planetVisuals'
import { useAppStore } from '../store/useAppStore'
import { audioEngine, renderSyntheticWav } from '../lib/audioEngine'
import './VoiceNote.css'

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
)

interface VoiceNoteProps {
  planetId: string
  source: AudioSource
}

const BAR_COUNT = 28

export function VoiceNote({ planetId, source }: VoiceNoteProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errored, setErrored] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [dlError, setDlError] = useState(false)
  const rafRef = useRef<number | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const setNowPlaying = useAppStore((s) => s.setNowPlaying)

  // mirror play state into the store so the "now playing" cue persists while
  // scrolling; VoiceNote's tick below flips isPlaying false on any external stop
  useEffect(() => {
    setNowPlaying(isPlaying ? (planetId as PlanetId) : null)
    return () => setNowPlaying(null)
  }, [isPlaying, planetId, setNowPlaying])

  // reset when the planet changes; stop this planet's audio on unmount/switch
  useEffect(() => {
    setIsPlaying(false)
    setIsLoading(false)
    setErrored(false)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (audioEngine.playingId === planetId) audioEngine.stop()
    }
  }, [planetId])

  // smooth left-to-right playback progress (replaces the erratic frequency bars).
  // Writes a single CSS var per frame; the fill layer is clipped to that width.
  useEffect(() => {
    const wf = waveformRef.current
    if (!isPlaying) {
      if (wf) wf.style.setProperty('--progress', '0%')
      return
    }
    const start = performance.now()
    const tick = () => {
      if (audioEngine.playingId !== planetId) {
        setIsPlaying(false)
        return
      }
      let p = 0
      const el = audioElRef.current
      if (source.kind === 'real' && el && isFinite(el.duration) && el.duration > 0) {
        p = (el.currentTime % el.duration) / el.duration
      } else {
        // synthetic loops forever, so sweep on a steady virtual clock
        const cycle = 12000
        p = ((performance.now() - start) % cycle) / cycle
      }
      if (wf) wf.style.setProperty('--progress', `${(p * 100).toFixed(2)}%`)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying, planetId, source])

  // synthetic planets have no audio file, so render a WAV clip on demand
  const downloadSynth = async () => {
    if (rendering || source.kind !== 'synthetic') return
    setRendering(true)
    try {
      const blob = await renderSyntheticWav(source, 8)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${planetId}-voice.wav`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (err) {
      console.error('[PlanetaryVoices] synth render failed:', err)
      setDlError(true)
      setTimeout(() => setDlError(false), 2600)
    } finally {
      setRendering(false)
    }
  }

  const toggle = async () => {
    if (isPlaying) {
      audioEngine.stop()
      setIsPlaying(false)
      return
    }
    setIsLoading(true)
    setErrored(false)
    try {
      if (source.kind === 'real') {
        const el = audioElRef.current!
        await audioEngine.playElement(planetId, el, source.gain ?? 1)
      } else {
        audioEngine.playSynthetic(planetId, source)
      }
      setIsPlaying(true)
    } catch (err) {
      console.error('[PlanetaryVoices] audio failed:', err)
      setErrored(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="voice-note">
      {source.kind === 'real' && (
        <audio ref={audioElRef} src={source.src} preload="none" crossOrigin="anonymous" />
      )}

      <button
        className="voice-note__btn"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause planet sound' : 'Play planet sound'}
      >
        {isLoading ? (
          <span className="voice-note__spinner" />
        ) : isPlaying ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <rect x="5" y="4" width="5" height="16" rx="1.5" />
            <rect x="14" y="4" width="5" height="16" rx="1.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M7 4.5v15l13-7.5-13-7.5z" />
          </svg>
        )}
      </button>

      <div className="voice-note__waveform" ref={waveformRef} role="img" aria-label="Playback progress">
        <div className="voice-note__bars voice-note__bars--track" aria-hidden>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span key={i} className="voice-note__bar" />
          ))}
        </div>
        <div className="voice-note__bars voice-note__bars--fill" aria-hidden>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span key={i} className="voice-note__bar" />
          ))}
        </div>
      </div>

      <div className="voice-note__meta">
        <span className={`voice-note__badge ${source.kind === 'real' ? 'is-real' : 'is-synthetic'}`}>
          {errored ? '⚠ unavailable' : source.kind === 'real' ? '● real recording' : '◌ synthesized'}
        </span>
        {source.kind === 'real' ? (
          <a
            className="voice-note__download"
            href={source.src}
            download={source.downloadName ?? true}
            aria-label="Download this recording"
            title="Download recording"
          >
            <DownloadIcon />
          </a>
        ) : (
          <button
            className="voice-note__download"
            onClick={downloadSynth}
            disabled={rendering}
            aria-label="Download this soundscape"
            title={dlError ? 'Download not supported on this browser' : 'Download soundscape'}
          >
            {rendering ? <span className="voice-note__dl-spin" /> : dlError ? '⚠' : <DownloadIcon />}
          </button>
        )}
      </div>
    </div>
  )
}
