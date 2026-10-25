import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import './EasterEggs.css'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function EasterEggs() {
  const toast = useAppStore((s) => s.toast)
  const showToast = useAppStore((s) => s.showToast)
  const triggerWarp = useAppStore((s) => s.triggerWarp)
  const openEggImage = useAppStore((s) => s.openEggImage)

  // classic console greeting for the curious
  useEffect(() => {
    const style = 'color:#8ab4ff;font-family:monospace;font-size:12px'
    // eslint-disable-next-line no-console
    console.log('%c✦ Planetary Voices ✦\n%cYou found the console. Try the Konami code (↑↑↓↓←→←→ B A), or type "pluto" anywhere.', 'color:#ffb37a;font-weight:bold;font-size:16px', style)
  }, [])

  useEffect(() => {
    let konamiIdx = 0
    let typed = ''

    const onKey = (e: KeyboardEvent) => {
      // Konami code
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === KONAMI[konamiIdx]) {
        konamiIdx++
        if (konamiIdx === KONAMI.length) {
          konamiIdx = 0
          triggerWarp()
          showToast('Warp speed engaged.')
        }
      } else {
        konamiIdx = key === KONAMI[0] ? 1 : 0
      }

      // text buffer easter eggs. only letters go in the buffer (spaces skipped),
      // so "golden record" typed with a space still matches "goldenrecord".
      // 16 chars wide so the longest phrase fits.
      if (e.key.length === 1) {
        const ch = e.key.toLowerCase()
        if (/[a-z]/.test(ch)) {
          typed = (typed + ch).slice(-16)
          if (typed.endsWith('goldenrecord')) {
            typed = ''
            openEggImage('golden-record')
          } else if (typed.endsWith('palebluedot')) {
            typed = ''
            openEggImage('pale-blue-dot')
          } else if (typed.endsWith('pluto')) {
            showToast('Pluto says hi. Still a planet in our hearts.')
          } else if (typed.endsWith('life')) {
            showToast('As far as we know, you are on the only planet with it.')
          }
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showToast, triggerWarp, openEggImage])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="egg-toast"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
