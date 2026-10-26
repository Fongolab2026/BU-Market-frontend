import { Camera, Link2, Music2, Share2, ShieldCheck } from 'lucide-react'
import { Field } from './Fields.jsx'

export default function StepSocial({ form, errors, updateField, sectionRef }) {
  return (
    <section ref={sectionRef} aria-labelledby="social-heading" className="scroll-mt-28">
      <h2 id="social-heading" className="sr-only">Réseaux sociaux</h2>

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field
          label="Lien Facebook"
          name="facebook"
          value={form.facebook}
          error={errors.facebook}
          onChange={updateField}
          type="url"
          icon={Share2}
          placeholder="https://facebook.com/votre-boutique"
        />
        <Field
          label="Lien Instagram"
          name="instagram"
          value={form.instagram}
          error={errors.instagram}
          onChange={updateField}
          type="url"
          icon={Camera}
          placeholder="https://instagram.com/votre-boutique"
        />
        <Field
          label="Lien TikTok"
          name="tiktok"
          value={form.tiktok}
          error={errors.tiktok}
          onChange={updateField}
          type="url"
          icon={Music2}
          placeholder="https://tiktok.com/@votre-boutique"
        />
        <Field
          label="Site web"
          name="website"
          value={form.website}
          error={errors.website}
          onChange={updateField}
          type="url"
          icon={Link2}
          placeholder="https://votre-site.com"
        />
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-xl bg-base-200/60 px-4 py-3 text-[11px] leading-5 text-base-content/50">
        <ShieldCheck size={15} className="mt-px shrink-0 text-primary" aria-hidden="true" />
        Ces liens sont facultatifs. Ils seront affichés publiquement sur la fiche de votre boutique.
      </p>
    </section>
  )
}
