import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { audioEngine } from '../lib/audioEngine'

/** Keyboard navigation: Esc closes, ←/→ browse planets while one is open. */
export function KeyboardControls() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { selected, select, selectRelative } = useAppStore.getState()

      if (e.key === 'Escape' && selected) {
        audioEngine.stop()
        select(null)
        return
      }
      // arrow browsing only once a planet is open, so it doesn't clash with the
      // Konami easter egg on the landing screen
      if (selected && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault()
        audioEngine.stop()
        selectRelative(e.key === 'ArrowRight' ? 1 : -1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
