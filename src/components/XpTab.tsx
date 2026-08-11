import { motion } from 'framer-motion'
import { Trophy, Flame, Star, Lock } from 'lucide-react'
import { xpProgress, ALL_XP_BADGES, MAX_LEVEL, type BadgeCheckContext } from '@/lib/xp'

interface XpTabProps {
  xp: number
  streak: number
  badgeCtx: BadgeCheckContext
  todayXp: number
}

export function XpTab({ xp, streak, badgeCtx, todayXp }: XpTabProps) {
  const { level, current, needed, pct } = xpProgress(xp)
  const unlockedBadges = ALL_XP_BADGES.filter(b => b.check(badgeCtx))
  const lockedBadges = ALL_XP_BADGES.filter(b => !b.check(badgeCtx))

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-2"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'var(--t-surface)', color: 'var(--t-accent)', border: '1px solid var(--t-border)' }}
        >
          <Trophy className="w-3.5 h-3.5" /> Progress
        </div>
        <h1
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' }}
        >
          Your Journey
        </h1>
      </motion.header>

      {/* Level card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border backdrop-blur-xl p-6 shadow-xl text-center relative overflow-hidden"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      >
        <motion.div
          className="absolute -inset-x-10 -top-20 h-40 rounded-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          initial={{ scale: 0.7, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mx-auto mb-3 w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl relative z-10"
          style={{
            background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))',
            color: 'var(--t-on-accent)',
          }}
        >
          {level}
        </motion.div>
        <p className="text-lg font-bold relative z-10" style={{ color: 'var(--t-text)' }}>
          Level {level} {level >= MAX_LEVEL && '· Max'}
        </p>
        <p className="text-xs relative z-10" style={{ color: 'var(--t-text-muted)' }}>
          {current} / {needed || '—'} XP to next level
        </p>

        <div className="mt-4 h-3 rounded-full overflow-hidden relative z-10" style={{ background: 'var(--t-surface-2)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--t-accent), var(--t-accent-2))' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 relative z-10">
          <div className="rounded-2xl p-3" style={{ background: 'var(--t-surface-2)' }}>
            <p className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>{xp}</p>
            <p className="text-[10px]" style={{ color: 'var(--t-text-muted)' }}>Total XP</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: 'var(--t-surface-2)' }}>
            <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: 'var(--t-text)' }}>
              <Flame className="w-4 h-4 text-orange-400" />{streak}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--t-text-muted)' }}>Day Streak</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: 'var(--t-surface-2)' }}>
            <p className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>+{todayXp}</p>
            <p className="text-[10px]" style={{ color: 'var(--t-text-muted)' }}>XP Today</p>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--t-text)' }}>
          <Star className="w-4 h-4" style={{ color: 'var(--t-accent)' }} /> Badges ({unlockedBadges.length}/{ALL_XP_BADGES.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {unlockedBadges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border p-4 text-center backdrop-blur-xl"
              style={{ background: 'var(--t-surface)', borderColor: 'var(--t-accent)' }}
            >
              <div className="text-3xl mb-1">{b.emoji}</div>
              <p className="text-xs font-semibold" style={{ color: 'var(--t-text)' }}>{b.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{b.description}</p>
            </motion.div>
          ))}
          {lockedBadges.map(b => (
            <div
              key={b.id}
              className="rounded-2xl border p-4 text-center opacity-50"
              style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
            >
              <div className="text-3xl mb-1 grayscale flex items-center justify-center gap-1">
                <Lock className="w-5 h-5" style={{ color: 'var(--t-text-muted)' }} />
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--t-text-muted)' }}>{b.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
