import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Brain, PenLine, Music, Target, BarChart3, MessageCircle,
  Send, Heart, Moon, Sun, Zap, Trophy, Star, Crown, Check, ChevronRight,
  ChevronLeft, X, Download, Settings, Volume2, Play, Pause, Plus,
  Trash2, ArrowUp, ArrowRight, RefreshCw, Quote, BookOpen, Compass,
  Gem, Clock, Flame, Shield, Bell, Info, Smile, Frown, Meh, Wind, Timer, type LucideIcon
} from 'lucide-react'
import { RelaxTab } from '@/components/RelaxTab'
import { SoundtrackTab } from '@/components/SoundtrackTab'
import { DetoxTab } from '@/components/DetoxTab'
import { blink } from '@/blink/client'
import { processCompanionTurn, loadConversation, loadPersonality, loadMemories } from '@/lib/companion'
import type { RpgContext } from '@/lib/companion'

/* ═══════════════════════════════════════════════════════════════
   TYPES & DEFAULTS
   ═══════════════════════════════════════════════════════════════ */

type Tier = 'free' | 'pro'
type CompanionPersona = 'calm-philosopher' | 'gentle-strategist' | 'socratic-mentor'
type AuraMood = 'dawn-mist' | 'sage-sanctuary' | 'twilight-solitude'
type TabId = 'companion' | 'journal' | 'relax' | 'soundscapes' | 'soundtrack' | 'detox' | 'rituals' | 'reports'

interface CompanionConfig { name: string; persona: CompanionPersona; aura: AuraMood }
interface JournalEntry { id: string; text: string; mood: 'happy' | 'neutral' | 'sad'; createdAt: string; aiReflection?: string }
interface ChatMessage { id: string; role: 'user' | 'companion'; text: string; timestamp: string }
interface PathMarker { id: string; text: string; completed: boolean; createdAt: string }
interface Badge { id: string; name: string; description: string; icon: string; unlockedAt?: string }
interface SoulReport { id: string; date: string; moodTrend: number[]; topTopics: string[]; tasksCompleted: number; summary: string }

interface AppState {
  onboardingDone: boolean
  companion: CompanionConfig
  tier: Tier
  trialActive: boolean
  trialStartDate: string | null
  xp: number
  level: number
  streak: number
  lastActiveDate: string | null
  journalEntries: JournalEntry[]
  chatMessages: ChatMessage[]
  aiInteractionsRemaining: number
  pathMarkers: PathMarker[]
  intention: string
  wordOfDay: { word: string; definition: string; date: string }
  badges: Badge[]
  soundMix: { rain: number; wind: number; fire: number; ocean: number }
  activeSoundscape: string | null
  reports: SoulReport[]
  billingInterval: 'monthly' | 'annual'
}

const PERSONAS: Record<CompanionPersona, { label: string; desc: string; emoji: string }> = {
  'calm-philosopher': { label: 'The Calm Philosopher', desc: 'Gentle wisdom rooted in stoic tranquility.', emoji: '🏛️' },
  'gentle-strategist': { label: 'The Gentle Strategist', desc: 'Practical clarity with compassionate guidance.', emoji: '🧭' },
  'socratic-mentor': { label: 'The Socratic Mentor', desc: 'Provocative questions that unlock insight.', emoji: '🦉' },
}

const AURAS: Record<AuraMood, { label: string; desc: string; gradient: string }> = {
  'dawn-mist': { label: 'Dawn Mist', desc: 'Soft lavender to warm peach.', gradient: 'from-purple-100 via-rose-50 to-amber-50' },
  'sage-sanctuary': { label: 'Sage Sanctuary', desc: 'Muted sage green to stone.', gradient: 'from-emerald-50 via-stone-50 to-teal-50' },
  'twilight-solitude': { label: 'Twilight Solitude', desc: 'Deep indigo to silver blue.', gradient: 'from-indigo-100 via-slate-50 to-sky-100' },
}

const AURA_GRADIENTS: Record<AuraMood, string> = {
  'dawn-mist': 'from-purple-200/40 via-rose-100/30 to-amber-100/40',
  'sage-sanctuary': 'from-emerald-200/40 via-stone-100/30 to-teal-100/40',
  'twilight-solitude': 'from-indigo-200/40 via-slate-100/30 to-sky-100/40',
}

const WORDS_OF_DAY = [
  { word: 'Equanimity', definition: 'Mental calmness and composure, especially in difficult situations.' },
  { word: 'Sonder', definition: 'The realization that every passerby has a life as vivid and complex as your own.' },
  { word: 'Ephemeral', definition: 'Lasting for a very short time; a reminder to savor the present.' },
  { word: 'Resilience', definition: 'The capacity to recover quickly from difficulties; inner toughness.' },
  { word: 'Ubuntu', definition: 'A quality that includes the essential human virtues of compassion and humanity.' },
  { word: 'Kintsugi', definition: 'The Japanese art of repairing broken pottery with gold — embracing flaws.' },
  { word: 'Petrichor', definition: 'The pleasant, earthy scent after rain — a moment of grounding.' },
]

const ALL_BADGES: Badge[] = [
  { id: 'first-reflection', name: 'First Reflection', description: 'Wrote your first journal entry.', icon: 'BookOpen' },
  { id: '7-day-streak', name: '7-Day Streak Master', description: 'Maintained a 7-day mindfulness streak.', icon: 'Flame' },
  { id: 'zen-master', name: 'Zen Master', description: 'Reached Level 5 in your mindfulness journey.', icon: 'Trophy' },
  { id: 'sound-explorer', name: 'Sound Explorer', description: 'Tried all four soundscapes.', icon: 'Music' },
  { id: 'path-clearer', name: 'Path Clearer', description: 'Completed 10 path markers.', icon: 'Target' },
  { id: 'ai-bond', name: 'AI Bond', description: 'Had 50 conversations with your companion.', icon: 'Sparkles' },
]

const SOUND_PRESETS = [
  { id: 'rain', name: 'Rain on Glass', icon: 'CloudRain' as const, freq: 200 },
  { id: 'forest', name: 'Forest Canopy', icon: 'TreePine' as const, freq: 350 },
  { id: 'binaural', name: 'Deep Delta Binaural', icon: 'Waves' as const, freq: 140 },
  { id: 'hearth', name: 'Warm Hearth Fire', icon: 'Flame' as const, freq: 500 },
]

const XP_PER_TASK = 50
const XP_PER_INTENTION = 25
const FREE_AI_LIMIT = 10
const PRICING = {
  pro: { monthly: 4.99 },
}

const STORAGE_KEY = 'thoughtica-app-state'

function todayStr() { return new Date().toISOString().split('T')[0] }

function getDefaultState(): AppState {
  return {
    onboardingDone: false,
    companion: { name: 'Aria', persona: 'calm-philosopher', aura: 'sage-sanctuary' },
    tier: 'free',
    trialActive: false,
    trialStartDate: null,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    journalEntries: [],
    chatMessages: [{ id: 'welcome', role: 'companion', text: 'Welcome to your sanctuary. I\'m here to walk with you. How are you feeling today?', timestamp: new Date().toISOString() }],
    aiInteractionsRemaining: FREE_AI_LIMIT,
    pathMarkers: [],
    intention: '',
    wordOfDay: { word: 'Equanimity', definition: 'Mental calmness and composure, especially in difficult situations.', date: todayStr() },
    badges: [],
    soundMix: { rain: 65, wind: 30, fire: 40, ocean: 50 },
    activeSoundscape: null,
    reports: [],
    billingInterval: 'monthly',
  }
}

/* ═══════════════════════════════════════════════════════════════
   PERSISTENCE HELPERS
   ═══════════════════════════════════════════════════════════════ */

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return { ...getDefaultState(), ...parsed }
  } catch (err) {
    console.error('[Thoughtica] Failed to load state from localStorage — using defaults:', err)
    return getDefaultState()
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('[Thoughtica] Failed to persist state to localStorage:', err)
  }
}

/* ═══════════════════════════════════════════════════════════════
   ROUTE
   ═══════════════════════════════════════════════════════════════ */

export const Route = createFileRoute('/')({
  component: IndexPage,
})

/* ═══════════════════════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function IndexPage() {
  const [appState, setAppState] = useState<AppState>(getDefaultState)
  const [hydrated, setHydrated] = useState(false)
  const [enterLoading, setEnterLoading] = useState(false)
  const [enterError, setEnterError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('companion')
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [setupName, setSetupName] = useState('Aria')
  const [setupPersona, setSetupPersona] = useState<CompanionPersona>('calm-philosopher')
  const [setupAura, setSetupAura] = useState<AuraMood>('sage-sanctuary')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = loadState()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppState(saved)
    } catch (err) {
      console.error('[Thoughtica] Hydration error — starting with defaults:', err)
    } finally {
      setHydrated(true)
    }
  }, [])

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (!hydrated) return
    saveState(appState)
  }, [appState, hydrated])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [appState.chatMessages])

  const updateState = useCallback((patch: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...patch }))
  }, [])

  /* ── Enter Sanctuary handler ─────────────────────── */
  const handleEnterSanctuary = useCallback(async () => {
    if (enterLoading) return
    setEnterLoading(true)
    setEnterError(null)
    try {
      // Load (or re-load) persisted state before transitioning
      const saved = loadState()
      const merged: AppState = {
        ...saved,
        onboardingDone: true,
        companion: {
          name: setupName.trim() || 'Aria',
          persona: setupPersona,
          aura: setupAura,
        },
      }
      saveState(merged)
      setAppState(merged)
    } catch (err) {
      console.error('[Thoughtica] Enter Sanctuary transition failed:', err)
      setEnterError('Something went wrong entering your sanctuary. Please try again.')
    } finally {
      setEnterLoading(false)
    }
  }, [enterLoading, setupName, setupPersona, setupAura])

  /* ── Companion chat handler ──────────────────────── */
  const handleSendMessage = useCallback(async (e?: FormEvent) => {
    e?.preventDefault()
    const text = chatInput.trim()
    if (!text || chatLoading) return
    setChatInput('')
    setChatLoading(true)

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    }
    updateState({ chatMessages: [...appState.chatMessages, userMsg] })

    try {
      const rpgCtx: RpgContext = {
        level: appState.level,
        xp: appState.xp,
        streak: appState.streak,
        activeQuestNames: appState.pathMarkers.filter(m => !m.completed).map(m => m.text),
        recentBadgeNames: appState.badges.filter(b => b.unlockedAt).map(b => b.name),
      }
      const result = await processCompanionTurn({
        userId: 'local-user',
        userMessage: text,
        rpgContext: rpgCtx,
      })
      const companionMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'companion',
        text: result.reply,
        timestamp: new Date().toISOString(),
      }
      updateState({
        chatMessages: [...appState.chatMessages, userMsg, companionMsg],
        aiInteractionsRemaining: Math.max(0, appState.aiInteractionsRemaining - 1),
      })
    } catch (err) {
      console.error('[Thoughtica] Companion turn failed:', err)
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'companion',
        text: 'I\'m having a quiet moment — please try again shortly. 🌿',
        timestamp: new Date().toISOString(),
      }
      updateState({ chatMessages: [...appState.chatMessages, userMsg, errMsg] })
    } finally {
      setChatLoading(false)
    }
  }, [chatInput, chatLoading, appState, updateState])

  const handleChatKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  /* ── Loading skeleton ────────────────────────────── */
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-white/60"
        >
          <Sparkles className="w-10 h-10 animate-pulse text-purple-400" />
          <p className="text-sm font-medium">Awakening your sanctuary…</p>
        </motion.div>
      </div>
    )
  }

  /* ── Onboarding / Landing ────────────────────────── */
  if (!appState.onboardingDone) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4`}>
        <AnimatePresence mode="wait">
          {onboardStep === 0 && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-md text-center space-y-8"
            >
              <div className="space-y-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="text-6xl"
                >
                  ✨
                </motion.div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Thoughtica</h1>
                <p className="text-purple-300 text-lg">Your AI-powered Life RPG Sanctuary</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                {[
                  { icon: Brain, label: 'AI Companion', color: 'text-purple-400' },
                  { icon: Zap, label: 'RPG Progress', color: 'text-amber-400' },
                  { icon: Heart, label: 'Daily Rituals', color: 'text-rose-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-white/70 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {enterError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2"
                >
                  {enterError}
                </motion.p>
              )}

              <button
                onClick={() => setOnboardStep(1)}
                disabled={enterLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-extrabold text-lg shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Begin Your Journey →
              </button>
              <p className="text-white/30 text-xs">No account required · All data stays on your device</p>
            </motion.div>
          )}

          {onboardStep === 1 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-md space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold text-white">Name Your Companion</h2>
                <p className="text-white/50 text-sm">This is who walks with you on your journey.</p>
              </div>

              <input
                type="text"
                value={setupName}
                onChange={e => setSetupName(e.target.value)}
                placeholder="e.g. Aria, Kora, Sage…"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
                maxLength={30}
              />

              <div className="space-y-2">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Persona</p>
                <div className="space-y-2">
                  {(Object.entries(PERSONAS) as [CompanionPersona, typeof PERSONAS[CompanionPersona]][]).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => setSetupPersona(key)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${setupPersona === key ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                    >
                      <span className="mr-2">{p.emoji}</span>
                      <span className="font-semibold">{p.label}</span>
                      <span className="text-xs text-white/40 ml-2">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Sanctuary Aura</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(AURAS) as [AuraMood, typeof AURAS[AuraMood]][]).map(([key, a]) => (
                    <button
                      key={key}
                      onClick={() => setSetupAura(key)}
                      className={`p-3 rounded-xl border text-center transition-all ${setupAura === key ? 'border-purple-500 bg-purple-600/20 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${a.gradient} mx-auto mb-1`} />
                      <p className="text-xs font-semibold leading-tight">{a.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {enterError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2"
                >
                  {enterError}
                </motion.p>
              )}

              <button
                onClick={handleEnterSanctuary}
                disabled={enterLoading || !setupName.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-extrabold text-lg shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {enterLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Awakening…
                  </>
                ) : (
                  'Enter Sanctuary ✨'
                )}
              </button>

              <button
                onClick={() => setOnboardStep(0)}
                className="w-full text-center text-white/30 text-sm hover:text-white/60 transition-colors"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  /* ── Main App ────────────────────────────────────── */
  const aura = appState.companion.aura
  const auraGradient = AURA_GRADIENTS[aura]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${auraGradient} flex flex-col`}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-extrabold text-white text-sm">Thoughtica</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
            Lvl {appState.level}
          </span>
          <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
            <Flame className="w-3 h-3" /> {appState.streak}d
          </span>
          <button
            onClick={() => updateState({ onboardingDone: false })}
            className="p-1.5 rounded-lg bg-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="flex overflow-x-auto border-b border-white/10 bg-white/5 scrollbar-none">
        {([
          { id: 'companion', icon: MessageCircle, label: 'Companion' },
          { id: 'journal', icon: PenLine, label: 'Journal' },
          { id: 'relax', icon: Wind, label: 'Relax' },
          { id: 'soundtrack', icon: Music, label: 'Sounds' },
          { id: 'detox', icon: Shield, label: 'Detox' },
        ] as { id: TabId; icon: typeof MessageCircle; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-all ${activeTab === id ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/50 hover:text-white/80'}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'companion' && (
            <motion.div
              key="companion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {appState.chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-white/10 text-white/90 border border-white/10 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 rounded-bl-sm">
                      <span className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <textarea
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder={`Talk to ${appState.companion.name}…`}
                  rows={1}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div key="journal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 overflow-y-auto h-full">
              <h2 className="font-extrabold text-white text-lg mb-4 flex items-center gap-2"><PenLine className="w-5 h-5 text-rose-400" /> Journal</h2>
              {appState.journalEntries.length === 0 ? (
                <div className="text-center text-white/40 py-12">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Your first entry awaits.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appState.journalEntries.map(entry => (
                    <div key={entry.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-white/80 text-sm">{entry.text}</p>
                      <p className="text-white/30 text-xs mt-2">{new Date(entry.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'relax' && (
            <motion.div key="relax" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              <RelaxTab />
            </motion.div>
          )}

          {activeTab === 'soundtrack' && (
            <motion.div key="soundtrack" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              <SoundtrackTab />
            </motion.div>
          )}

          {activeTab === 'detox' && (
            <motion.div key="detox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
              <DetoxTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

