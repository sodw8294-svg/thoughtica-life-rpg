import { motion } from 'framer-motion'
import { Check, Lock, Palette, Sparkles } from 'lucide-react'
import { THEMES, type ThemeDef } from '@/lib/themes'

interface ThemesTabProps {
  activeThemeId: string
  unlockedThemeIds: string[]
  onSelectTheme: (id: string) => void
  tier: 'free' | 'pro'
  auraHue: number
  onAuraHueChange: (hue: number) => void
  onGoToPricing: () => void
}

export function ThemesTab({
  activeThemeId,
  unlockedThemeIds,
  onSelectTheme,
  tier,
  auraHue,
  onAuraHueChange,
  onGoToPricing,
}: ThemesTabProps) {
  const isUnlocked = (t: ThemeDef) => tier === 'pro' || t.free || unlockedThemeIds.includes(t.id)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-2"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'var(--t-surface)', color: 'var(--t-accent)', border: '1px solid var(--t-border)' }}
        >
          <Palette className="w-3.5 h-3.5" /> Settings
        </div>
        <h1
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--t-accent), var(--t-accent-2))' }}
        >
          Themes &amp; Aura
        </h1>
        <p className="text-sm" style={{ color: 'var(--t-text-muted)' }}>
          Choose your sanctuary's mood from 15 hand-crafted themes.
        </p>
      </motion.header>

      {/* Aura hue wheel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border backdrop-blur-xl p-5 shadow-xl"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--t-text)' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'var(--t-accent)' }} /> Aura Color Wheel
          </h3>
          <span className="text-xs" style={{ color: 'var(--t-text-muted)' }}>{auraHue}°</span>
        </div>
        <div
          className="h-4 rounded-full mb-3"
          style={{
            background:
              'linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)',
          }}
        />
        <input
          type="range"
          min={0}
          max={360}
          value={auraHue}
          onChange={e => onAuraHueChange(parseInt(e.target.value))}
          className="w-full accent-current"
          style={{ accentColor: 'var(--t-accent)' }}
        />
        <p className="text-[11px] mt-2" style={{ color: 'var(--t-text-muted)' }}>
          Personalize the ambient background hue that drifts behind the whole app.
        </p>
      </motion.div>

      {/* Theme grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEMES.map((theme, i) => {
          const active = theme.id === activeThemeId
          const unlocked = isUnlocked(theme)
          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileTap={unlocked ? { scale: 0.96 } : {}}
              onClick={() => (unlocked ? onSelectTheme(theme.id) : onGoToPricing())}
              className="relative rounded-2xl overflow-hidden border text-left group"
              style={{ borderColor: active ? theme.vars['--t-accent'] : 'var(--t-border)' }}
            >
              <div
                className="h-20 w-full relative"
                style={{ background: `linear-gradient(135deg, ${theme.aura[0]}, ${theme.aura[1]}, ${theme.aura[2]})` }}
              >
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                )}
                {active && (
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
              </div>
              <div className="p-2.5" style={{ background: 'var(--t-surface-2)' }}>
                <p className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--t-text)' }}>
                  <span>{theme.emoji}</span> {theme.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: theme.free ? 'var(--t-accent)' : 'var(--t-text-muted)' }}>
                  {theme.free ? 'Free' : `$${theme.price.toFixed(2)}`}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
