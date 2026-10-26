import { Moon, Sun } from 'lucide-react'
import { Button } from 'primereact/button'
import { useTheme } from '../../../context/ThemeContext.jsx'

/** Bouton clair/sombre partagé par la navigation publique et connectée. */
export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Activer le mode clair' : 'Activer le mode sombre'

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      icon={isDark ? <Sun size={21} /> : <Moon size={21} />}
      title={label}
      aria-label={label}
      text
      rounded
      className="flex! size-10! items-center! justify-center! text-base-content/65! transition-colors hover:bg-base-200! hover:text-primary!"
    />
  )
}
