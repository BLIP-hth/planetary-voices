import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useAppStore, type EggId } from '../store/useAppStore'
import './EasterEggImage.css'

/** the hidden image reveals. desktop: type the phrase anywhere. mobile: tap the
    "Planetary Voices" title 5 times. dismiss by clicking anywhere or Escape. */
const EGGS: Record<
  EggId,
  { src: string; alt: string; caption: string; credit: string; glow: string }
> = {
  'golden-record': {
    src: '/images/golden-record.jpg',
    alt: 'The Voyager Golden Record, a gold plated copper disc labelled The Sounds of Earth',
    caption:
      'In 1977 both Voyager probes left Earth carrying a gold plated record. On it: greetings in 55 languages, the sound of rain, whale song and a human heartbeat, and 90 minutes of music. Both records are drifting through interstellar space right now, still carrying our voices outward.',
    credit: 'The Golden Record · NASA / JPL-Caltech · tap anywhere to close',
    glow: '0 0 70px -12px rgba(255, 200, 120, 0.4), 0 24px 60px -20px rgba(0, 0, 0, 0.8)',
  },
  'pale-blue-dot': {
    src: '/images/pale-blue-dot.png',
    alt: 'The Pale Blue Dot, Earth seen as a tiny speck of light from Voyager 1',
    caption:
      'On Valentine’s Day 1990, from 6 billion kilometers out, Voyager 1 turned around and photographed home. Earth is that speck caught in the sunbeam, smaller than a single pixel. As Carl Sagan put it: that’s here, that’s home, that’s us. Everyone you love, on a mote of dust in a sunbeam.',
    credit: 'The Pale Blue Dot · NASA / JPL-Caltech · tap anywhere to close',
    glow: '0 0 80px -10px rgba(150, 180, 255, 0.28), 0 24px 60px -20px rgba(0, 0, 0, 0.85)',
  },
}

export function EasterEggImage() {
  const eggId = useAppStore((s) => s.eggImage)
  const close = useAppStore((s) => s.closeEggImage)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!eggId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [eggId, close])

  const egg = eggId ? EGGS[eggId] : null
  const fade = reduceMotion ? 0.2 : 1

  return (
    <AnimatePresence>
      {egg && (
        <motion.div
          className="egg-reveal"
          role="dialog"
          aria-modal="true"
          aria-label={egg.alt}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fade, ease: 'easeInOut' }}
        >
          <motion.img
            className="egg-reveal__img"
            src={egg.src}
            alt={egg.alt}
            draggable={false}
            style={{ boxShadow: egg.glow }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: fade, ease: 'easeOut' }}
          />
          <motion.p
            className="egg-reveal__caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: fade, delay: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
          >
            {egg.caption}
          </motion.p>
          <motion.p
            className="egg-reveal__credit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: fade, delay: reduceMotion ? 0 : 1, ease: 'easeOut' }}
          >
            {egg.credit}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
