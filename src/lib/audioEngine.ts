import type { SyntheticVoiceParams } from '../data/audioConfig'

const FADE = 0.8

function makeNoiseBuffer(ctx: BaseAudioContext, color: 'white' | 'pink', seconds = 4) {
  const bufferSize = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  if (color === 'white') {
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      b6 = white * 0.115926
      data[i] = pink * 0.11
    }
  }
  return buffer
}

interface ActiveVoice {
  stop: () => void
}

export class PlanetAudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private masterGain: GainNode | null = null
  private active: ActiveVoice | null = null
  private currentId: string | null = null
  /** the element currently owning playback, so a delayed stop-fade of an earlier
      play doesn't pause/disconnect an element a newer replay has taken over */
  private activeEl: HTMLMediaElement | null = null
  /** one MediaElementSource may be created per element, ever — cache them */
  private elementSources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>()

  private ensureContext() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.75
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 1
      this.masterGain.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  getAnalyser() {
    this.ensureContext()
    return this.analyser!
  }

  get isPlaying() {
    return this.active !== null
  }

  get playingId() {
    return this.currentId
  }

  private getElementSource(el: HTMLMediaElement) {
    let src = this.elementSources.get(el)
    if (!src) {
      src = this.ensureContext().createMediaElementSource(el)
      this.elementSources.set(el, src)
    }
    return src
  }

  /** Play a real recording via an <audio> element, routed through the analyser + a boost gain. */
  async playElement(id: string, el: HTMLMediaElement, boost = 1) {
    const ctx = this.ensureContext()
    this.stop()
    this.currentId = id
    this.activeEl = el

    const source = this.getElementSource(el)
    const gain = ctx.createGain()
    gain.gain.value = 0.0001
    try {
      source.disconnect()
    } catch {
      /* not connected yet */
    }
    source.connect(gain)
    gain.connect(this.masterGain!)

    el.loop = true
    try {
      el.currentTime = 0
    } catch {
      /* ignore */
    }
    await el.play()

    const now = ctx.currentTime
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(Math.max(boost, 0.001), now + FADE)

    this.active = {
      stop: () => {
        const t = ctx.currentTime
        gain.gain.cancelScheduledValues(t)
        gain.gain.setValueAtTime(gain.gain.value, t)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + FADE)
        setTimeout(() => {
          // only tear down the shared element/source if a newer playback hasn't
          // already taken this element over (the "play it again" double-tap case)
          if (this.activeEl !== el) {
            el.pause()
            try {
              source.disconnect()
            } catch {
              /* ignore */
            }
          }
          try {
            gain.disconnect()
          } catch {
            /* ignore */
          }
        }, FADE * 1000 + 60)
      },
    }
  }

  /** Play a procedurally-synthesized soundscape. */
  playSynthetic(id: string, params: SyntheticVoiceParams) {
    const ctx = this.ensureContext()
    this.stop()
    this.currentId = id

    const gain = ctx.createGain()
    gain.gain.value = 0
    const now = ctx.currentTime
    gain.gain.linearRampToValueAtTime(1, now + FADE)
    this.active = this.buildSynthVoice(ctx, gain, params)
  }

  private buildSynthVoice(ctx: AudioContext, gain: GainNode, p: SyntheticVoiceParams): ActiveVoice {
    const nodes: AudioNode[] = []

    const noiseSrc = ctx.createBufferSource()
    noiseSrc.buffer = makeNoiseBuffer(ctx, p.noiseColor)
    noiseSrc.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = p.filterType
    filter.frequency.value = p.filterFreq
    filter.Q.value = p.filterQ
    const filterLfo = ctx.createOscillator()
    filterLfo.frequency.value = p.filterLfoRate
    const filterLfoGain = ctx.createGain()
    filterLfoGain.gain.value = p.filterLfoDepth
    filterLfo.connect(filterLfoGain)
    filterLfoGain.connect(filter.frequency)

    const noiseGain = ctx.createGain()
    noiseGain.gain.value = p.masterGain
    noiseSrc.connect(filter)
    filter.connect(noiseGain)

    // amplitude breathing LFO applied to a shared bus
    const bus = ctx.createGain()
    noiseGain.connect(bus)

    const oscGainNode = ctx.createGain()
    oscGainNode.gain.value = p.oscGain
    oscGainNode.connect(bus)
    const oscs: OscillatorNode[] = []
    p.oscFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = p.oscType
      osc.frequency.value = f
      osc.detune.value = i % 2 === 0 ? p.oscDetune : -p.oscDetune
      osc.connect(oscGainNode)
      osc.start()
      oscs.push(osc)
    })

    const ampLfo = ctx.createOscillator()
    ampLfo.frequency.value = p.ampLfoRate
    const ampLfoGain = ctx.createGain()
    ampLfoGain.gain.value = p.ampLfoDepth
    const ampBase = ctx.createConstantSource()
    ampBase.offset.value = 1 - p.ampLfoDepth * 0.5
    ampLfo.connect(ampLfoGain)
    ampLfoGain.connect(bus.gain)
    ampBase.connect(bus.gain)
    ampLfo.start()
    ampBase.start()

    bus.connect(gain)
    gain.connect(this.masterGain!)

    noiseSrc.start()
    filterLfo.start()
    nodes.push(noiseSrc, filter, filterLfo, filterLfoGain, noiseGain, bus, oscGainNode, ampLfo, ampLfoGain, ampBase, gain)

    return {
      stop: () => {
        const t = ctx.currentTime
        gain.gain.cancelScheduledValues(t)
        gain.gain.setValueAtTime(gain.gain.value, t)
        gain.gain.linearRampToValueAtTime(0, t + FADE)
        setTimeout(() => {
          noiseSrc.stop()
          oscs.forEach((o) => o.stop())
          filterLfo.stop()
          ampLfo.stop()
          ampBase.stop()
          nodes.forEach((n) => n.disconnect())
        }, FADE * 1000 + 60)
      },
    }
  }

  stop() {
    if (this.active) {
      this.active.stop()
      this.active = null
    }
    this.currentId = null
    this.activeEl = null
  }
}

export const audioEngine = new PlanetAudioEngine()

/**
 * Render a synthesized voice to a downloadable WAV clip offline, so synthetic
 * planets get a real download just like the recorded ones. Mirrors the live
 * graph in buildSynthVoice, with a short fade in/out for a clean loop.
 */
export async function renderSyntheticWav(p: SyntheticVoiceParams, seconds = 8): Promise<Blob> {
  const sampleRate = 44100
  const OfflineCtx =
    window.OfflineAudioContext ||
    (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext
  const ctx = new OfflineCtx(1, Math.floor(sampleRate * seconds), sampleRate)

  const gain = ctx.createGain()
  gain.connect(ctx.destination)

  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = makeNoiseBuffer(ctx, p.noiseColor, seconds + 1)
  noiseSrc.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = p.filterType
  filter.frequency.value = p.filterFreq
  filter.Q.value = p.filterQ
  const filterLfo = ctx.createOscillator()
  filterLfo.frequency.value = p.filterLfoRate
  const filterLfoGain = ctx.createGain()
  filterLfoGain.gain.value = p.filterLfoDepth
  filterLfo.connect(filterLfoGain)
  filterLfoGain.connect(filter.frequency)

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = p.masterGain
  noiseSrc.connect(filter)
  filter.connect(noiseGain)

  const bus = ctx.createGain()
  noiseGain.connect(bus)

  const oscGainNode = ctx.createGain()
  oscGainNode.gain.value = p.oscGain
  oscGainNode.connect(bus)
  p.oscFreqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    osc.type = p.oscType
    osc.frequency.value = f
    osc.detune.value = i % 2 === 0 ? p.oscDetune : -p.oscDetune
    osc.connect(oscGainNode)
    osc.start()
  })

  const ampLfo = ctx.createOscillator()
  ampLfo.frequency.value = p.ampLfoRate
  const ampLfoGain = ctx.createGain()
  ampLfoGain.gain.value = p.ampLfoDepth
  const ampBase = ctx.createConstantSource()
  ampBase.offset.value = 1 - p.ampLfoDepth * 0.5
  ampLfo.connect(ampLfoGain)
  ampLfoGain.connect(bus.gain)
  ampBase.connect(bus.gain)
  ampLfo.start()
  ampBase.start()

  bus.connect(gain)

  // gentle fade in/out so the clip has no clicks at the edges
  gain.gain.setValueAtTime(0.0001, 0)
  gain.gain.linearRampToValueAtTime(1, 0.4)
  gain.gain.setValueAtTime(1, seconds - 0.5)
  gain.gain.linearRampToValueAtTime(0.0001, seconds)

  noiseSrc.start()
  filterLfo.start()

  const rendered = await ctx.startRendering()
  return encodeWav(rendered)
}

/** Encode a mono AudioBuffer as a 16-bit PCM WAV blob. */
function encodeWav(buffer: AudioBuffer): Blob {
  const samples = buffer.getChannelData(0)
  const n = samples.length
  const sr = buffer.sampleRate
  const dataSize = n * 2
  const ab = new ArrayBuffer(44 + dataSize)
  const view = new DataView(ab)
  const writeStr = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sr, true)
  view.setUint32(28, sr * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)
  let off = 44
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    off += 2
  }
  return new Blob([ab], { type: 'audio/wav' })
}
