import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import './Header.css'

export function Header() {
  const selected = useAppStore((s) => s.selected)
  const openEggImage = useAppStore((s) => s.openEggImage)

  // hidden mobile trigger for the Pale Blue Dot reveal: 5 quick taps on the title
  // (phones have no keyboard for the typed-phrase version)
  const taps = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onKickerTap = () => {
    taps.current += 1
    clearTimeout(tapTimer.current)
    if (taps.current >= 5) {
      taps.current = 0
      openEggImage('pale-blue-dot')
      return
    }
    tapTimer.current = setTimeout(() => { taps.current = 0 }, 1500)
  }

  return (
    <motion.header
      className="site-header"
      animate={{ opacity: selected ? 0.35 : 1, y: selected ? -10 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="site-header__kicker" onClick={onKickerTap}>Planetary Voices</p>
      <h1>Hear the Solar System</h1>
      <p className="site-header__sub">
        <span className="site-header__sub-wide">Click a planet to hear it and learn its story.</span>
        <span className="site-header__sub-narrow">Click a planet and hear its voice.</span>
      </p>
    </motion.header>
  )
}
