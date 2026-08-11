/* ═══════════════════════════════════════════════════════════════
   XP / LEVELING SYSTEM
   Levels 1-50. XP required for level N -> N+1 is N * 200.
   Progress + badges persist to localStorage as part of AppState.
   ═══════════════════════════════════════════════════════════════ */

export const MAX_LEVEL = 50

/** Total cumulative XP required to REACH a given level (level 1 = 0 XP) */
export function xpForLevel(level: number): number {
  let total = 0
  for (let l = 1; l < level; l++) total += l * 200
  return total
}

export function levelFromXp(xp: number): number {
  let level = 1
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++
  return level
}

export function xpProgress(xp: number): { level: number; current: number; needed: number; pct: number } {
  const level = levelFromXp(xp)
  const floor = xpForLevel(level)
  const ceil = level >= MAX_LEVEL ? floor : xpForLevel(level + 1)
  const current = xp - floor
  const needed = ceil - floor
  const pct = needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100
  return { level, current, needed, pct }
}

export const XP_REWARDS = {
  journalEntry: 50,
  breathingComplete: 30,
  soundscapeUse: 20,
  detoxSession: 75,
  koraChat: 15,
  dailyStreak: 100,
} as const

export interface XpBadgeDef {
  id: string
  name: string
  description: string
  emoji: string
  check: (ctx: BadgeCheckContext) => boolean
}

export interface BadgeCheckContext {
  level: number
  xp: number
  streak: number
  journalCount: number
  breathingCount: number
  soundscapeCount: number
  detoxCount: number
  koraChatCount: number
}

export const ALL_XP_BADGES: XpBadgeDef[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Earned your very first XP.', emoji: '🌱', check: c => c.xp > 0 },
  { id: 'level-5', name: 'Rising Star', description: 'Reached Level 5.', emoji: '⭐', check: c => c.level >= 5 },
  { id: 'level-10', name: 'Ascendant', description: 'Reached Level 10.', emoji: '🌟', check: c => c.level >= 10 },
  { id: 'level-25', name: 'Luminary', description: 'Reached Level 25.', emoji: '💫', check: c => c.level >= 25 },
  { id: 'level-50', name: 'Enlightened', description: 'Reached the max Level 50.', emoji: '👑', check: c => c.level >= 50 },
  { id: 'streak-3', name: 'Building Momentum', description: '3-day streak.', emoji: '🔥', check: c => c.streak >= 3 },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day streak.', emoji: '🔥', check: c => c.streak >= 7 },
  { id: 'streak-30', name: 'Unstoppable', description: '30-day streak.', emoji: '🏆', check: c => c.streak >= 30 },
  { id: 'journal-1', name: 'First Reflection', description: 'Wrote your first journal entry.', emoji: '📓', check: c => c.journalCount >= 1 },
  { id: 'journal-10', name: 'Deep Thinker', description: 'Wrote 10 journal entries.', emoji: '📚', check: c => c.journalCount >= 10 },
  { id: 'breath-5', name: 'Breath of Life', description: 'Completed 5 breathing sessions.', emoji: '🧘', check: c => c.breathingCount >= 5 },
  { id: 'sound-5', name: 'Sound Explorer', description: 'Enjoyed 5 soundscapes.', emoji: '🎧', check: c => c.soundscapeCount >= 5 },
  { id: 'detox-1', name: 'Digital Detox', description: 'Completed your first detox session.', emoji: '📵', check: c => c.detoxCount >= 1 },
  { id: 'detox-10', name: 'Freedom Seeker', description: 'Completed 10 detox sessions.', emoji: '🛡️', check: c => c.detoxCount >= 10 },
  { id: 'kora-10', name: 'Kindred Spirits', description: 'Chatted with Kora 10 times.', emoji: '✨', check: c => c.koraChatCount >= 10 },
]
