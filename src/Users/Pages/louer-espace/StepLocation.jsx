import { useMemo } from 'react'
import { Building2, MapPin } from 'lucide-react'
import { BURUNDI_LOCATIONS } from '../../../data/burundiLocations.js'
import { Field, SelectField } from './Fields.jsx'

export default function StepLocation({
  form,
  errors,
  neighborhoodKey,
  updateField,
  onProvinceChange,
  onCommuneChange,
  onNeighborhoodChange,
  sectionRef,
}) {
  const communes = useMemo(
    () => (form.province ? Object.keys(BURUNDI_LOCATIONS[form.province] ?? {}) : []),
    [form.province],
  )
  const neighborhoodZones = useMemo(
    () => (form.province && form.commune
      ? (BURUNDI_LOCATIONS[form.province]?.[form.commune] ?? {})
      : {}),
    [form.province, form.commune],
  )

  return (
    <section ref={sectionRef} aria-labelledby="location-heading" className="scroll-mt-28">
      <h2 id="location-heading" className="sr-only">Emplacement de l’entreprise</h2>

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <SelectField
          label="Province"
          name="province"
          value={form.province}
          onChange={onProvinceChange}
          error={errors.province}
          required
          icon={MapPin}
        >
          <option value="" disabled>Sélectionner une province</option>
          {Object.keys(BURUNDI_LOCATIONS).map((province) => (
            <option key={province} value={province}>{province}</option>
          ))}
        </SelectField>
        <SelectField
          label="Commune"
          name="commune"
          value={form.commune}
          onChange={onCommuneChange}
          error={errors.commune}
          required
          disabled={!form.province}
          icon={Building2}
        >
          <option value="" disabled>
            {form.province ? 'Sélectionner une commune' : 'Choisir d’abord une province'}
          </option>
          {communes.map((commune) => <option key={commune} value={commune}>{commune}</option>)}
        </SelectField>
        <SelectField
          label="Quartier / colline"
          name="neighborhood"
          value={neighborhoodKey}
          onChange={onNeighborhoodChange}
          error={errors.neighborhood}
          required
          disabled={!form.commune}
          icon={MapPin}
          className="sm:col-span-2"
        >
          <option value="" disabled>
            {form.commune ? 'Sélectionner un quartier ou une colline' : 'Choisir d’abord une commune'}
          </option>
          {Object.entries(neighborhoodZones).map(([zone, quartiers]) => (
            <optgroup key={zone} label={`Zone ${zone}`}>
              {quartiers.map((neighborhood, index) => (
                <option key={`${zone}-${neighborhood}-${index}`} value={`${zone}::${neighborhood}`}>
                  {neighborhood}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="Autre">Autre</option>
        </SelectField>
        {form.neighborhood === 'Autre' && (
          <Field
            label="Précisez le quartier ou la colline"
            name="otherNeighborhood"
            value={form.otherNeighborhood}
            error={errors.otherNeighborhood}
            onChange={updateField}
            required
            icon={MapPin}
            placeholder="Nom du quartier ou de la colline"
            className="sm:col-span-2"
          />
        )}
      </div>
    </section>
  )
}
