import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Loader2 } from 'lucide-react'
import { processCompanionTurn } from '@/lib/companion'
import type { RpgContext } from '@/lib/companion'

export interface KoraMessage {
  id: string
  role: 'user' | 'kora'
  text: string
  timestamp: string
}

interface KoraTabProps {
  messages: KoraMessage[]
  onMessagesChange: (messages: KoraMessage[]) => void
  rpgContext: RpgContext
  /** Called after each successful exchange with Kora (for XP rewards) */
  onChatTurn?: () => void
  userId: string
}

const KORA_WELCOME = "Hi, I'm Kora, your mindful companion 🌟 How are you feeling today?"

const FALLBACK_REPLIES = [
  "I'm listening. Even in the quiet moments, I'm here with you — tell me more about what's on your mind. 🌿",
  "Thank you for sharing that with me. Whatever today has brought, you don't have to carry it alone. ✨",
  "I hear you. Sometimes just naming how we feel is the first gentle step toward clarity.",
  "That sounds like a lot to hold. I'm proud of you for showing up here today — what would help most right now?",
]

function KoraAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 shadow-lg"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, var(--t-accent-3), var(--t-accent) 60%, #f5c518)',
      }}
    >
      <Sparkles style={{ width: size * 0.5, height: size * 0.5 }} className="text-white drop-shadow" />
    </div>
  )
}

/**
 * Kora — the warm, supportive AI companion. Renders a chat UI with Kora's
 * messages on the left (with avatar) and the user's on the right. Uses
 * `processCompanionTurn` (Blink AI) for replies, with a thoughtful fallback
 * when the AI is unavailable.
 */
export function KoraTab({ messages, onMessagesChange, rpgContext, onChatTurn, userId }: KoraTabProps) {
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const userMsg: KoraMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text: trimmed,
        timestamp: new Date().toISOString(),
      }
      const next = [...messages, userMsg]
      onMessagesChange(next)
      setDraft('')
      setIsTyping(true)

      let replyText: string
      try {
        const res = await processCompanionTurn({ userId, userMessage: trimmed, rpgContext })
        replyText = res.reply
      } catch {
        replyText = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
      }

      const koraMsg: KoraMessage = {
        id: crypto.randomUUID(),
        role: 'kora',
        text: replyText,
        timestamp: new Date().toISOString(),
      }
      onMessagesChange([...next, koraMsg])
      setIsTyping(false)
      onChatTurn?.()
    },
    [messages, onMessagesChange, isTyping, rpgContext, userId, onChatTurn]
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(draft)
  }

  const displayMessages = messages.length > 0
    ? messages
    : [{ id: 'welcome', role: 'kora' as const, text: KORA_WELCOME, timestamp: new Date().toISOString() }]

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100dvh-11rem)] md:h-[calc(100dvh-9rem)]">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pb-4 shrink-0"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <KoraAvatar size={56} />
        </div>
        <h1
          className="text-2xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--t-accent-3), var(--t-accent))' }}
        >
          Kora
        </h1>
        <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>Your warm, mindful AI companion</p>
      </motion.header>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto rounded-3xl border backdrop-blur-xl p-4 space-y-4 shadow-xl"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      >
        <AnimatePresence initial={false}>
          {displayMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'kora' && <KoraAvatar size={32} />}
              <div
                className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))',
                        color: 'var(--t-on-accent)',
                        borderBottomRightRadius: 4,
                      }
                    : {
                        background: 'var(--t-surface-2)',
                        color: 'var(--t-text)',
                        border: '1px solid var(--t-border)',
                        borderBottomLeftRadius: 4,
                      }
                }
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}
                >
                  <User className="w-4 h-4" style={{ color: 'var(--t-text-muted)' }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
            <KoraAvatar size={32} />
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
              style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)', borderBottomLeftRadius: 4 }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--t-accent)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 shrink-0 flex items-center gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Share what's on your mind..."
          className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none border backdrop-blur-xl"
          style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.92 }}
          disabled={!draft.trim() || isTyping}
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg disabled:opacity-40 transition-opacity"
          style={{ background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))', color: 'var(--t-on-accent)' }}
        >
          {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </motion.button>
      </form>
    </div>
  )
}
