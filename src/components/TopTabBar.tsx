import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface TabDef {
  id: string
  label: string
  icon: LucideIcon
  emoji: string
}

interface TopTabBarProps {
  tabs: TabDef[]
  activeTab: string
  onChange: (id: string) => void
}

/**
 * Premium horizontal tab bar. Renders as a floating glass pill row pinned to
 * the top on desktop (md+), and collapses to a fixed bottom bar with icons
 * on mobile — like a native app. An animated pill (shared layoutId) glides
 * beneath the active tab.
 */
export function TopTabBar({ tabs, activeTab, onChange }: TopTabBarProps) {
  return (
    <>
      {/* Desktop: horizontal top bar */}
      <nav
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 items-center gap-1 rounded-2xl px-2 py-2 shadow-2xl backdrop-blur-xl border"
        style={{
          background: 'var(--t-surface-2)',
          borderColor: 'var(--t-border)',
        }}
        aria-label="Primary navigation"
      >
        {tabs.map(tab => {
          const active = tab.id === activeTab
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              style={{ color: active ? 'var(--t-on-accent)' : 'var(--t-text-muted)' }}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill-desktop"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{
                    background: `linear-gradient(135deg, var(--t-accent), var(--t-accent-2))`,
                    boxShadow: '0 4px 18px -4px var(--t-accent)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="text-base leading-none">{tab.emoji}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Mobile: fixed bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch overflow-x-auto no-scrollbar border-t backdrop-blur-xl"
        style={{
          background: 'var(--t-surface-2)',
          borderColor: 'var(--t-border)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label="Primary navigation"
      >
        {tabs.map(tab => {
          const active = tab.id === activeTab
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex-1 min-w-[64px] flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium cursor-pointer"
              style={{ color: active ? 'var(--t-accent)' : 'var(--t-text-muted)' }}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill-mobile"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ background: 'var(--t-accent)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[56px]">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
