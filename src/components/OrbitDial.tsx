import { useEffect, useRef } from 'react'
import { PLANET_ORDER, PLANET_VISUALS } from '../data/planetVisuals'
import { PLANETS } from '../data/planets'
import { useAppStore } from '../store/useAppStore'
import './OrbitDial.css'

/**
 * Phone-only "radio dial": a full wheel of planet markers orbiting a glowing hub.
 * Flick it and it spins with momentum, gliding to a stop and snapping the nearest
 * planet under the top pointer. That planet becomes `focused` (shown big in 3D by
 * DialStagePlanet); tapping the already-focused planet opens its info panel.
 *
 * Rotation lives in refs + requestAnimationFrame (not React state) so a 60fps spin
 * never re-renders. The 3D stage only updates once, when the dial settles.
 */
const N = PLANET_ORDER.length
const STEP = 360 / N // degrees between neighbouring planets
const MAX_V = 13 // cap flick speed (deg/frame) so it never spins wildly
const FRICTION = 0.9 // per-frame decay — lower = stops sooner (less "slippery")

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const norm = (i: number) => ((i % N) + N) % N
const indexAtTop = (angle: number) => norm(Math.round(-angle / STEP))

export function OrbitDial() {
  const focused = useAppStore((s) => s.focused)
  const selected = useAppStore((s) => s.selected)
  const setFocused = useAppStore((s) => s.setFocused)
  const select = useAppStore((s) => s.select)

  const wheelRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([])

  const angleRef = useRef(-PLANET_ORDER.indexOf(focused) * STEP)
  const velRef = useRef(0) // deg per frame
  const rafRef = useRef(0)
  const draggingRef = useRef(false)
  const lastAngleRef = useRef(0)
  const lastTimeRef = useRef(0)
  const movedRef = useRef(0)

  // push the current rotation to the DOM + highlight the planet under the pointer
  const apply = () => {
    const w = wheelRef.current
    if (!w) return
    w.style.setProperty('--rot', `${angleRef.current}deg`)
    const top = indexAtTop(angleRef.current)
    for (let i = 0; i < markerRefs.current.length; i++) {
      markerRefs.current[i]?.classList.toggle('is-top', i === top)
    }
  }

  const stop = () => cancelAnimationFrame(rafRef.current)

  // ease to a specific planet index, then commit it as focused
  const settleTo = (index: number, commit = true) => {
    stop()
    const start = angleRef.current
    const rawTarget = -index * STEP
    // shortest signed path so it never unwinds the long way round
    const delta = ((rawTarget - start + 540) % 360) - 180
    const target = start + delta
    const t0 = performance.now()
    const dur = 420
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      angleRef.current = start + (target - start) * ease(p)
      apply()
      if (p < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        angleRef.current = target
        apply()
        if (commit) setFocused(PLANET_ORDER[index])
      }
    }
    rafRef.current = requestAnimationFrame(frame)
  }

  // free-spin: momentum with friction, then snap to whatever is nearest the top
  const spin = () => {
    stop()
    const frame = () => {
      velRef.current *= FRICTION
      angleRef.current += velRef.current
      apply()
      if (Math.abs(velRef.current) > 0.7) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        settleTo(indexAtTop(angleRef.current))
      }
    }
    rafRef.current = requestAnimationFrame(frame)
  }

  const pointerAngle = (e: React.PointerEvent) => {
    const r = wheelRef.current!.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI
  }

  const onDown = (e: React.PointerEvent) => {
    stop()
    draggingRef.current = true
    velRef.current = 0
    movedRef.current = 0
    lastAngleRef.current = pointerAngle(e)
    lastTimeRef.current = performance.now()
    wheelRef.current?.setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const a = pointerAngle(e)
    let d = a - lastAngleRef.current
    if (d > 180) d -= 360
    if (d < -180) d += 360
    angleRef.current += d
    movedRef.current += Math.abs(d)
    const now = performance.now()
    const dt = Math.max(1, now - lastTimeRef.current)
    velRef.current = clamp((d / dt) * 16, -MAX_V, MAX_V) // per-frame (~16ms), capped
    lastAngleRef.current = a
    lastTimeRef.current = now
    apply()
  }

  const onUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    if (Math.abs(velRef.current) > 0.7) spin()
    else settleTo(indexAtTop(angleRef.current))
  }

  const onMarker = (i: number) => {
    if (movedRef.current > 7) return // that was a drag, not a tap
    if (i === PLANET_ORDER.indexOf(focused)) {
      select(focused) // tapping the centred planet opens it
    } else {
      settleTo(i)
    }
  }

  // keep the wheel aligned when focus changes elsewhere (panel prev/next arrows)
  useEffect(() => {
    if (draggingRef.current) return
    const idx = PLANET_ORDER.indexOf(focused)
    if (indexAtTop(angleRef.current) !== idx) settleTo(idx, false)
    else apply()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused])

  useEffect(() => {
    apply()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      className={`orbit-dial${selected ? ' orbit-dial--hidden' : ''}`}
      aria-hidden={selected != null}
      style={{ ['--dial-accent' as string]: PLANET_VISUALS[focused].uiAccent }}
    >
      <div className="orbit-dial__pointer" aria-hidden />
      <div
        className="orbit-dial__wheel"
        ref={wheelRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="orbit-dial__hub" aria-hidden>
          <span className="orbit-dial__hub-core" />
          <span className="orbit-dial__hub-ring" />
          <span className="orbit-dial__hub-ring orbit-dial__hub-ring--wide" />
        </div>
        {PLANET_ORDER.map((id, i) => (
          <button
            key={id}
            ref={(el) => {
              markerRefs.current[i] = el
            }}
            className="orbit-dial__slot"
            style={{ ['--a' as string]: `${i * STEP}deg` }}
            onClick={() => onMarker(i)}
            aria-label={PLANETS[id].name}
          >
            <span
              className="orbit-dial__marker"
              style={{
                backgroundImage: `url(${PLANET_VISUALS[id].texture})`,
                ['--glow' as string]: PLANET_VISUALS[id].glowColor,
              }}
            />
          </button>
        ))}
      </div>
      <p className="orbit-dial__name">{PLANETS[focused].name}</p>
      <p className="orbit-dial__hint">flick to spin · tap to listen</p>
    </div>
  )
}
