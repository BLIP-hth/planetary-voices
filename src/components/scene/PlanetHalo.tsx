import { useRef } from 'react'
import { Billboard } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame, type ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

// Soft radial-gradient halo — a camera-facing plane that fades smoothly to
// transparent with no hard edge, so it reads as a fluid atmospheric glow
// rather than a rigid bubble around the planet.
const HaloMaterialImpl = shaderMaterial(
  { uColor: new THREE.Color('#8ab4ff'), uIntensity: 1.0, uCore: 0.34 },
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uCore;
    varying vec2 vUv;
    void main() {
      float d = distance(vUv, vec2(0.5)) * 2.0;           // 0 center -> 1 edge
      float glow = 1.0 - smoothstep(0.0, 1.0, d);          // smooth radial falloff
      glow = pow(glow, 2.4);
      // gentle brighter core, then long soft tail
      float core = smoothstep(uCore, 0.0, d) * 0.5;
      float a = clamp((glow + core) * uIntensity, 0.0, 1.0);
      gl_FragColor = vec4(uColor, a);
    }
  `
)

extend({ HaloMaterialImpl })

declare module '@react-three/fiber' {
  interface ThreeElements {
    haloMaterialImpl: ThreeElement<typeof HaloMaterialImpl>
  }
}

// respect the OS "reduce motion" setting for the idle breathing pulse
const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface PlanetHaloProps {
  radius: number
  color: string
  /** halo diameter as a multiple of planet radius */
  spread?: number
  intensity?: number
  /** gentle idle "breathing" so the planet reads as alive/clickable on the landing screen */
  pulse?: boolean
  /** per-planet phase offset so they don't all breathe in sync */
  phase?: number
}

export function PlanetHalo({ radius, color, spread = 3.2, intensity = 0.9, pulse = false, phase = 0 }: PlanetHaloProps) {
  const matRef = useRef<THREE.ShaderMaterial & { uIntensity: number }>(null!)
  const target = useRef(intensity)
  target.current = intensity
  // the damped base intensity, kept separate so the pulse can ride on top of it
  const baseRef = useRef(intensity)

  // smoothly ease intensity changes (hover / select) so the glow "breathes",
  // plus a subtle idle sine pulse when `pulse` is on (uniform-only, no re-render)
  useFrame((state, delta) => {
    if (!matRef.current) return
    baseRef.current = THREE.MathUtils.damp(baseRef.current, target.current, 6, delta)
    let v = baseRef.current
    if (pulse && !REDUCED_MOTION) {
      v += Math.sin(state.clock.elapsedTime * 1.1 + phase) * 0.12
    }
    matRef.current.uniforms.uIntensity.value = v
  })

  const size = radius * spread
  return (
    <Billboard>
      {/* non-raycastable so the halo never intercepts clicks meant for a planet */}
      <mesh raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <haloMaterialImpl
          ref={matRef}
          uColor={new THREE.Color(color)}
          uIntensity={intensity}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  )
}
