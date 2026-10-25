import { useProgress } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import './LoadingScreen.css'

export function LoadingScreen() {
  const { active, progress } = useProgress()

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="loading__orbit">
            <div className="loading__sun" />
            <div className="loading__planet" />
          </div>
          <p className="loading__title">Planetary Voices</p>
          <div className="loading__bar">
            <div className="loading__fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="loading__pct">{Math.round(progress)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
