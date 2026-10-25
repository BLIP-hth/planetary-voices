export type PlanetId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'

export interface PlanetVisual {
  id: PlanetId
  order: number
  texture: string
  cloudsTexture?: string
  ringTexture?: string
  /** relative visual radius, NOT to true scale (true scale makes Mercury invisible next to Jupiter) */
  radius: number
  rotationSpeed: number
  tilt: number
  /** physically-tuned halo/atmosphere color for the 3D scene (kept muted on purpose) */
  glowColor: string
  /** vivid UI "exhibit room" color — floods the whole interface when this planet is selected */
  uiAccent: string
  /** readable glyph/text color to sit ON top of a uiAccent fill (light when the accent is dark) */
  uiInk?: string
  ringInnerScale?: number
  ringOuterScale?: number
  /** the Sun: self-lit (emissive), gets a large corona instead of standard shading */
  isStar?: boolean
  /** self-illumination from the color map, to lift a planet out of the dark (0-1) */
  emissiveBoost?: number
}

export const PLANET_VISUALS: Record<PlanetId, PlanetVisual> = {
  sun: {
    id: 'sun',
    order: -1,
    texture: '/textures/sun.jpg',
    radius: 1.95,
    rotationSpeed: 0.05,
    tilt: 0.12,
    glowColor: '#ffce7a',
    uiAccent: '#ffab1f',
    uiInk: '#1a1206',
    isStar: true,
  },
  mercury: {
    id: 'mercury',
    order: 0,
    texture: '/textures/mercury.jpg',
    radius: 0.55,
    rotationSpeed: 0.02,
    tilt: 0.001,
    glowColor: '#b8a58c',
    uiAccent: '#b9b2c4',
    uiInk: '#14131a',
  },
  venus: {
    id: 'venus',
    order: 1,
    texture: '/textures/venus.jpg',
    radius: 0.82,
    rotationSpeed: 0.015,
    tilt: 0.05,
    glowColor: '#e8c893',
    uiAccent: '#ffcb52',
    uiInk: '#1a1404',
  },
  earth: {
    id: 'earth',
    order: 2,
    texture: '/textures/earth.jpg',
    cloudsTexture: '/textures/earth_clouds.jpg',
    radius: 0.86,
    rotationSpeed: 0.12,
    tilt: 0.41,
    glowColor: '#6cc0ff',
    uiAccent: '#4aa8ff',
    uiInk: '#f2f8ff',
    emissiveBoost: 1.25,
  },
  mars: {
    id: 'mars',
    order: 3,
    texture: '/textures/mars.jpg',
    radius: 0.62,
    rotationSpeed: 0.11,
    tilt: 0.44,
    glowColor: '#e0704a',
    uiAccent: '#ff5638',
    uiInk: '#fff2ef',
  },
  jupiter: {
    id: 'jupiter',
    order: 4,
    texture: '/textures/jupiter.jpg',
    radius: 1.55,
    rotationSpeed: 0.28,
    tilt: 0.05,
    glowColor: '#e0b98f',
    uiAccent: '#e8925a',
    uiInk: '#1c1008',
  },
  saturn: {
    id: 'saturn',
    order: 5,
    texture: '/textures/saturn.jpg',
    ringTexture: '/textures/saturn_ring.png',
    radius: 1.35,
    rotationSpeed: 0.25,
    tilt: 0.47,
    glowColor: '#e8d6a8',
    uiAccent: '#f4d97a',
    uiInk: '#1a1604',
    ringInnerScale: 1.4,
    ringOuterScale: 2.4,
  },
  uranus: {
    id: 'uranus',
    order: 6,
    texture: '/textures/uranus.jpg',
    radius: 1.05,
    rotationSpeed: 0.18,
    tilt: 1.71,
    glowColor: '#9fe0e8',
    uiAccent: '#63e6df',
    uiInk: '#04211f',
  },
  neptune: {
    id: 'neptune',
    order: 7,
    texture: '/textures/neptune.jpg',
    radius: 1.02,
    rotationSpeed: 0.18,
    tilt: 0.49,
    glowColor: '#5b7fe8',
    uiAccent: '#5666ff',
    uiInk: '#eef0ff',
  },
}

export const PLANET_ORDER: PlanetId[] = [
  'sun',
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
]
