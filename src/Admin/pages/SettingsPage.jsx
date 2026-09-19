import { useEffect, useState } from 'react'
import { Globe2, LoaderCircle, LockKeyhole, Mail, Phone, Plus, Save, Settings2, ShieldCheck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/mockAdminService.js'
import { PageHeader } from '../components/ui.jsx'

export function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { adminService.getSettings().then(setSettings) }, [])
  if (!settings) return <div className="h-96 animate-pulse rounded-2xl bg-base-200" />
  const update = (path, value) => setSettings((current) => path.startsWith('moderation.') ? { ...current, moderation: { ...current.moderation, [path.split('.')[1]]: value } } : { ...current, [path]: value })
  const save = async () => { setSaving(true); await adminService.updateSettings(settings); setSaving(false); toast.success('Les paramètres ont été enregistrés.') }
  const addCategory = async (event) => { event.preventDefault(); if (!newCategory.trim()) return; const categories = await adminService.addCategory(newCategory.trim()); setSettings((current) => ({ ...current, categories })); setNewCategory(''); toast.success('Catégorie ajoutée.') }
  const removeCategory = async (id) => { const categories = await adminService.removeCategory(id); setSettings((current) => ({ ...current, categories })); toast.success('Catégorie supprimée.') }
  return <>
    <PageHeader title="Paramètres" description="Informations de la plateforme, règles de validation et catégories." action={<button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:opacity-60">{saving ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />} Enregistrer</button>} />
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.75fr)]">
      <div className="space-y-4">
        <SettingsCard icon={Settings2} title="Informations générales" description="Ces coordonnées serviront aux utilisateurs de la plateforme.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de la plateforme" value={settings.platformName} onChange={(value) => update('platformName', value)} className="sm:col-span-2" />
            <Field label="E-mail de support" type="email" icon={Mail} value={settings.supportEmail} onChange={(value) => update('supportEmail', value)} />
            <Field label="Téléphone de contact" icon={Phone} value={settings.phone} onChange={(value) => update('phone', value)} />
            <label className="block"><span className="mb-1.5 block text-sm font-semibold text-base-content/80">Langue par défaut</span><div className="relative"><Globe2 size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" /><select value={settings.defaultLanguage} onChange={(event) => update('defaultLanguage', event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"><option value="fr">Français</option><option value="en">English</option></select></div></label>
          </div>
        </SettingsCard>
        <SettingsCard icon={ShieldCheck} title="Règles de modération" description="Les règles appliquées lors des prochaines soumissions.">
          <div className="divide-y divide-base-200">
            <Toggle label="Valider les nouvelles boutiques" description="Toute nouvelle boutique doit être validée avant publication." checked={settings.moderation.requireShopApproval} onChange={(value) => update('moderation.requireShopApproval', value)} />
            <Toggle label="Valider les nouveaux produits" description="Les produits sont soumis à validation avant affichage." checked={settings.moderation.requireProductApproval} onChange={(value) => update('moderation.requireProductApproval', value)} />
            <Toggle label="Masquer les avis signalés" description="Un avis signalé est masqué tant qu’il n’est pas vérifié." checked={settings.moderation.hideReportedReviews} onChange={(value) => update('moderation.hideReportedReviews', value)} />
          </div>
        </SettingsCard>
      </div>
      <div className="space-y-4">
        <SettingsCard icon={LockKeyhole} title="Accès & sécurité" description="Les rôles et autorisations seront appliqués côté API Django.">
          <div className="border-l-2 border-accent bg-amber-50/60 p-3"><p className="text-sm font-semibold text-accent-content">Accès protégé</p><p className="mt-1 text-xs leading-5 text-base-content/70">Le frontend vérifie le rôle. Le backend devra aussi valider le JWT et les permissions sur chaque endpoint.</p></div>
        </SettingsCard>
        <section className="card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand"><Settings2 size={19} /></span>
            <div><h2 className="font-semibold text-base-content">Catégories de produits</h2><p className="mt-1 text-sm text-base-content/55">Gérez les catégories proposées aux commerçants.</p></div>
          </div>
          <form onSubmit={addCategory} className="mt-4 flex gap-2">
            <label className="sr-only" htmlFor="new-category">Nouvelle catégorie</label>
            <input id="new-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Ex. Électronique" className="h-10 min-w-0 flex-1 border border-base-300 px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
            <button className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-soft" aria-label="Ajouter la catégorie"><Plus size={19} /></button>
          </form>
          <div className="mt-4 divide-y divide-base-200">{settings.categories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 py-3 first:pt-0"><div><p className="text-sm font-semibold text-base-content">{category.name}</p><p className="mt-0.5 text-xs text-base-content/45">{category.count} produits</p></div><button onClick={() => removeCategory(category.id)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${category.name}`}><Trash2 size={17} /></button></div>)}</div>
        </section>
      </div>
    </div>
  </>
}

function SettingsCard({ icon: Icon, title, description, children }) { return <section className="card p-4 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand"><Icon size={19} /></span><div><h2 className="font-semibold text-base-content">{title}</h2><p className="mt-1 text-sm leading-5 text-base-content/55">{description}</p></div></div><div className="mt-5">{children}</div></section> }
function Field({ label, type = 'text', icon: Icon, value, onChange, className = '' }) { return <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span><div className="relative">{Icon && <Icon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 w-full border border-base-300 bg-white ${Icon ? 'pl-10' : 'px-3'} pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10`} /></div></label> }
function Toggle({ label, description, checked, onChange }) { return <label className="flex cursor-pointer items-center justify-between gap-4 py-3 first:pt-0"><span><span className="block text-sm font-semibold text-base-content">{label}</span><span className="mt-1 block text-xs leading-5 text-base-content/55">{description}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" /><span className="relative h-6 w-11 shrink-0 rounded-full bg-base-300 transition after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:bg-brand peer-checked:after:translate-x-5" /></label> }