/**
 * SaaS app chrome wrapper — OPT-IN, not the default. The template root
 * (__root.tsx) is full-bleed by default. To use this, ADD a
 * `src/routes/_app.tsx` pathless layout route that renders <SharedAppLayout>
 * and wrap pages under `src/routes/_app/` in it — give it children, since a
 * childless `_app.tsx` collides with the root index route. Landing/marketing/
 * content apps (and Thoughtica's own tab-based app) don't need this at all.
 */
import React, { createContext, useContext } from 'react'
import { Shell } from '../Shell'

export type SharedLayoutContextValue = {
  appName: string
}

const SharedLayoutContext = createContext<SharedLayoutContextValue | null>(null)

/** Use inside routes/pages that need app name or layout metadata — never for duplicating Shell. */
export function useSharedLayout(): SharedLayoutContextValue {
  const ctx = useContext(SharedLayoutContext)
  if (!ctx) {
    throw new Error('useSharedLayout must be used within SharedAppLayout')
  }
  return ctx
}

export type SharedAppLayoutProps = {
  appName?: string
  children: React.ReactNode
}

export function SharedAppLayout({ appName = 'App', children }: SharedAppLayoutProps) {
  const value = React.useMemo(() => ({ appName }), [appName])

  return (
    <SharedLayoutContext.Provider value={value}>
      <Shell>{children}</Shell>
    </SharedLayoutContext.Provider>
  )
}
