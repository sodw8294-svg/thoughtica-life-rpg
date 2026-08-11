import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { SoundtrackTab } from '@/components/SoundtrackTab'
import { RelaxTab } from '@/components/RelaxTab'

interface NatureTabProps {
  onSoundscapeUse?: (name: string) => void
  onBreathingComplete?: () => void
}

/**
 * "Nature" — the flagship immersive tab. Combines ambient soundscapes with
 * the 4-7-8 breathing circle in one continuous, scrollable sanctuary.
 */
export function NatureTab({ onSoundscapeUse, onBreathingComplete }: NatureTabProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-2"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'var(--t-surface)', color: 'var(--t-accent)', border: '1px solid var(--t-border)' }}
        >
          <Leaf className="w-3.5 h-3.5" /> Nature Sanctuary
        </div>
        <h1
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' }}
        >
          Sound &amp; Breath
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--t-text-muted)' }}>
          Immerse yourself in ambient soundscapes, then settle into a guided 4-7-8 breath to restore calm.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-3xl border backdrop-blur-xl overflow-hidden shadow-xl"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      >
        <div style={{ height: 520 }} className="flex flex-col">
          <SoundtrackTab onPlay={onSoundscapeUse} />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border backdrop-blur-xl overflow-hidden shadow-xl"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      >
        <div style={{ minHeight: 560 }}>
          <RelaxTab onSessionComplete={onBreathingComplete} />
        </div>
      </motion.section>
    </div>
  )
}
