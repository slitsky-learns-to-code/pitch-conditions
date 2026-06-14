import { useState, useEffect } from 'react'

// Where we remember the user's choice between visits.
const STORAGE_KEY = 'pitch-conditions-theme'

// The three modes shown in the segmented control.
const OPTIONS = ['light', 'system', 'dark']

// The OS-level "is the user in dark mode?" query.
const darkQuery = '(prefers-color-scheme: dark)'

// Resolve a chosen mode down to a concrete 'light' | 'dark' and write it onto
// <html data-theme="...">, which is what the CSS variables key off of.
function applyTheme(mode) {
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia(darkQuery).matches)
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  // Lazy initializer (the function form of useState) runs only on first render.
  // We read the saved choice from localStorage, defaulting to 'system'.
  const [mode, setMode] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'system',
  )

  // Re-run whenever `mode` changes: apply the theme and remember the choice.
  useEffect(() => {
    applyTheme(mode)
    localStorage.setItem(STORAGE_KEY, mode)

    // Only in "system" mode do we care about live OS changes. If the user
    // flips their Mac to dark while we're on System, update immediately.
    if (mode !== 'system') return
    const mq = window.matchMedia(darkQuery)
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)

    // Cleanup: remove the listener if mode changes or the component unmounts,
    // so we don't leak listeners or react to changes we no longer care about.
    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          className={`theme-btn${mode === opt ? ' is-active' : ''}`}
          onClick={() => setMode(opt)}
          aria-pressed={mode === opt}
        >
          {/* Capitalize for display: 'light' -> 'Light' */}
          {opt[0].toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  )
}
