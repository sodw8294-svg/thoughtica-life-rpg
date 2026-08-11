import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Smile, Meh, Frown, Trash2, BookOpen } from 'lucide-react'

export type JournalMood = 'happy' | 'neutral' | 'sad'

export interface JournalEntry {
  id: string
  text: string
  mood: JournalMood
  createdAt: string
}

interface JournalTabProps {
  entries: JournalEntry[]
  onEntriesChange: (entries: JournalEntry[]) => void
  /** Called whenever a new entry is saved (for XP rewards) */
  onEntrySaved?: () => void
}

const MOOD_CONFIG: Record<JournalMood, { icon: typeof Smile; label: string; color: string }> = {
  happy: { icon: Smile, label: 'Good', color: '#22c55e' },
  neutral: { icon: Meh, label: 'Okay', color: '#eab308' },
  sad: { icon: Frown, label: 'Rough', color: '#60a5fa' },
}

export function JournalTab({ entries, onEntriesChange, onEntrySaved }: JournalTabProps) {
  const [draft, setDraft] = useState('')
  const [mood, setMood] = useState<JournalMood>('neutral')

  const saveEntry = () => {
    if (!draft.trim()) return
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      text: draft.trim(),
      mood,
      createdAt: new Date().toISOString(),
    }
    onEntriesChange([entry, ...entries])
    setDraft('')
    setMood('neutral')
    onEntrySaved?.()
  }

  const deleteEntry = (id: string) => {
    onEntriesChange(entries.filter(e => e.id !== id))
  }

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
          <BookOpen className="w-3.5 h-3.5" /> Journal
        </div>
        <h1
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' }}
        >
          Your Reflections
        </h1>
        <p className="text-sm" style={{ color: 'var(--t-text-muted)' }}>
          A quiet space to capture your thoughts. Earn +50 XP for every entry.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border backdrop-blur-xl p-5 space-y-4 shadow-xl"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      >
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="How was your day? What's on your mind?"
          rows={4}
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none border resize-none"
          style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
        />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {(Object.keys(MOOD_CONFIG) as JournalMood[]).map(m => {
              const cfg = MOOD_CONFIG[m]
              const Icon = cfg.icon
              const active = mood === m
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
                  style={{
                    background: active ? `${cfg.color}22` : 'transparent',
                    borderColor: active ? cfg.color : 'var(--t-border)',
                    color: active ? cfg.color : 'var(--t-text-muted)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" /> {cfg.label}
                </button>
              )
            })}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={saveEntry}
            disabled={!draft.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))', color: 'var(--t-on-accent)' }}
          >
            <PenLine className="w-4 h-4" /> Save Entry
          </motion.button>
        </div>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {entries.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm py-8"
              style={{ color: 'var(--t-text-muted)' }}
            >
              No entries yet — your first reflection is a page away. 📓
            </motion.p>
          )}
          {entries.map(entry => {
            const cfg = MOOD_CONFIG[entry.mood]
            const Icon = cfg.icon
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border p-4 flex items-start gap-3 backdrop-blur-xl"
                style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${cfg.color}22`, color: cfg.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--t-text)' }}>{entry.text}</p>
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--t-text-muted)' }}>
                    {new Date(entry.createdAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--t-text-muted)' }} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
