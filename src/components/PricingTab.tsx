import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Gem, Sparkles } from 'lucide-react'
import { THEMES } from '@/lib/themes'

interface PricingTabProps {
  tier: 'free' | 'pro'
  onUpgrade: () => void
  onBuyTheme: (themeId: string) => void
  unlockedThemeIds: string[]
}

const FREE_FEATURES = [
  '1 free theme (Aurora Borealis)',
  'Nature soundscapes & 4-7-8 breathing',
  'Journal with mood tracking',
  'Digital detox focus timer',
  'XP, levels & badges',
]

const PRO_FEATURES = [
  'All 15 premium themes unlocked',
  'Unlimited conversations with Kora AI',
  'Advanced detox insights & analytics',
  'Priority feature access',
  'Support an indie-built sanctuary 💛',
]

export function PricingTab({ tier, onUpgrade, onBuyTheme, unlockedThemeIds }: PricingTabProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const monthlyPrice = 14.99
  const annualPrice = 9.99

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 pt-2"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'var(--t-surface)', color: 'var(--t-accent)', border: '1px solid var(--t-border)' }}
        >
          <Gem className="w-3.5 h-3.5" /> Pricing
        </div>
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2), var(--t-accent-3))' }}
        >
          Invest in your inner world
        </h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--t-text-muted)' }}>
          Simple, honest pricing. Unlock every theme, and let Kora walk with you every day.
        </p>

        <div className="inline-flex items-center gap-1 p-1 rounded-full mt-2" style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}>
          {(['monthly', 'annual'] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all relative"
              style={{
                background: billing === b ? 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' : 'transparent',
                color: billing === b ? 'var(--t-on-accent)' : 'var(--t-text-muted)',
              }}
            >
              {b === 'monthly' ? 'Monthly' : 'Annual (save 33%)'}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Free */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border p-7 backdrop-blur-xl shadow-xl"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
        >
          <h3 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Free</h3>
          <p className="text-3xl font-bold mt-2" style={{ color: 'var(--t-text)' }}>$0</p>
          <p className="text-xs mb-5" style={{ color: 'var(--t-text-muted)' }}>forever</p>
          <ul className="space-y-2.5">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--t-text)' }}>
                <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--t-accent)' }} /> {f}
              </li>
            ))}
          </ul>
          <button
            disabled={tier === 'free'}
            className="w-full mt-6 py-3 rounded-2xl font-semibold text-sm border disabled:opacity-50"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
          >
            {tier === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-3xl border-2 p-7 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-accent)' }}
        >
          <motion.div
            className="absolute -inset-x-10 -top-24 h-48 rounded-full blur-3xl opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' }}
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <span
            className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))', color: 'var(--t-on-accent)' }}
          >
            <Crown className="w-3 h-3" /> MOST POPULAR
          </span>
          <h3 className="text-lg font-bold relative z-10" style={{ color: 'var(--t-text)' }}>Thoughtica Pro</h3>
          <p className="text-3xl font-bold mt-2 relative z-10" style={{ color: 'var(--t-text)' }}>
            ${billing === 'monthly' ? monthlyPrice.toFixed(2) : annualPrice.toFixed(2)}
            <span className="text-sm font-medium" style={{ color: 'var(--t-text-muted)' }}>/mo</span>
          </p>
          <p className="text-xs mb-5 relative z-10" style={{ color: 'var(--t-text-muted)' }}>
            {billing === 'annual' ? 'billed annually' : 'billed monthly · cancel anytime'}
          </p>
          <ul className="space-y-2.5 relative z-10">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--t-text)' }}>
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--t-accent)' }} /> {f}
              </li>
            ))}
          </ul>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onUpgrade}
            disabled={tier === 'pro'}
            className="w-full mt-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg relative z-10 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))', color: 'var(--t-on-accent)' }}
          >
            {tier === 'pro' ? '✓ You are Pro' : 'Upgrade to Pro'}
          </motion.button>
        </motion.div>
      </div>

      {/* Individual themes */}
      <div>
        <h3 className="text-lg font-bold text-center mb-1" style={{ color: 'var(--t-text)' }}>Or buy themes individually</h3>
        <p className="text-xs text-center mb-5" style={{ color: 'var(--t-text-muted)' }}>$4.99 each · own it forever</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {THEMES.map(theme => {
            const owned = tier === 'pro' || theme.free || unlockedThemeIds.includes(theme.id)
            return (
              <motion.div
                key={theme.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}
              >
                <div className="h-16" style={{ background: `linear-gradient(135deg, ${theme.aura[0]}, ${theme.aura[1]})` }} />
                <div className="p-2.5 text-center">
                  <p className="text-[11px] font-semibold" style={{ color: 'var(--t-text)' }}>{theme.emoji} {theme.name}</p>
                  <button
                    onClick={() => !owned && onBuyTheme(theme.id)}
                    disabled={owned}
                    className="w-full mt-2 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-60"
                    style={{
                      background: owned ? 'var(--t-surface-2)' : 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))',
                      color: owned ? 'var(--t-text-muted)' : 'var(--t-on-accent)',
                    }}
                  >
                    {owned ? 'Owned' : `$${theme.price.toFixed(2)}`}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
