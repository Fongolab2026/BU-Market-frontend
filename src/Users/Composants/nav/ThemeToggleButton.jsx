import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext.jsx'

/** Bouton clair/sombre partagé par la navigation publique et connectée. */
export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Activer le mode clair' : 'Activer le mode sombre'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-base-content/60 transition-colors hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
