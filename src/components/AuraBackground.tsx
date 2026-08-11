import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface AuraBackgroundProps {
  colors: [string, string, string, string]
  /** 0-360 user-selected hue offset, rotates the whole aura palette */
  hueOffset?: number
}

/**
 * Full-viewport, fixed, animated ambient background — several large blurred
 * color blobs that slowly drift and a slow-rotating conic "color wheel"
 * overlay. Sits behind all app content (z-index -10). Colors come from the
 * active theme; `hueOffset` lets the user personalize the aura further.
 */
export function AuraBackground({ colors, hueOffset = 0 }: AuraBackgroundProps) {
  const blobs = useMemo(
    () => [
      { color: colors[0], top: '5%', left: '10%', size: 620, dur: 26 },
      { color: colors[1], top: '55%', left: '65%', size: 700, dur: 32 },
      { color: colors[2], top: '70%', left: '5%', size: 520, dur: 22 },
      { color: colors[3], top: '10%', left: '70%', size: 560, dur: 28 },
    ],
    [colors]
  )

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: 'var(--t-bg)' }}
      aria-hidden
    >
      {/* Slow rotating color-wheel conic overlay */}
      <motion.div
        className="absolute -inset-[25%]"
        style={{
          background: `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]}, ${colors[0]})`,
          filter: `hue-rotate(${hueOffset}deg) blur(90px)`,
          opacity: 0.35,
          mixBlendMode: 'screen',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      />

      {/* Drifting blurred blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color}66 0%, ${b.color}00 70%)`,
            filter: `hue-rotate(${hueOffset}deg) blur(10px)`,
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Subtle vignette + grain-like overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, transparent 0%, transparent 40%, var(--t-bg) 100%)',
          opacity: 0.9,
        }}
      />
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ background: 'var(--t-bg)', opacity: 0.15 }}
      />
    </div>
  )
}
