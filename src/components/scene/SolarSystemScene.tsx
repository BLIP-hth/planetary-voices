import { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { PLANET_ORDER, PLANET_VISUALS } from '../../data/planetVisuals'
import { PlanetMesh } from './PlanetMesh'
import { DialStagePlanet } from './DialStagePlanet'
import { useAppStore } from '../../store/useAppStore'
import { audioEngine } from '../../lib/audioEngine'

interface LayoutData {
  positions: { id: (typeof PLANET_ORDER)[number]; position: [number, number, number] }[]
  /** half-extent along the primary axis (X for a row, Y for a column) + body radius */
  halfExtent: number
  vertical: boolean
}

/**
 * Cumulative layout: place each body so the gap between neighbouring *surfaces*
 * is constant, regardless of their very different radii. On narrow (portrait)
 * screens the bodies stack into a vertical column instead of a horizontal row,
 * so a phone shows the whole solar system top-to-bottom.
 */
function buildLayout(vertical: boolean): LayoutData {
  const gapBase = vertical ? 0.6 : 0.85
  const sunExtra = vertical ? 1.0 : 1.5
  const arcAmt = vertical ? 0 : 0.45

  const centers: number[] = []
  let cursor = 0
  PLANET_ORDER.forEach((id, i) => {
    if (i === 0) {
      cursor = PLANET_VISUALS[id].radius
    } else {
      const prev = PLANET_VISUALS[PLANET_ORDER[i - 1]]
      const gap = prev.isStar ? gapBase + sunExtra : gapBase
      cursor += prev.radius + gap + PLANET_VISUALS[id].radius
    }
    centers.push(cursor)
  })
  const mid = (centers[0] + centers[centers.length - 1]) / 2
  const span = centers[centers.length - 1] - centers[0]

  let halfExtent = 0
  const positions = PLANET_ORDER.map((id, i) => {
    const p = centers[i] - mid
    const arc = -Math.pow(p / (span / 2 || 1), 2) * arcAmt
    halfExtent = Math.max(halfExtent, Math.abs(p) + PLANET_VISUALS[id].radius)
    const position: [number, number, number] = vertical
      ? [arc, -p, -Math.abs(p) * 0.05] // column: Sun at top, going down
      : [p, arc, -Math.abs(p) * 0.1] // row: Sun at left
    return { id, position }
  })
  return { positions, halfExtent, vertical }
}

const layoutCache = new Map<boolean, LayoutData>()
function getLayout(vertical: boolean): LayoutData {
  let l = layoutCache.get(vertical)
  if (!l) {
    l = buildLayout(vertical)
    layoutCache.set(vertical, l)
  }
  return l
}

/** portrait / narrow screens switch to the mobile orbit-dial (single hero planet) */
const isVertical = (w: number, h: number) => h > w * 1.1

// phone framing: the hero planet sits at the world origin and the camera looks
// downward, so it projects into the UPPER area of the screen — leaving the lower
// half clear for the DOM orbit dial that overlays it.
const MOBILE_LOOK_Y = -1.15
const MOBILE_Z = 7.2

function Rig() {
  const selected = useAppStore((s) => s.selected)

  useFrame((state, delta) => {
    const { camera, size, pointer } = state
    const aspect = size.width / Math.max(size.height, 1)
    const persp = camera as THREE.PerspectiveCamera
    const fovV = (persp.fov * Math.PI) / 180
    const vertical = isVertical(size.width, size.height)

    if (vertical) {
      // fixed framing for the single hero planet; no pointer parallax on touch
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 3, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 0, 3, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, MOBILE_Z, 3, delta)
      camera.lookAt(0, MOBILE_LOOK_Y, 0)
      return
    }

    const layout = getLayout(vertical)
    // fit the row to the viewport width (aspect-corrected)
    const margin = 1.08
    const denom = Math.tan(fovV / 2) * aspect
    const fitZ = (layout.halfExtent * margin) / denom
    const targetZ = THREE.MathUtils.clamp(fitZ, 7, 50)

    const targetX = selected ? 0 : pointer.x * 0.35
    const targetY = selected ? 0.25 : 0.3 + pointer.y * 0.18
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.6, delta)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Layout() {
  const { size } = useThree()
  const vertical = isVertical(size.width, size.height)
  const focused = useAppStore((s) => s.focused)

  if (vertical) {
    // phone: one hero planet, driven by the orbit dial; remounts (key) to pop in
    return <DialStagePlanet key={focused} planetId={focused} />
  }

  const layout = getLayout(vertical)
  return (
    <>
      {layout.positions.map(({ id, position }, i) => (
        <PlanetMesh key={id} visual={PLANET_VISUALS[id]} basePosition={position} phase={i * 1.3} />
      ))}
    </>
  )
}

export function SolarSystemScene() {
  const selected = useAppStore((s) => s.selected)
  const [frozen, setFrozen] = useState(false)

  // When the info panel opens, stop the render loop shortly after the selection
  // animation settles. The scene is mostly hidden behind the panel, so freezing it
  // frees the GPU and keeps panel scrolling perfectly smooth. Resumes on close.
  useEffect(() => {
    if (!selected) {
      setFrozen(false)
      return
    }
    setFrozen(false)
    const t = setTimeout(() => setFrozen(true), 550)
    return () => clearTimeout(t)
  }, [selected])

  return (
    <Canvas
      frameloop={frozen ? 'never' : 'always'}
      camera={{ position: [0, 0.4, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      // clicking empty space (no planet hit) deselects and stops the audio
      onPointerMissed={() => {
        if (useAppStore.getState().selected) {
          useAppStore.getState().select(null)
          audioEngine.stop()
        }
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 3, 5]} intensity={2.4} color="#fff6e8" />
      <pointLight position={[-6, -2, -4]} intensity={0.4} color="#5a7bff" />

      <Suspense fallback={null}>
        <Stars radius={80} depth={50} count={1500} factor={2.4} saturation={0} fade speed={0.4} />
        <Layout />
      </Suspense>

      <Rig />
    </Canvas>
  )
}
