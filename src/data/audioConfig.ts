import type { PlanetId } from './planetVisuals'

export interface RealAudioSource {
  kind: 'real'
  src: string
  label: string
  credit: string
  /** playback gain multiplier: faint recordings (e.g. Mars wind) need a boost */
  gain?: number
  /** filename offered by the download button */
  downloadName?: string
}

export interface SyntheticVoiceParams {
  kind: 'synthetic'
  label: string
  credit: string
  /** filtered noise bed */
  noiseColor: 'white' | 'pink'
  filterType: BiquadFilterType
  filterFreq: number
  filterQ: number
  filterLfoRate: number
  filterLfoDepth: number
  /** tonal layer */
  oscType: OscillatorType
  oscFreqs: number[]
  oscDetune: number
  oscGain: number
  /** slow amplitude breathing */
  ampLfoRate: number
  ampLfoDepth: number
  masterGain: number
}

export type AudioSource = RealAudioSource | SyntheticVoiceParams

export const AUDIO_CONFIG: Record<PlanetId, AudioSource> = {
  sun: {
    kind: 'real',
    src: '/audio/sun.mp3',
    label: 'Real data sonification',
    credit:
      'SOHO/MDI, A. Kosovichev (Stanford). The Sun genuinely "rings": helioseismology detects pressure (p-mode) waves resonating through it. This is that oscillation data from the ESA/NASA SOHO spacecraft, shifted up into the audible range.',
    gain: 1.6,
    downloadName: 'sun-helioseismology-soho.mp3',
  },
  mars: {
    kind: 'real',
    src: '/audio/mars-wind.mp3',
    label: 'Real recording',
    credit: 'NASA/JPL-Caltech: Perseverance rover SuperCam microphone, wind captured Sol 4 (Feb 2021). The Martian wind is genuinely faint, so playback is amplified.',
    gain: 4.5,
    downloadName: 'mars-wind-perseverance.mp3',
  },
  saturn: {
    kind: 'real',
    src: '/audio/saturn.mp3',
    label: 'Real data sonification',
    credit: 'NASA/JPL/University of Iowa: Cassini Radio & Plasma Wave Science instrument, Saturn Kilometric Radiation shifted into the audible range.',
    gain: 1.8,
    downloadName: 'saturn-radio-cassini.mp3',
  },
  mercury: {
    kind: 'synthetic',
    label: 'Synthesized: artistic interpretation',
    credit: 'Mercury has almost no atmosphere, so there is nothing to carry sound. This is an imagined soundscape built from its exosphere data and proximity to the Sun’s radio noise.',
    noiseColor: 'white',
    filterType: 'highpass',
    filterFreq: 2200,
    filterQ: 0.6,
    filterLfoRate: 0.05,
    filterLfoDepth: 400,
    oscType: 'sine',
    oscFreqs: [1400, 2600],
    oscDetune: 6,
    oscGain: 0.03,
    ampLfoRate: 0.09,
    ampLfoDepth: 0.6,
    masterGain: 0.18,
  },
  venus: {
    kind: 'real',
    src: '/audio/venus-radio-parker.mp3',
    label: 'Real data sonification',
    credit:
      "NASA Parker Solar Probe, FIELDS instrument. A natural radio emission from Venus's upper atmosphere, detected during the July 2020 flyby and sonified by NASA's Scientific Visualization Studio.",
    gain: 1.0,
    downloadName: 'venus-radio-parker-solar-probe.mp3',
  },
  earth: {
    kind: 'real',
    src: '/audio/earth-chorus-rbsp.mp3',
    label: 'Real data sonification',
    credit:
      "NASA Van Allen Probes, EMFISIS instrument (University of Iowa). Real ‘chorus’ plasma waves rippling through Earth's magnetosphere, recorded October 2012 and shifted into the audible range.",
    gain: 1.4,
    downloadName: 'earth-chorus-van-allen-probes.mp3',
  },
  jupiter: {
    kind: 'real',
    src: '/audio/jupiter.mp3',
    label: 'Real data sonification',
    credit: 'NASA: Cassini Radio & Plasma Wave Science instrument recorded plasma waves near Jupiter during its January 2001 flyby; radio frequencies shifted into the audible range.',
    gain: 1.5,
    downloadName: 'jupiter-plasma-cassini.mp3',
  },
  uranus: {
    kind: 'real',
    src: '/audio/uranus-voyager2.mp3',
    label: 'Real data sonification',
    credit:
      'NASA Voyager 2, Plasma Wave Subsystem (University of Iowa). Plasma waves recorded during the January 1986 Uranus flyby, shifted into the audible range.',
    gain: 0.7,
    downloadName: 'uranus-voyager-2-plasma-waves.mp3',
  },
  neptune: {
    kind: 'real',
    src: '/audio/neptune-voyager2.mp3',
    label: 'Real data sonification',
    credit:
      'NASA Voyager 2, Plasma Wave Subsystem (University of Iowa). Plasma waves recorded during the August 1989 Neptune flyby, shifted into the audible range.',
    gain: 0.4,
    downloadName: 'neptune-voyager-2-plasma-waves.mp3',
  },
}
