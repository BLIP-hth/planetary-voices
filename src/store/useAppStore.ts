import { create } from 'zustand'
import { PLANET_ORDER, type PlanetId } from '../data/planetVisuals'

/** the hidden image reveals: type the phrase (desktop) or tap the title 5 times
    (mobile) */
export type EggId = 'golden-record' | 'pale-blue-dot'

interface AppState {
  selected: PlanetId | null
  /** the planet the mobile orbit-dial is currently centered on (browsing state,
      separate from `selected` which opens the info panel + plays audio) */
  focused: PlanetId
  hovered: PlanetId | null
  /** the planet whose audio is currently playing (drives the "now playing" cue);
      mirrored from VoiceNote's play state */
  nowPlaying: PlanetId | null
  warp: boolean
  toast: string | null
  /** which hidden image reveal is open, if any (typed phrase on desktop, secret
      tap on mobile) */
  eggImage: EggId | null
  select: (id: PlanetId | null) => void
  setFocused: (id: PlanetId) => void
  hover: (id: PlanetId | null) => void
  setNowPlaying: (id: PlanetId | null) => void
  selectRelative: (delta: number) => void
  triggerWarp: () => void
  showToast: (msg: string) => void
  openEggImage: (id: EggId) => void
  closeEggImage: () => void
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
let warpTimer: ReturnType<typeof setTimeout> | undefined

export const useAppStore = create<AppState>((set) => ({
  selected: null,
  focused: PLANET_ORDER[0],
  hovered: null,
  nowPlaying: null,
  warp: false,
  toast: null,
  eggImage: null,
  // selecting a planet also focuses it, so the dial and panel stay in sync
  select: (id) => set(id ? { selected: id, focused: id } : { selected: id }),
  setFocused: (id) => set({ focused: id }),
  hover: (id) => set({ hovered: id }),
  setNowPlaying: (id) => set({ nowPlaying: id }),
  selectRelative: (delta) =>
    set((s) => {
      const ref = s.selected ?? s.focused
      const cur = PLANET_ORDER.indexOf(ref)
      const next = (cur + delta + PLANET_ORDER.length) % PLANET_ORDER.length
      const id = PLANET_ORDER[next]
      return { selected: id, focused: id }
    }),
  triggerWarp: () => {
    set({ warp: true })
    clearTimeout(warpTimer)
    warpTimer = setTimeout(() => set({ warp: false }), 4200)
  },
  showToast: (msg) => {
    set({ toast: msg })
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => set({ toast: null }), 3600)
  },
  openEggImage: (id) => set({ eggImage: id }),
  closeEggImage: () => set({ eggImage: null }),
}))

// dev-only: expose the store for quick manual/automated testing in the console
if (import.meta.env.DEV) {
  ;(window as unknown as { __store?: typeof useAppStore }).__store = useAppStore
}
