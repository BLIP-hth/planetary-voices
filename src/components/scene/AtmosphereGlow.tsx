import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

const GlowMaterialImpl = shaderMaterial(
  { color: new THREE.Color('#8ab4ff'), intensity: 1.0, opacity: 1.0 },
  /* vertex */
  `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* fragment */
  `
    uniform vec3 color;
    uniform float intensity;
    uniform float opacity;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
      // softer, more diffuse falloff so the halo reads as atmosphere, not a hard ring
      float glow = pow(rim, 3.4) * intensity;
      gl_FragColor = vec4(color, glow * opacity);
    }
  `
)

extend({ GlowMaterialImpl })

declare module '@react-three/fiber' {
  interface ThreeElements {
    glowMaterialImpl: ThreeElement<typeof GlowMaterialImpl>
  }
}

interface AtmosphereGlowProps {
  radius: number
  color: string
  intensity?: number
  opacity?: number
  scale?: number
}

export function AtmosphereGlow({ radius, color, intensity = 0.7, opacity = 1, scale = 1.28 }: AtmosphereGlowProps) {
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 48, 48]} />
      <glowMaterialImpl
        color={color}
        intensity={intensity}
        opacity={opacity}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
