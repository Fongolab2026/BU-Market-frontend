import {
  Apple,
  Baby,
  BookOpen,
  Car,
  Coffee,
  Cpu,
  Dumbbell,
  Flower2,
  Gamepad2,
  Gift,
  Hammer,
  HeartPulse,
  House,
  Lightbulb,
  Music,
  Package,
  PawPrint,
  Palette,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  Sprout,
  TreePine,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react'

/**
 * Visuels des catégories.
 *
 * Chaque catégorie affiche l'image téléversée (`category.image`). À défaut,
 * on construit une « couverture » cohérente : icône pertinente + dégradé dont
 * la teinte découle du thème de la catégorie (alimentation → vert,
 * high-tech → ciel, etc.).
 */

export const CATEGORY_ICONS = [
  { key: 'apple', label: 'Alimentation', Icon: Apple, group: 'food' },
  { key: 'shopping-basket', label: 'Épicerie', Icon: ShoppingBasket, group: 'food' },
  { key: 'utensils', label: 'Restaurant', Icon: UtensilsCrossed, group: 'food' },
  { key: 'coffee', label: 'Boissons', Icon: Coffee, group: 'food' },
  { key: 'shirt', label: 'Mode', Icon: Shirt, group: 'mode' },
  { key: 'sparkles', label: 'Beauté', Icon: Sparkles, group: 'mode' },
  { key: 'wrench', label: 'Artisanat', Icon: Wrench, group: 'craft' },
  { key: 'hammer', label: 'Outillage', Icon: Hammer, group: 'craft' },
  { key: 'house', label: 'Maison', Icon: House, group: 'home' },
  { key: 'sofa', label: 'Meuble', Icon: Sofa, group: 'home' },
  { key: 'lightbulb', label: 'Décoration', Icon: Lightbulb, group: 'home' },
  { key: 'smartphone', label: 'Électronique', Icon: Smartphone, group: 'tech' },
  { key: 'cpu', label: 'Informatique', Icon: Cpu, group: 'tech' },
  { key: 'book-open', label: 'Livres', Icon: BookOpen, group: 'leisure' },
  { key: 'gamepad', label: 'Jeux vidéo', Icon: Gamepad2, group: 'leisure' },
  { key: 'music', label: 'Musique', Icon: Music, group: 'leisure' },
  { key: 'palette', label: 'Création', Icon: Palette, group: 'leisure' },
  { key: 'tree-pine', label: 'Nature', Icon: TreePine, group: 'nature' },
  { key: 'sprout', label: 'Jardin', Icon: Sprout, group: 'nature' },
  { key: 'flower', label: 'Fleurs', Icon: Flower2, group: 'nature' },
  { key: 'car', label: 'Transport', Icon: Car, group: 'auto' },
  { key: 'dumbbell', label: 'Sport', Icon: Dumbbell, group: 'auto' },
  { key: 'heart-pulse', label: 'Santé', Icon: HeartPulse, group: 'health' },
  { key: 'baby', label: 'Enfant', Icon: Baby, group: 'health' },
  { key: 'paw-print', label: 'Animaux', Icon: PawPrint, group: 'health' },
  { key: 'gift', label: 'Cadeaux', Icon: Gift, group: 'craft' },
  { key: 'package', label: 'Divers', Icon: Package, group: 'home' },
]

export const ICONS_BY_KEY = Object.fromEntries(
  CATEGORY_ICONS.map((entry) => [entry.key, entry]),
)

/** Dégradés : `ember` reprend la palette du projet (#c2410c → #f0a500). */
export const PALETTES = {
  ember: ['#c2410c', '#f0a500'],
  leaf: ['#15803d', '#65a30d'],
  amber: ['#b45309', '#f59e0b'],
  rose: ['#be123c', '#fb7185'],
  sky: ['#0369a1', '#38bdf8'],
  violet: ['#6d28d9', '#a78bfa'],
}

const GROUP_PALETTE = {
  food: 'leaf',
  nature: 'leaf',
  mode: 'rose',
  health: 'rose',
  craft: 'amber',
  auto: 'amber',
  tech: 'sky',
  leisure: 'violet',
  home: 'ember',
}

// L'ordre compte : les mots-clés les plus spécifiques d'abord, sinon
// « accessoire » (dans « appareils et accessoires tech ») volait l'icône
// de la catégorie Électronique.
const KEYWORDS = [
  // `icon` : icône la plus parlante pour ce thème (sinon `GROUP_ICON[group]`).
  { group: 'tech', icon: 'smartphone', words: ['electronique', 'high-tech', 'hightech', 'telephon', 'numerique', 'gadget'] },
  { group: 'tech', icon: 'cpu', words: ['informatique', 'ordinateur', 'logiciel', 'informat'] },
  { group: 'food', icon: 'apple', words: ['alimentation', 'epicerie', 'food', 'restaur', 'cuisine', 'boisson', 'cafe'] },
  { group: 'craft', icon: 'wrench', words: ['artisanat', 'outillage', 'bricolage', 'fait'] },
  { group: 'craft', icon: 'gift', words: ['cadeau'] },
  { group: 'leisure', icon: 'gamepad', words: ['jeu', 'video', 'game'] },
  { group: 'leisure', icon: 'music', words: ['musique', 'audio'] },
  { group: 'leisure', icon: 'book-open', words: ['livre', 'librairie'] },
  { group: 'leisure', icon: 'palette', words: ['creation', 'culture', 'peinture'] },
  { group: 'nature', icon: 'sprout', words: ['jardin', 'agriculture', 'plante', 'ecologie'] },
  { group: 'nature', icon: 'flower', words: ['fleur', 'fleuriste'] },
  { group: 'auto', icon: 'car', words: ['auto', 'transport', 'velo', 'moto'] },
  { group: 'auto', icon: 'dumbbell', words: ['sport'] },
  { group: 'health', icon: 'baby', words: ['enfant', 'bebe', 'puericulture'] },
  { group: 'health', icon: 'paw-print', words: ['animal', 'animalerie', 'animaux'] },
  { group: 'health', icon: 'heart-pulse', words: ['sante', 'pharmacie', 'medecin'] },
  { group: 'home', icon: 'house', words: ['maison', 'interieur'] },
  { group: 'home', icon: 'sofa', words: ['meuble', 'decoration', 'luminaire'] },
  { group: 'mode', icon: 'sparkles', words: ['beaute', 'cosmetiq', 'soin'] },
  { group: 'mode', icon: 'shirt', words: ['mode', 'vetement', 'habill', 'chaussure', 'accessoire'] },
]

/** Icône par défaut d'un thème, quand aucun mot-clé plus précis ne matche. */
const GROUP_ICON = {
  food: 'apple',
  nature: 'sprout',
  mode: 'shirt',
  health: 'heart-pulse',
  craft: 'wrench',
  auto: 'car',
  tech: 'smartphone',
  leisure: 'book-open',
  home: 'house',
}

const normalize = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const hashKey = (value = '') => {
  let hash = 0
  for (const char of String(value)) hash = (hash * 31 + char.charCodeAt(0)) % 100000
  return hash
}

/**
 * Icône « générique » : valeur renvoyée par défaut par le backend pour toutes
 * les catégories créées avant le sélecteur d'icônes. Elle ne doit pas écraser
 * ce que disent le nom et la description.
 */
const GENERIC_ICON = 'package'

/**
 * Groupe thématique déduit du nom puis de la description.
 * L'icône stockée ne sert que de secours, et jamais si c'est le générique
 * (sinon chaque catégorie sans choix explicite retomberait sur « Divers »).
 */
const resolveGroup = (category = {}) => {
  const haystack = normalize(`${category.name || ''} ${category.description || ''}`)
  const keyword = KEYWORDS.find((entry) =>
    entry.words.some((word) => haystack.includes(word)),
  )
  if (keyword) return keyword.group
  const stored = ICONS_BY_KEY[category.icon]
  return stored && stored.key !== GENERIC_ICON ? stored.group : null
}

/** Mot-clé retenu pour la catégorie (pour en déduire l'icône la plus juste). */
const resolveKeywordIcon = (category = {}) => {
  const haystack = normalize(`${category.name || ''} ${category.description || ''}`)
  const keyword = KEYWORDS.find((entry) =>
    entry.words.some((word) => haystack.includes(word)),
  )
  if (!keyword) return null
  return ICONS_BY_KEY[keyword.icon] || ICONS_BY_KEY[GROUP_ICON[keyword.group]] || null
}

/**
 * Résout l'affichage d'une catégorie : icône + dégradé.
 * L'image téléversée, si elle existe, prend le dessus côté couverture.
 *
 * Ordre de préférence de l'icône :
 *  1. celle choisie par le vendeur (hors valeur par défaut générique),
 *  2. celle déduite des mots-clés du nom/description,
 *  3. celle stockée en base,
 *  4. une correspondance de libellé (« Habilllement » → « Mode »),
 *  5. le repli générique « Divers ».
 */
export function resolveCategoryVisual(category = {}) {
  const group = resolveGroup(category)
  const stored = ICONS_BY_KEY[category.icon] || null
  const keywordIcon = resolveKeywordIcon(category)
  const labelIcon =
    CATEGORY_ICONS.find((entry) =>
      normalize(category.name || '').includes(normalize(entry.label.split(' ')[0])),
    ) || null

  const icon =
    (stored && stored.key !== GENERIC_ICON ? stored : null) ||
    keywordIcon ||
    stored ||
    labelIcon ||
    ICONS_BY_KEY[GENERIC_ICON]

  const paletteKeys = Object.keys(PALETTES)
  const paletteKey = group
    ? GROUP_PALETTE[group]
    : paletteKeys[hashKey(category.name || category.id || '') % paletteKeys.length]

  return {
    Icon: icon.Icon,
    iconKey: icon.key,
    iconLabel: icon.label,
    group,
    gradient: PALETTES[paletteKey] || PALETTES.ember,
  }
}
