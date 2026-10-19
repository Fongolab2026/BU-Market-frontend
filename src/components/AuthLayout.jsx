import { Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

/**
 * Coque commune des écrans d'authentification (connexion, inscription,
 * connexion administrateur).
 *
 * Elle factorise la bascule de thème, le fond décoratif, la carte à deux
 * colonnes et le panneau de marque : les trois formulaires partagent donc
 * exactement le même gabarit et les mêmes proportions.
 *
 * - La carte ne s'étire plus sur toute la hauteur de l'écran : sa hauteur est
 *   donnée par `heroMinHeight` (desktop) ou par le contenu (mobile), et elle
 *   reste centrée verticalement.
 * - Sous `lg`, le panneau de marque disparaît et le formulaire occupe toute la
 *   largeur.
 *
 * @param {object}   brand          { to, label, mark } — logo, rendu en clair sur
 *                                  le panneau et en couleur dans l'en-tête mobile.
 * @param {ReactNode} heroBadge     pastille au-dessus du titre du panneau.
 * @param {string}   heroTitle      titre du panneau de marque.
 * @param {string}   heroText       paragraphe du panneau de marque.
 * @param {ReactNode} heroFooter    ligne d'assurance en bas du panneau.
 * @param {string}   eyebrow        sur-titre du formulaire.
 * @param {string}   title          titre du formulaire.
 * @param {string}   subtitle       sous-titre du formulaire.
 * @param {string}   heroMinHeight  classes de hauteur minimale du panneau.
 * @param {string}   formWidth      classe de largeur maximale du formulaire.
 * @param {ReactNode} alert         bandeau d'erreur éventuel.
 * @param {ReactNode} children      le formulaire.
 * @param {ReactNode} footer        lien de bas de formulaire.
 */
export default function AuthLayout({
  brand,
  heroBadge,
  heroTitle,
  heroText,
  heroFooter,
  eyebrow,
  title,
  subtitle,
  heroMinHeight = 'lg:min-h-[600px]',
  formWidth = 'max-w-md',
  backgroundImage = '/images/hero/hero-1.jpg',
  alert,
  children,
  footer,
}) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Fond de page : photo du projet + voile aux couleurs de la marque. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
        )}
        <div className="home-hero absolute inset-0 opacity-90" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        className="btn btn-ghost btn-circle absolute right-4 top-4 z-20 text-white/90 hover:bg-white/15 hover:text-white sm:right-8 sm:top-6"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-base-300 bg-[var(--surface)] shadow-2xl shadow-black/40 lg:grid-cols-2">
        {/* Panneau de marque (desktop uniquement) */}
        <section
          className={`home-hero relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-12 ${heroMinHeight}`}
        >
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col">
            <Link
              to={brand.to}
              className="inline-flex w-fit items-center gap-3 text-xl font-bold tracking-tight text-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                {brand.mark}
              </span>
              {brand.label}
            </Link>

            {heroBadge && (
              <span className="mt-14 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">
                {heroBadge}
              </span>
            )}

            <h2 className="mt-6 max-w-md text-3xl font-extrabold leading-tight text-white xl:text-4xl">
              {heroTitle}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/75">
              {heroText}
            </p>
          </div>

          {heroFooter && (
            <div className="relative flex items-center gap-3 text-sm font-medium text-white/80">
              {heroFooter}
            </div>
          )}
        </section>

        {/* Formulaire */}
        <section className="flex w-full flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
          <div className={`mx-auto w-full ${formWidth}`}>
            <Link
              to={brand.to}
              className="mb-8 inline-flex items-center gap-2 text-lg font-bold text-base-content lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
                {brand.mark}
              </span>
              {brand.label}
            </Link>

            <header className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  {subtitle}
                </p>
              )}
            </header>

            {alert}

            {children}

            {footer && (
              <p className="mt-7 text-center text-sm text-base-content/65">
                {footer}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
