/**
 * Shell — simple full-bleed layout wrapper (no sidebar / app chrome).
 *
 * USAGE:
 *   <Shell>
 *     <Page>...</Page>
 *   </Shell>
 *
 * Thoughtica's main app (src/routes/index.tsx) owns its own top/bottom tab
 * bar and does not use this wrapper — this is kept as a minimal, reusable
 * shell for any other full-bleed route that just needs a flex column.
 * (App name/metadata is carried via `useSharedLayout()`'s context, not a
 * prop here — this component intentionally has no chrome to render it in.)
 */
import type { ReactNode } from 'react'

interface ShellProps {
  children: ReactNode
}

export function Shell({ children }: ShellProps) {
  return <div className="flex min-h-dvh w-full flex-1 flex-col">{children}</div>
}
