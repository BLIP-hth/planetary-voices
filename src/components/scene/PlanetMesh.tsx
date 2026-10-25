import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { PlanetVisual } from '../../data/planetVisuals'
import { PLANETS } from '../../data/planets'
import { PlanetHalo } from './PlanetHalo'
import { useAppStore } from '../../store/useAppStore'

interface PlanetMeshProps {
  visual: PlanetVisual
  basePosition: [number, number, number]
  phase: number
}

const IDLE_POS = new THREE.Vector3()
const SELECTED_POS = new THREE.Vector3(0, 0.15, 3.4)
const tmpVec = new THREE.Vector3()

// respect the OS "reduce motion" setting for the autonomous spin/float
const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function PlanetMesh({ visual, basePosition, phase }: PlanetMeshProps) {
  const group = useRef<THREE.Group>(null!)
  const planetMesh = useRef<THREE.Mesh>(null!)
  const cloudsMesh = useRef<THREE.Mesh>(null!)
  const ringMesh = useRef<THREE.Mesh>(null!)
  const materialsRef = useRef<THREE.Material[]>([])
  const [hovered, setHovered] = useState(false)

  const selected = useAppStore((s) => s.selected)
  const select = useAppStore((s) => s.select)
  const hover = useAppStore((s) => s.hover)
  const warp = useAppStore((s) => s.warp)

  const isSelected = selected === visual.id
  const isDimmed = selected !== null && !isSelected

  const [colorMap, cloudsMap, ringMap] = useTexture(
    [visual.texture, visual.cloudsTexture ?? visual.texture, visual.ringTexture ?? visual.texture]
  )
  useMemo(() => {
    ;[colorMap, cloudsMap, ringMap].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    })
  }, [colorMap, cloudsMap, ringMap])

  // Ring geometry with radial UVs: the Solar System Scope ring texture is a
  // radial strip, so we remap u -> distance from centre. Default RingGeometry
  // UVs project it as a square, which smears the bands into wonky lines.
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
  }, [visual.radius, visual.ringInnerScale, visual.ringOuterScale, visual.ringTexture])

  const emissiveBoost = visual.emissiveBoost ?? (visual.isStar ? 0 : 0.16)

  const opacityRef = useRef(1)
  // scale is a plain multiplier (1 = natural size). The sphere geometry already
  // carries visual.radius, so multiplying by radius again would render at radius²
  // and push large bodies (the Sun) off-screen.
  const scaleRef = useRef(1)
  const currentPos = useRef(new THREE.Vector3(...basePosition))

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    const spin = REDUCED_MOTION ? 0 : visual.rotationSpeed * (warp ? 9 : 1)
    planetMesh.current.rotation.y += spin * delta
    if (cloudsMesh.current) cloudsMesh.current.rotation.y += spin * delta * 1.6

    const floatY = REDUCED_MOTION ? 0 : Math.sin(t * 0.6 + phase) * 0.12
    IDLE_POS.set(basePosition[0], basePosition[1] + floatY, basePosition[2])

    let target: THREE.Vector3
    let targetScale: number
    let targetOpacity: number

    if (isSelected) {
      target = SELECTED_POS
      targetScale = 2.2
      targetOpacity = 1
    } else if (isDimmed) {
      tmpVec.set(basePosition[0] * 2.2 + (basePosition[0] >= 0 ? 3 : -3), basePosition[1] - 1.4, -6)
      target = tmpVec
      targetScale = 0.55
      targetOpacity = 0
    } else {
      target = IDLE_POS
      targetScale = 1
      targetOpacity = 1
    }

    const lerpSpeed = 1 - Math.pow(0.001, delta)
    currentPos.current.lerp(target, lerpSpeed)
    group.current.position.copy(currentPos.current)

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, lerpSpeed)
    const hoverBoost = hovered && !selected ? 1.08 : 1
    group.current.scale.setScalar(scaleRef.current * hoverBoost)

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, lerpSpeed)
    materialsRef.current.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial
      mat.transparent = true
      mat.opacity = opacityRef.current
    })

    if (ringMesh.current) {
      const ringMat = ringMesh.current.material as THREE.MeshBasicMaterial
      ringMat.opacity = opacityRef.current
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (isDimmed) return
    select(isSelected ? null : visual.id)
  }

  const name = PLANETS[visual.id].name

  return (
    <group
      ref={group}
      position={basePosition}
      rotation={[0, 0, visual.tilt]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (!selected) {
          setHovered(true)
          hover(visual.id)
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        hover(null)
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh ref={planetMesh}>
        <sphereGeometry args={[visual.radius, 64, 64]} />
        {visual.isStar ? (
          <meshBasicMaterial
            ref={(m) => {
              if (m) materialsRef.current[0] = m
            }}
            map={colorMap}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial
            ref={(m) => {
              if (m) materialsRef.current[0] = m
            }}
            map={colorMap}
            emissiveMap={colorMap}
            emissive={'#ffffff'}
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
          {/* clouds texture is white-on-black; use it as an alpha mask so only
              the clouds show (as bright white) instead of darkening the planet */}
          <meshStandardMaterial
            ref={(m) => {
              if (m) materialsRef.current[1] = m
            }}
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
        <mesh ref={ringMesh} geometry={ringGeometry} rotation={[1.28, 0.1, 0]}>
          <meshBasicMaterial map={ringMap} transparent side={THREE.DoubleSide} depthWrite={false} opacity={1} />
        </mesh>
      )}

      <PlanetHalo
        radius={visual.radius}
        color={visual.glowColor}
        spread={visual.isStar ? 3.8 : 3.1}
        intensity={hovered && !selected ? 1.4 : isSelected ? 1.15 : 0.92}
        pulse={!selected && !hovered}
        phase={phase}
      />
      {visual.isStar && (
        <PlanetHalo radius={visual.radius} color="#ff9d4d" spread={5.2} intensity={0.5} />
      )}

      {hovered && !selected && (
        <Html position={[0, visual.radius + 0.5, 0]} center zIndexRange={[60, 0]} className="planet-label-anchor">
          <span className="planet-label">{name}</span>
        </Html>
      )}
    </group>
  )
}
