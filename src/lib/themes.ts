/* ═══════════════════════════════════════════════════════════════
   THOUGHTICA THEME SYSTEM
   15 premium themes, applied via CSS custom properties on a wrapper
   div. Each theme defines a palette of surface / text / accent tokens
   plus an "aura" palette used by <AuraBackground /> for the ambient,
   slowly-rotating background gradient.
   ═══════════════════════════════════════════════════════════════ */

import type { CSSProperties } from 'react'

export interface ThemeDef {
  id: string
  name: string
  emoji: string
  description: string
  /** CSS custom properties applied to the app root */
  vars: {
    '--t-bg': string
    '--t-bg-2': string
    '--t-surface': string
    '--t-surface-2': string
    '--t-border': string
    '--t-text': string
    '--t-text-muted': string
    '--t-accent': string
    '--t-accent-2': string
    '--t-accent-3': string
    '--t-on-accent': string
  }
  /** Colors used by the animated aura background blobs */
  aura: [string, string, string, string]
  /** Price for individual theme unlock (Free theme = 0) */
  price: number
  free?: boolean
}

export const THEMES: ThemeDef[] = [
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    emoji: '🌌',
    description: 'Dark greens, teals & purples dancing like northern lights.',
    vars: {
      '--t-bg': '#060f13',
      '--t-bg-2': '#0a1c1f',
      '--t-surface': 'rgba(20, 46, 48, 0.55)',
      '--t-surface-2': 'rgba(20, 46, 48, 0.85)',
      '--t-border': 'rgba(94, 234, 212, 0.18)',
      '--t-text': '#eafff6',
      '--t-text-muted': '#9fc9c2',
      '--t-accent': '#34d399',
      '--t-accent-2': '#22d3ee',
      '--t-accent-3': '#a78bfa',
      '--t-on-accent': '#04140f',
    },
    aura: ['#0f766e', '#22d3ee', '#7c3aed', '#065f46'],
    price: 0,
    free: true,
  },
  {
    id: 'midnight-rose',
    name: 'Midnight Rose',
    emoji: '🌹',
    description: 'Deep navy skies with a blush of dusty rose.',
    vars: {
      '--t-bg': '#0a0b17',
      '--t-bg-2': '#170b1f',
      '--t-surface': 'rgba(48, 26, 56, 0.55)',
      '--t-surface-2': 'rgba(48, 26, 56, 0.85)',
      '--t-border': 'rgba(244, 114, 182, 0.18)',
      '--t-text': '#fdf1f7',
      '--t-text-muted': '#c8a7bc',
      '--t-accent': '#fb7185',
      '--t-accent-2': '#c084fc',
      '--t-accent-3': '#818cf8',
      '--t-on-accent': '#1a0410',
    },
    aura: ['#831843', '#4c1d95', '#1e1b4b', '#be185d'],
    price: 4.99,
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    emoji: '🌇',
    description: 'Warm amber & gold as the sun dips below the horizon.',
    vars: {
      '--t-bg': '#1a1006',
      '--t-bg-2': '#26140a',
      '--t-surface': 'rgba(74, 42, 20, 0.55)',
      '--t-surface-2': 'rgba(74, 42, 20, 0.85)',
      '--t-border': 'rgba(251, 191, 36, 0.2)',
      '--t-text': '#fff7ea',
      '--t-text-muted': '#d8b48c',
      '--t-accent': '#f59e0b',
      '--t-accent-2': '#fb923c',
      '--t-accent-3': '#f43f5e',
      '--t-on-accent': '#1a0d00',
    },
    aura: ['#b45309', '#f97316', '#ef4444', '#7c2d12'],
    price: 4.99,
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    emoji: '🌊',
    description: 'Dark blues & teals from the deepest trench.',
    vars: {
      '--t-bg': '#050e18',
      '--t-bg-2': '#071827',
      '--t-surface': 'rgba(15, 45, 66, 0.55)',
      '--t-surface-2': 'rgba(15, 45, 66, 0.85)',
      '--t-border': 'rgba(56, 189, 248, 0.18)',
      '--t-text': '#eaf7ff',
      '--t-text-muted': '#8fb7cc',
      '--t-accent': '#0ea5e9',
      '--t-accent-2': '#2dd4bf',
      '--t-accent-3': '#6366f1',
      '--t-on-accent': '#001624',
    },
    aura: ['#0c4a6e', '#155e75', '#1e3a8a', '#0e7490'],
    price: 4.99,
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    emoji: '🌸',
    description: 'Soft pinks drifting over crisp white.',
    vars: {
      '--t-bg': '#fff5f8',
      '--t-bg-2': '#ffeaf1',
      '--t-surface': 'rgba(255, 255, 255, 0.6)',
      '--t-surface-2': 'rgba(255, 255, 255, 0.85)',
      '--t-border': 'rgba(244, 114, 182, 0.25)',
      '--t-text': '#4a1930',
      '--t-text-muted': '#9c6b83',
      '--t-accent': '#ec4899',
      '--t-accent-2': '#f472b6',
      '--t-accent-3': '#fb7185',
      '--t-on-accent': '#ffffff',
    },
    aura: ['#fbcfe8', '#f9a8d4', '#fda4af', '#fecdd3'],
    price: 4.99,
  },
  {
    id: 'forest-spirit',
    name: 'Forest Spirit',
    emoji: '🌲',
    description: 'Deep evergreens & mossy earth tones.',
    vars: {
      '--t-bg': '#0a140d',
      '--t-bg-2': '#0f1f13',
      '--t-surface': 'rgba(26, 51, 32, 0.55)',
      '--t-surface-2': 'rgba(26, 51, 32, 0.85)',
      '--t-border': 'rgba(74, 222, 128, 0.18)',
      '--t-text': '#eefbf0',
      '--t-text-muted': '#9dc2a4',
      '--t-accent': '#22c55e',
      '--t-accent-2': '#84cc16',
      '--t-accent-3': '#ca8a04',
      '--t-on-accent': '#04170a',
    },
    aura: ['#14532d', '#166534', '#3f6212', '#78350f'],
    price: 4.99,
  },
  {
    id: 'cosmic-dust',
    name: 'Cosmic Dust',
    emoji: '✨',
    description: 'Dark purples & space blues sprinkled with stardust.',
    vars: {
      '--t-bg': '#0a0715',
      '--t-bg-2': '#120a24',
      '--t-surface': 'rgba(42, 26, 66, 0.55)',
      '--t-surface-2': 'rgba(42, 26, 66, 0.85)',
      '--t-border': 'rgba(168, 85, 247, 0.2)',
      '--t-text': '#f3ecff',
      '--t-text-muted': '#b0a3d1',
      '--t-accent': '#a855f7',
      '--t-accent-2': '#6366f1',
      '--t-accent-3': '#ec4899',
      '--t-on-accent': '#0c0418',
    },
    aura: ['#4c1d95', '#312e81', '#1e1b4b', '#701a75'],
    price: 4.99,
  },
  {
    id: 'desert-sand',
    name: 'Desert Sand',
    emoji: '🏜️',
    description: 'Warm tans, terracotta & sun-baked clay.',
    vars: {
      '--t-bg': '#1c1509',
      '--t-bg-2': '#241a0d',
      '--t-surface': 'rgba(84, 58, 33, 0.5)',
      '--t-surface-2': 'rgba(84, 58, 33, 0.82)',
      '--t-border': 'rgba(217, 119, 6, 0.2)',
      '--t-text': '#fdf3e4',
      '--t-text-muted': '#cbab86',
      '--t-accent': '#d97706',
      '--t-accent-2': '#c2410c',
      '--t-accent-3': '#a16207',
      '--t-on-accent': '#1c0f00',
    },
    aura: ['#92400e', '#9a3412', '#78350f', '#b45309'],
    price: 4.99,
  },
  {
    id: 'arctic-ice',
    name: 'Arctic Ice',
    emoji: '🧊',
    description: 'Cool whites & crystalline ice blues.',
    vars: {
      '--t-bg': '#eef7fb',
      '--t-bg-2': '#e2f1f9',
      '--t-surface': 'rgba(255, 255, 255, 0.65)',
      '--t-surface-2': 'rgba(255, 255, 255, 0.9)',
      '--t-border': 'rgba(56, 189, 248, 0.25)',
      '--t-text': '#0c2836',
      '--t-text-muted': '#5f7f8f',
      '--t-accent': '#0ea5e9',
      '--t-accent-2': '#38bdf8',
      '--t-accent-3': '#818cf8',
      '--t-on-accent': '#ffffff',
    },
    aura: ['#bae6fd', '#e0f2fe', '#a5f3fc', '#c7d2fe'],
    price: 4.99,
  },
  {
    id: 'ember-glow',
    name: 'Ember Glow',
    emoji: '🔥',
    description: 'Deep reds & smouldering orange ember.',
    vars: {
      '--t-bg': '#150505',
      '--t-bg-2': '#1f0808',
      '--t-surface': 'rgba(66, 22, 22, 0.55)',
      '--t-surface-2': 'rgba(66, 22, 22, 0.85)',
      '--t-border': 'rgba(248, 113, 113, 0.2)',
      '--t-text': '#fff0ec',
      '--t-text-muted': '#d3a196',
      '--t-accent': '#ef4444',
      '--t-accent-2': '#f97316',
      '--t-accent-3': '#facc15',
      '--t-on-accent': '#1a0000',
    },
    aura: ['#7f1d1d', '#9a3412', '#b91c1c', '#c2410c'],
    price: 4.99,
  },
  {
    id: 'sakura-night',
    name: 'Sakura Night',
    emoji: '🌙',
    description: 'Pink & purple blossoms under a velvet night sky.',
    vars: {
      '--t-bg': '#0d0714',
      '--t-bg-2': '#180a20',
      '--t-surface': 'rgba(58, 26, 66, 0.55)',
      '--t-surface-2': 'rgba(58, 26, 66, 0.85)',
      '--t-border': 'rgba(244, 114, 182, 0.2)',
      '--t-text': '#fbeeff',
      '--t-text-muted': '#c19fd1',
      '--t-accent': '#e879f9',
      '--t-accent-2': '#f472b6',
      '--t-accent-3': '#818cf8',
      '--t-on-accent': '#170318',
    },
    aura: ['#701a75', '#86198f', '#4c1d95', '#9d174d'],
    price: 4.99,
  },
  {
    id: 'jade-garden',
    name: 'Jade Garden',
    emoji: '🍃',
    description: 'Serene jade greens with quiet elegance.',
    vars: {
      '--t-bg': '#071512',
      '--t-bg-2': '#0a1f1a',
      '--t-surface': 'rgba(20, 56, 48, 0.55)',
      '--t-surface-2': 'rgba(20, 56, 48, 0.85)',
      '--t-border': 'rgba(45, 212, 191, 0.2)',
      '--t-text': '#e9fdf6',
      '--t-text-muted': '#93c4b6',
      '--t-accent': '#2dd4bf',
      '--t-accent-2': '#10b981',
      '--t-accent-3': '#a3e635',
      '--t-on-accent': '#02120e',
    },
    aura: ['#0f766e', '#065f46', '#047857', '#134e4a'],
    price: 4.99,
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    emoji: '☀️',
    description: 'Bright, electric oranges & reds — pure energy.',
    vars: {
      '--t-bg': '#170804',
      '--t-bg-2': '#210b04',
      '--t-surface': 'rgba(76, 30, 12, 0.55)',
      '--t-surface-2': 'rgba(76, 30, 12, 0.85)',
      '--t-border': 'rgba(251, 146, 60, 0.22)',
      '--t-text': '#fff4ea',
      '--t-text-muted': '#dcae8b',
      '--t-accent': '#fb923c',
      '--t-accent-2': '#ef4444',
      '--t-accent-3': '#facc15',
      '--t-on-accent': '#1a0500',
    },
    aura: ['#c2410c', '#dc2626', '#f59e0b', '#9a3412'],
    price: 4.99,
  },
  {
    id: 'crystal-cave',
    name: 'Crystal Cave',
    emoji: '💎',
    description: 'Deep purples & crystalline blues, glinting in the dark.',
    vars: {
      '--t-bg': '#080a17',
      '--t-bg-2': '#0d1024',
      '--t-surface': 'rgba(30, 33, 74, 0.55)',
      '--t-surface-2': 'rgba(30, 33, 74, 0.85)',
      '--t-border': 'rgba(129, 140, 248, 0.2)',
      '--t-text': '#eef0ff',
      '--t-text-muted': '#a3a8d1',
      '--t-accent': '#818cf8',
      '--t-accent-2': '#38bdf8',
      '--t-accent-3': '#c084fc',
      '--t-on-accent': '#080a1a',
    },
    aura: ['#312e81', '#1e40af', '#5b21b6', '#0e7490'],
    price: 4.99,
  },
  {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    emoji: '🗼',
    description: 'Cyberpunk neon pinks & cyans on midnight black.',
    vars: {
      '--t-bg': '#050508',
      '--t-bg-2': '#0a0714',
      '--t-surface': 'rgba(30, 15, 51, 0.55)',
      '--t-surface-2': 'rgba(30, 15, 51, 0.88)',
      '--t-border': 'rgba(236, 72, 153, 0.28)',
      '--t-text': '#f5f0ff',
      '--t-text-muted': '#a99fc2',
      '--t-accent': '#ec4899',
      '--t-accent-2': '#22d3ee',
      '--t-accent-3': '#a3e635',
      '--t-on-accent': '#0a0010',
    },
    aura: ['#be185d', '#0891b2', '#7e22ce', '#db2777'],
    price: 4.99,
  },
]

export const DEFAULT_THEME_ID = 'aurora-borealis'

export function getTheme(id: string): ThemeDef {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

export function themeToCssVars(theme: ThemeDef): CSSProperties {
  return theme.vars as unknown as CSSProperties
}
