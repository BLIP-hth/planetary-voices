import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { PLANETS } from '../data/planets'
import { PLANET_VISUALS } from '../data/planetVisuals'
import { AUDIO_CONFIG } from '../data/audioConfig'
import { VoiceNote } from './VoiceNote'
import { audioEngine } from '../lib/audioEngine'
import './InfoPanel.css'

export function InfoPanel() {
  const selected = useAppStore((s) => s.selected)
  const select = useAppStore((s) => s.select)
  const selectRelative = useAppStore((s) => s.selectRelative)
  const nowPlaying = useAppStore((s) => s.nowPlaying)
  const reduceMotion = useReducedMotion()

  const facts = selected ? PLANETS[selected] : null
  const visual = selected ? PLANET_VISUALS[selected] : null
  const audio = selected ? AUDIO_CONFIG[selected] : null

  const close = () => {
    audioEngine.stop()
    select(null)
  }

  const navigate = (delta: number) => {
    audioEngine.stop()
    selectRelative(delta)
  }

  // accessible dialog: move focus into the panel on open, restore it on close
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (selected) {
      if (!restoreRef.current) restoreRef.current = document.activeElement as HTMLElement
      const t = setTimeout(() => closeRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
    restoreRef.current?.focus?.()
    restoreRef.current = null
  }, [selected])

  return (
    <AnimatePresence>
      {facts && visual && audio && (
        <motion.div
          className="info-panel"
          role="dialog"
          aria-modal="true"
          aria-label={facts.name}
          initial={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
          transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 210, damping: 28 }}
        >
          <div className="info-panel__nav">
            <button onClick={() => navigate(-1)} aria-label="Previous planet" title="Previous (←)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button onClick={() => navigate(1)} aria-label="Next planet" title="Next (→)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <button ref={closeRef} className="info-panel__close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="info-panel__scroll">
            <header className="info-panel__header">
              <p className="info-panel__eyebrow">{facts.discoveryYear}</p>
              <h2>{facts.name}</h2>
              <p className="info-panel__tagline">{facts.tagline}</p>
            </header>

            <VoiceNote key={facts.id} planetId={facts.id} source={audio} />
            <p className="info-panel__credit">{audio.credit}</p>

            <div className="info-panel__signature">
              <span className="info-panel__signature-icon" aria-hidden>
                {/* lightbulb (idea/insight) — replaces the old sparkle star */}
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 21h4" />
                  <path d="M8.5 15a5.5 5.5 0 1 1 7 0c-.6.5-1 1.2-1 2H9.5c0-.8-.4-1.5-1-2z" />
                </svg>
              </span>
              <p>{facts.signatureFact}</p>
            </div>

            <CategoryGroup title="The experience">
              <ul className="info-panel__experience">
                <ExperienceItem icon={ICON.voice} label="Its voice">{facts.experience.sound}</ExperienceItem>
                <ExperienceItem icon={ICON.sky} label="The sky above">{facts.experience.sky}</ExperienceItem>
                <ExperienceItem icon={ICON.survival} label="Could you survive?">{facts.experience.survival}</ExperienceItem>
                <ExperienceItem icon={ICON.gravity} label="Your weight there">{facts.experience.gravity}</ExperienceItem>
                <ExperienceItem icon={ICON.size} label="Size vs Earth">{facts.experience.size}</ExperienceItem>
              </ul>
            </CategoryGroup>

            <CategoryGroup title="By the numbers">
              <div className="info-panel__stats">
                <Stat label="Diameter" value={`${facts.physicalStats.diameterKm.toLocaleString()} km`} hint="how wide it is across" />
                <Stat label="Day length" value={facts.physicalStats.dayLength} hint={facts.id === 'sun' ? 'one rotation, varies by latitude' : 'one full spin on its axis'} />
                {facts.id === 'sun' ? (
                  <Stat label="Planets" value={String(facts.moonCount)} hint="worlds that orbit it" />
                ) : (
                  <>
                    <Stat label="Year length" value={facts.physicalStats.yearLength} hint="one lap around the Sun" />
                    <Stat label="From Sun" value={`${facts.physicalStats.distanceFromSunAU} AU`} hint={distanceHint(facts.physicalStats.distanceFromSunAU)} />
                    <Stat label="Moons" value={String(facts.moonCount)} hint={facts.moonCount === 0 ? 'no moons of its own' : 'moons orbiting it'} />
                  </>
                )}
                <Stat label="Missions" value={String(facts.missionsVisited)} hint="spacecraft sent to study it" />
              </div>
            </CategoryGroup>

            <CategoryGroup title="The story">
              <Section title="Discovery">
                <p>{facts.discoverer}</p>
              </Section>
              <Section title="Mythology & namesake">
                <p>{facts.mythology}</p>
              </Section>
              <Section title="Impact on Earth & science">
                <p>{facts.impactOnEarth}</p>
              </Section>
              <Section title="Interesting facts">
                <ul className="info-panel__facts">
                  {facts.interestingFacts.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Scientific advancements">
                <p>{facts.scientificAdvancements}</p>
              </Section>
            </CategoryGroup>

            <CategoryGroup title="Exploration">
              <Section title={`Missions (${facts.missionsVisited})`}>
                <ul className="info-panel__missions">
                  {facts.notableMissions.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </Section>
            </CategoryGroup>
          </div>

          {/* persistent mini-player: stays visible while scrolling the panel */}
          <AnimatePresence>
            {nowPlaying === selected && (
              <motion.div
                className="info-panel__nowplaying"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.22 }}
              >
                <span className="info-panel__np-eq" aria-hidden>
                  <i /><i /><i /><i />
                </span>
                <span className="info-panel__np-label">Now playing · {facts.name}</span>
                <button className="info-panel__np-stop" onClick={() => audioEngine.stop()} aria-label="Stop audio">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** "AU" means multiples of Earth's distance from the Sun — turn it into plain language */
function distanceHint(au: number): string {
  if (au >= 0.95 && au <= 1.05) return 'the same as Earth'
  if (au < 0.95) return 'closer to the Sun than Earth'
  const times = au < 3 ? au.toFixed(1) : String(Math.round(au))
  return `~${times}× Earth's distance`
}

function CategoryGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="info-panel__category">
      <h3 className="info-panel__category-title">{title}</h3>
      {children}
    </section>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="info-panel__section">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

function ExperienceItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="info-panel__experience-item">
      <span className="info-panel__experience-icon" aria-hidden>{icon}</span>
      <div>
        <span className="info-panel__experience-label">{label}</span>
        <p>{children}</p>
      </div>
    </li>
  )
}

// Thin line icons (stroke, currentColor) — replaces emoji, matches the NASA-technical look
const svg = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
)
const ICON = {
  // sound wave / equalizer — "its voice"
  voice: svg(<><path d="M3 12v0" /><path d="M7 9v6" /><path d="M11 5v14" /><path d="M15 8v8" /><path d="M19 10v4" /></>),
  // sun over horizon — "the sky above"
  sky: svg(<><path d="M3 18h18" /><path d="M12 5v3" /><path d="M6 10l1.6 1.6" /><path d="M18 10l-1.6 1.6" /><path d="M8 18a4 4 0 0 1 8 0" /></>),
  // thermometer — "could you survive?"
  survival: svg(<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" />),
  // balance scale — "your weight there"
  gravity: svg(<><path d="M12 3v18" /><path d="M6 21h12" /><path d="M4 7h16" /><path d="M4 7l-2.5 5a2.5 2.5 0 0 0 5 0z" /><path d="M20 7l2.5 5a2.5 2.5 0 0 1-5 0z" /></>),
  // two circles — "size vs Earth"
  size: svg(<><circle cx="9" cy="13" r="6" /><circle cx="18.5" cy="13" r="2.5" /></>),
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="info-panel__stat">
      <span className="info-panel__stat-value">{value}</span>
      <span className="info-panel__stat-label">{label}</span>
      {hint && <span className="info-panel__stat-hint">{hint}</span>}
    </div>
  )
}
