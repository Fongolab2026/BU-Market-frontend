import { Mail, Quote, Store, Tag, User } from 'lucide-react'
import PhoneInput from '../../../components/PhoneInput.jsx'
import { Field, SelectField } from './Fields.jsx'
import { industries } from './constants.js'

export default function StepIdentity({ form, errors, updateField, sectionRef }) {
  return (
    <section ref={sectionRef} aria-labelledby="company-heading" className="scroll-mt-28">
      <h2 id="company-heading" className="sr-only">Informations de la boutique</h2>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field
          label="Nom de l’entreprise"
          name="companyName"
          value={form.companyName}
          error={errors.companyName}
          onChange={updateField}
          required
          icon={Store}
          autoComplete="organization"
          placeholder="Ex. Atelier du Burundi"
        />
        <Field
          label="Nom du propriétaire"
          name="ownerName"
          value={form.ownerName}
          error={errors.ownerName}
          onChange={updateField}
          required
          readOnly
          icon={User}
          placeholder="Nom du compte connecté"
        />
        <SelectField
          label="Industrie"
          name="industry"
          value={form.industry}
          onChange={updateField}
          error={errors.industry}
          required
          icon={Tag}
        >
          <option value="" disabled>Sélectionner une industrie</option>
          {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
        </SelectField>
        <Field
          label="Adresse e-mail"
          name="email"
          value={form.email}
          error={errors.email}
          onChange={updateField}
          type="email"
          required
          icon={Mail}
          autoComplete="email"
          placeholder="nom@entreprise.com"
        />
        <Field
          label="Téléphone"
          name="phone"
          required
          className="[&_.react-international-phone-country-selector-button]:h-11 [&_.react-international-phone-input]:h-11"
        >
          <PhoneInput
            id="phone"
            name="phone"
            required
            height="2.75rem"
            value={form.phone}
            error={errors.phone || undefined}
            onChange={(value) => updateField({ target: { name: 'phone', value } })}
          />
        </Field>
        <Field
          label="WhatsApp (facultatif)"
          name="whatsapp"
          className="[&_.react-international-phone-country-selector-button]:h-11 [&_.react-international-phone-input]:h-11"
        >
          <PhoneInput
            id="whatsapp"
            name="whatsapp"
            height="2.75rem"
            value={form.whatsapp}
            error={errors.whatsapp || undefined}
            onChange={(value) => updateField({ target: { name: 'whatsapp', value } })}
          />
        </Field>
        <Field
          label="Slogan du magasin"
          name="slogan"
          value={form.slogan}
          error={errors.slogan}
          onChange={updateField}
          icon={Quote}
          placeholder="Une courte phrase pour présenter votre boutique"
          className="sm:col-span-2"
        />
      </div>
    </section>
  )
}
