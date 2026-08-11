import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Sparkles, Wind, ShieldOff, BookOpen, Trophy, Gem, Settings as SettingsIcon,
} from 'lucide-react'

import { AuraBackground } from '@/components/AuraBackground'
import { TopTabBar, type TabDef } from '@/components/TopTabBar'
import { NatureTab } from '@/components/NatureTab'
import { RelaxTab } from '@/components/RelaxTab'
import { DetoxTab } from '@/components/DetoxTab'
import { KoraTab, type KoraMessage } from '@/components/KoraTab'
import { JournalTab, type JournalEntry } from '@/components/JournalTab'
import { XpTab } from '@/components/XpTab'
import { PricingTab } from '@/components/PricingTab'
import { ThemesTab } from '@/components/ThemesTab'
import { getTheme, DEFAULT_THEME_ID, themeToCssVars } from '@/lib/themes'
import { XP_REWARDS, xpProgress } from '@/lib/xp'
import type { RpgContext } from '@/lib/companion'

/* ═══════════════════════════════════════════════════════════════
   TYPES & DEFAULTS
   ═══════════════════════════════════════════════════════════════ */

type Tier = 'free' | 'pro'
type TabId = 'nature' | 'relax' | 'detox' | 'kora' | 'journal' | 'xp' | 'pricing' | 'settings'

interface AppState {
  activeTab: TabId
  tier: Tier
  themeId: string
  unlockedThemeIds: string[]
  auraHue: number
  xp: number
  streak: number
  lastActiveDate: string | null
  todayXp: number
  todayXpDate: string
  journalEntries: JournalEntry[]
  koraMessages: KoraMessage[]
  journalCount: number
  breathingCount: number
  soundscapeCount: number
  detoxCount: number
  koraChatCount: number
}

const STORAGE_KEY = 'thoughtica-v2-state'
const USER_ID = 'thoughtica-local-user'

const TABS: TabDef[] = [
  { id: 'nature', label: 'Nature', icon: Leaf, emoji: '🌿' },
  { id: 'kora', label: 'Kora', icon: Sparkles, emoji: '🤖' },
  { id: 'relax', label: 'Relax', icon: Wind, emoji: '🧘' },
  { id: 'detox', label: 'Detox', icon: ShieldOff, emoji: '📵' },
  { id: 'journal', label: 'Journal', icon: BookOpen, emoji: '📓' },
  { id: 'xp', label: 'XP', icon: Trophy, emoji: '🏆' },
  { id: 'pricing', label: 'Pricing', icon: Gem, emoji: '💎' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, emoji: '⚙️' },
]

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function getDefaultState(): AppState {
  return {
    activeTab: 'nature',
    tier: 'free',
    themeId: DEFAULT_THEME_ID,
    unlockedThemeIds: [],
    auraHue: 0,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    todayXp: 0,
    todayXpDate: todayStr(),
    journalEntries: [],
    koraMessages: [],
    journalCount: 0,
    breathingCount: 0,
    soundscapeCount: 0,
    detoxCount: 0,
    koraChatCount: 0,
  }
}

function loadState(): AppState {
  if (typeof window === 'undefined') return getDefaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    return { ...getDefaultState(), ...JSON.parse(raw) }
  } catch {
    return getDefaultState()
  }
}

export const Route = createFileRoute('/')({
  component: ThoughticaApp,
})

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */

function ThoughticaApp() {
  const [state, setState] = useState<AppState>(() => getDefaultState())
  const hydrated = useRef(false)

  // Hydrate from localStorage + run the daily-streak check exactly once on mount
  // (avoids SSR/client mismatch — localStorage only exists client-side).
  useEffect(() => {
    const loaded = loadState()
    const today = todayStr()

    if (loaded.lastActiveDate === today) {
      setState(loaded)
      hydrated.current = true
      return
    }

    let nextStreak = 1
    let bonusXp = 0
    if (loaded.lastActiveDate) {
      const last = new Date(loaded.lastActiveDate)
      const diffDays = Math.round((new Date(today).getTime() - last.getTime()) / 86400000)
      if (diffDays === 1) {
        nextStreak = loaded.streak + 1
        bonusXp = XP_REWARDS.dailyStreak
      } else if (diffDays <= 0) {
        nextStreak = loaded.streak
      }
    }

    setState({
      ...loaded,
      streak: nextStreak,
      lastActiveDate: today,
      xp: loaded.xp + bonusXp,
      todayXp: bonusXp,
      todayXpDate: today,
    })
    hydrated.current = true
  }, [])

  // Persist to localStorage on every change (once hydrated)
  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // no-op
    }
  }, [state])

  const awardXp = useCallback((amount: number) => {
    const today = todayStr()
    setState(prev => {
      const dateChanged = prev.todayXpDate !== today
      return {
        ...prev,
        xp: prev.xp + amount,
        todayXp: dateChanged ? amount : prev.todayXp + amount,
        todayXpDate: today,
      }
    })
  }, [])

  const setActiveTab = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeTab: id as TabId }))
  }, [])

  const theme = useMemo(() => getTheme(state.themeId), [state.themeId])
  const cssVars = useMemo(() => themeToCssVars(theme), [theme])

  const rpgContext: RpgContext = useMemo(
    () => ({
      level: xpProgress(state.xp).level,
      xp: state.xp,
      streak: state.streak,
      activeQuestNames: [],
      recentBadgeNames: [],
    }),
    [state.xp, state.streak]
  )

  const badgeCtx = useMemo(
    () => ({
      level: xpProgress(state.xp).level,
      xp: state.xp,
      streak: state.streak,
      journalCount: state.journalCount,
      breathingCount: state.breathingCount,
      soundscapeCount: state.soundscapeCount,
      detoxCount: state.detoxCount,
      koraChatCount: state.koraChatCount,
    }),
    [state]
  )

  const goToPricing = useCallback(() => setActiveTab('pricing'), [setActiveTab])

  const renderTab = () => {
    switch (state.activeTab) {
      case 'nature':
        return (
          <NatureTab
            onSoundscapeUse={() => {
              setState(prev => ({ ...prev, soundscapeCount: prev.soundscapeCount + 1 }))
              awardXp(XP_REWARDS.soundscapeUse)
            }}
            onBreathingComplete={() => {
              setState(prev => ({ ...prev, breathingCount: prev.breathingCount + 1 }))
              awardXp(XP_REWARDS.breathingComplete)
            }}
          />
        )
      case 'relax':
        return (
          <div className="max-w-3xl mx-auto rounded-3xl border backdrop-blur-xl shadow-xl overflow-hidden" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', minHeight: 560 }}>
            <RelaxTab
              onSessionComplete={() => {
                setState(prev => ({ ...prev, breathingCount: prev.breathingCount + 1 }))
                awardXp(XP_REWARDS.breathingComplete)
              }}
            />
          </div>
        )
      case 'detox':
        return (
          <div className="max-w-3xl mx-auto rounded-3xl border backdrop-blur-xl shadow-xl overflow-hidden" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', minHeight: 700 }}>
            <DetoxTab
              onDetoxSession={() => {
                setState(prev => ({ ...prev, detoxCount: prev.detoxCount + 1 }))
                awardXp(XP_REWARDS.detoxSession)
              }}
            />
          </div>
        )
      case 'kora':
        return (
          <KoraTab
            userId={USER_ID}
            messages={state.koraMessages}
            onMessagesChange={msgs => setState(prev => ({ ...prev, koraMessages: msgs }))}
            rpgContext={rpgContext}
            onChatTurn={() => {
              setState(prev => ({ ...prev, koraChatCount: prev.koraChatCount + 1 }))
              awardXp(XP_REWARDS.koraChat)
            }}
          />
        )
      case 'journal':
        return (
          <JournalTab
            entries={state.journalEntries}
            onEntriesChange={entries => setState(prev => ({ ...prev, journalEntries: entries }))}
            onEntrySaved={() => {
              setState(prev => ({ ...prev, journalCount: prev.journalCount + 1 }))
              awardXp(XP_REWARDS.journalEntry)
            }}
          />
        )
      case 'xp':
        return <XpTab xp={state.xp} streak={state.streak} badgeCtx={badgeCtx} todayXp={state.todayXp} />
      case 'pricing':
        return (
          <PricingTab
            tier={state.tier}
            unlockedThemeIds={state.unlockedThemeIds}
            onUpgrade={() => setState(prev => ({ ...prev, tier: 'pro' }))}
            onBuyTheme={id => setState(prev => ({ ...prev, unlockedThemeIds: [...new Set([...prev.unlockedThemeIds, id])] }))}
          />
        )
      case 'settings':
        return (
          <ThemesTab
            activeThemeId={state.themeId}
            unlockedThemeIds={state.unlockedThemeIds}
            tier={state.tier}
            auraHue={state.auraHue}
            onSelectTheme={id => setState(prev => ({ ...prev, themeId: id }))}
            onAuraHueChange={hue => setState(prev => ({ ...prev, auraHue: hue }))}
            onGoToPricing={goToPricing}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className="min-h-dvh w-full relative"
      style={{ ...cssVars, color: 'var(--t-text)', fontFamily: 'var(--font-sans)' }}
    >
      <AuraBackground colors={theme.aura} hueOffset={state.auraHue} />
      <TopTabBar tabs={TABS} activeTab={state.activeTab} onChange={setActiveTab} />

      <main className="relative z-10 px-4 pt-24 pb-24 md:pt-28 md:pb-12 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
