import { Link } from 'react-router-dom'
import { Headphones, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from 'primereact/button'
import { useAuth } from '../../../context/AuthContext.jsx'
import Reveal from '../../../components/Reveal.jsx'
import useContactForm from './useContactForm.js'

const CONTACT_DETAILS = [
  { icon: Mail, text: 'support@bu-market.app' },
  { icon: Phone, text: '+257 66 57 55 86' },
  { icon: MapPin, text: 'Bujumbura, Burundi' },
  { icon: Clock, text: 'Lun – Ven : 7h – 18h' },
]

export default function HomeContact() {
  const { user } = useAuth()
  const {
    contactForm,
    updateContactField,
    contactSent,
    contactSending,
    contactError,
    handleContactSubmit,
  } = useContactForm(user)

  return (
    <Reveal as="section" id="contact" className="scroll-mt-24 bg-base-200/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">Contact</span>
            <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl md:text-4xl">
              Nous contacter
            </h2>
            <p className="mt-4 text-sm leading-6 text-base-content/75 sm:text-base sm:leading-7">
              Une question, une suggestion ou un problème ? Notre équipe est là
              pour vous aider. Nous vous répondrons dans les plus brefs délais.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {CONTACT_DETAILS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-base-content/75">
                  <Icon size={20} className="shrink-0 text-primary" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            variant="right"
            delay={120}
            className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm sm:p-8"
          >
            {!user ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Headphones size={32} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-base-content sm:text-xl">
                  Connectez-vous pour nous écrire
                </h3>
                <p className="text-sm text-base-content/60">
                  Le formulaire de contact est réservé aux comptes clients connectés.
                </p>
                <Link to="/connexion" className="btn btn-primary gap-2">
                  Se connecter
                </Link>
              </div>
            ) : contactSent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                  <Send size={32} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-base-content sm:text-xl">Message envoyé !</h3>
                <p className="text-sm text-base-content/60">
                  Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                {contactError && (
                  <p className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
                    {contactError}
                  </p>
                )}
                <div className="mb-4">
                  <label htmlFor="contact-subject" className="mb-1 block text-sm font-semibold text-base-content">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    required
                    maxLength={200}
                    value={contactForm.subject}
                    onChange={updateContactField}
                    className="field-input h-12 w-full px-4 text-sm"
                    placeholder="Objet de votre message"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-base-content">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                    value={contactForm.message}
                    onChange={updateContactField}
                    className="field-input min-h-32 w-full resize-y px-4 py-3 text-sm"
                    placeholder="Votre message..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={contactSending}
                  className="mt-2 gap-2"
                  severity="primary"
                >
                  <Send size={18} aria-hidden="true" />
                  {contactSending ? 'Envoi...' : 'Envoyer le message'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </Reveal>
  )
}
