import { Award, Headphones, Heart, RotateCcw, ShieldCheck, Truck, Users } from 'lucide-react'

export const TRUST_POINTS = [
  { icon: Truck, title: 'Livraison rapide', text: 'Expédition sous 24h' },
  { icon: ShieldCheck, title: 'Paiement sécurisé', text: 'Transactions protégées' },
  { icon: RotateCcw, title: 'Retours faciles', text: 'Satisfait ou remboursé' },
  { icon: Headphones, title: 'Support 7j/7', text: 'Une équipe à votre écoute' },
]

export const VALUES = [
  {
    icon: Heart,
    title: 'Passion',
    text: 'Nous adorons vous aider à trouver les produits qui correspondent à vos besoins et à votre style de vie.',
  },
  {
    icon: ShieldCheck,
    title: 'Confiance',
    text: 'Chaque vendeur est vérifié pour garantir une expérience d’achat sûre et fiable.',
  },
  {
    icon: Users,
    title: 'Communauté',
    text: 'Nous construisons une communauté de confiance entre acheteurs et vendeurs.',
  },
  {
    icon: Award,
    title: 'Qualité',
    text: 'Une sélection rigoureuse de produits de qualité pour votre satisfaction maximale.',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Acheteuse régulière',
    text: 'J’ai trouvé exactement ce que je cherchais. La qualité des produits est au rendez-vous et la livraison est toujours à l’heure.',
    rating: 5,
  },
  {
    name: 'Thomas D.',
    role: 'Vendeur',
    text: 'BU-Market m’a permis de développer mon activité. L’interface est intuitive et le support est toujours disponible pour m’aider.',
    rating: 5,
  },
  {
    name: 'Sophie B.',
    role: 'Cliente fidèle',
    text: 'Je suis impressionnée par la variété des produits et les prix compétitifs. C’est ma plateforme de shopping préférée.',
    rating: 5,
  },
]

export const PRODUCTS_PER_PAGE = 20
