import { AnimatePresence, motion } from 'framer-motion'
import { SpaceBackground } from './components/SpaceBackground'
import { SolarSystemScene } from './components/scene/SolarSystemScene'
import { OrbitDial } from './components/OrbitDial'
import { Header } from './components/Header'
import { ShareButton } from './components/ShareButton'
import { InfoPanel } from './components/InfoPanel'
import { EasterEggs } from './components/EasterEggs'
import { EasterEggImage } from './components/EasterEggImage'
import { LoadingScreen } from './components/LoadingScreen'
import { KeyboardControls } from './components/KeyboardControls'
import { useAppStore } from './store/useAppStore'
import { PLANET_VISUALS } from './data/planetVisuals'
import './App.css'

/** my other project, the rocket explorer */
const APOGEE_URL = 'https://apogee-launch.vercel.app'

/** calm "lobby" accent shown before any planet is picked */
const LOBBY_ACCENT = '#6f9be0'
const LOBBY_INK = '#05060f'

function App() {
  const selected = useAppStore((s) => s.selected)

  // the selected planet floods the whole UI with its own "exhibit room" color;
  // set here on the root so every descendant inherits var(--active-accent)
  const accent = selected ? PLANET_VISUALS[selected].uiAccent : LOBBY_ACCENT
  const accentInk = selected ? (PLANET_VISUALS[selected].uiInk ?? LOBBY_INK) : LOBBY_INK

  return (
    <div
      className={`app${selected ? ' app--reading' : ''}`}
      style={{
        ['--active-accent' as string]: accent,
        ['--active-accent-ink' as string]: accentInk,
      }}
    >
      <SpaceBackground />
      <Header />
      <ShareButton />

      <div className="app__scene">
        <SolarSystemScene />
      </div>

      <OrbitDial />

      <AnimatePresence>
        {!selected && (
          <motion.p
            className="app__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            tap a planet to listen
          </motion.p>
        )}
      </AnimatePresence>

      <p className="app__credit">
        Built by <span>Han Thu Hein</span>
        <a
          className="app__apogee"
          href={APOGEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Apogee, my rocket explorer"
        >
          Apogee ↗
        </a>
      </p>
      <p className="app__footer">Audio: NASA · JPL · U. Iowa · SOHO/Stanford · Imagery: Solar System Scope (CC BY 4.0)</p>

      <InfoPanel />
      <EasterEggs />
      <EasterEggImage />
      <KeyboardControls />
      <LoadingScreen />
    </div>
  )
}

export default App
