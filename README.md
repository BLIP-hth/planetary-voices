# Planetary Voices

**Hear the Solar System.** An interactive 3D tour of the solar system's real sounds, science, and myth, with genuine NASA recordings for 8 of 9 worlds.

Live site: https://planetary-voices.vercel.app

## What it does

- A 3D solar system you can explore with the mouse or keyboard.
- Each world has an info panel and a sound, using real space recordings (in `public/audio/`, e.g. Voyager 2, Parker Solar Probe, and Van Allen Probes data).
- A share button, and a few hidden easter eggs.

## Tech stack

- [React](https://react.dev/) 19 + TypeScript
- [Vite](https://vite.dev/)
- [Three.js](https://threejs.org/) via React Three Fiber and Drei
- Framer Motion (animation) and Zustand (state)
- Hosted on Vercel

## Run it locally

You need [Node.js](https://nodejs.org/) installed.

```
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

To make a production build: `npm run build` (output goes to `dist/`).

---

Built by Han Thu Hein with AI coding assistants.
