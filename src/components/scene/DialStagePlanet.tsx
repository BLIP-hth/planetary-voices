import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { PLANET_VISUALS, type PlanetId } from '../../data/planetVisuals'
import { PlanetHalo } from './PlanetHalo'
import { useAppStore } from '../../store/useAppStore'

/**
 * The single hero planet shown on phones above the orbit dial. Deliberately
 * separate from PlanetMesh (which carries the desktop row's selection / fly-away
 * logic) so the mobile stage stays simple and the desktop scene is untouched.
 * Bodies are normalised to a common on-screen size so Mercury and the Sun both
 * fill the stage nicely. Remounts (via `key`) when the focused planet changes,
 * giving a quick scale-in "pop" as the dial settles.
 */
const HERO = 0.82 // target on-screen radius in world units

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function DialStagePlanet({ planetId }: { planetId: PlanetId }) {
  const visual = PLANET_VISUALS[planetId]
  const group = useRef<THREE.Group>(null!)
  const planetMesh = useRef<THREE.Mesh>(null!)
  const cloudsMesh = useRef<THREE.Mesh>(null!)
  const select = useAppStore((s) => s.select)
  const warp = useAppStore((s) => s.warp)

  const [colorMap, cloudsMap, ringMap] = useTexture([
    visual.texture,
    visual.cloudsTexture ?? visual.texture,
    visual.ringTexture ?? visual.texture,
  ])
  useMemo(() => {
    ;[colorMap, cloudsMap, ringMap].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    })
  }, [colorMap, cloudsMap, ringMap])

  const ringGeometry = useMemo(() => {
    if (!visual.ringTexture) return null
    const inner = visual.radius * (visual.ringInnerScale ?? 1.35)
    const outer = visual.radius * (visual.ringOuterScale ?? 2.3)
    const geo = new THREE.RingGeometry(inner, outer, 160, 3)
    const pos = geo.attributes.position
    const uv = geo.attributes.uv
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const r = v.length()
      uv.setXY(i, (r - inner) / (outer - inner), 0.5)
    }
    return geo
  }, [visual])

  const emissiveBoost = visual.emissiveBoost ?? (visual.isStar ? 0 : 0.16)
  // Ringed planets (Saturn) are much wider than their body, so normalise by the
  // ring's outer edge — otherwise the rings shoot off the top and sides.
  const extent = visual.ringTexture ? visual.radius * (visual.ringOuterScale ?? 2.3) : visual.radius
  const targetExtent = visual.ringTexture ? 1.2 : HERO
  const norm = targetExtent / extent
  const scaleRef = useRef(norm * 0.55) // start smaller → scale-in on mount

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const spin = REDUCED_MOTION ? 0 : visual.rotationSpeed * (warp ? 9 : 1)
    planetMesh.current.rotation.y += spin * delta
    if (cloudsMesh.current) cloudsMesh.current.rotation.y += spin * delta * 1.6

    group.current.position.y = REDUCED_MOTION ? 0 : Math.sin(t * 0.6) * 0.05

    const lerp = 1 - Math.pow(0.0015, delta)
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, norm, lerp)
    group.current.scale.setScalar(scaleRef.current)
  })

  return (
    <group
      ref={group}
      rotation={[0, 0, visual.tilt]}
      onClick={(e) => {
        e.stopPropagation()
        select(planetId)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh ref={planetMesh}>
        <sphereGeometry args={[visual.radius, 64, 64]} />
        {visual.isStar ? (
          <meshBasicMaterial map={colorMap} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            map={colorMap}
            emissiveMap={colorMap}
            emissive="#ffffff"
            emissiveIntensity={emissiveBoost}
            roughness={0.88}
            metalness={0.05}
          />
        )}
      </mesh>

      {visual.isStar && <pointLight intensity={2.6} distance={14} decay={1.3} color="#ffd9a0" />}

      {visual.cloudsTexture && (
        <mesh ref={cloudsMesh} scale={1.02}>
          <sphereGeometry args={[visual.radius, 64, 64]} />
          <meshStandardMaterial
            color="#f2f7ff"
            alphaMap={cloudsMap}
            emissive="#cfe0ff"
            emissiveIntensity={0.4}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {ringGeometry && (
        <mesh geometry={ringGeometry} rotation={[1.28, 0.1, 0]}>
          <meshBasicMaterial map={ringMap} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      <PlanetHalo
        radius={visual.radius}
        color={visual.glowColor}
        spread={visual.isStar ? 3.8 : 3.1}
        intensity={visual.isStar ? 1.1 : 1.0}
      />
      {visual.isStar && <PlanetHalo radius={visual.radius} color="#ff9d4d" spread={5.2} intensity={0.5} />}
    </group>
  )
}
