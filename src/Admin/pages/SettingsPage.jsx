import { useEffect, useState } from 'react'
import { Banknote, Bell, Check, Languages, LoaderCircle, Mail, Pencil, Phone, Plus, SaveAll, Settings2, ShieldCheck, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/mockAdminService.js'
import { PageHeader } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/ConfirmDialog.jsx'

export function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { adminService.getSettings().then(setSettings) }, [])

  if (!settings) return <div className="h-96 animate-pulse rounded-2xl bg-base-200" />

  const update = (path, value) => {
    setSettings((current) => {
      const segments = path.split('.')
      if (segments.length === 1) return { ...current, [path]: value }
      const [parent, child] = segments
      return { ...current, [parent]: { ...current[parent], [child]: value } }
    })
  }

  const save = async () => {
    setSaving(true)
    await adminService.updateSettings(settings)
    setSaving(false)
    toast.success('Les paramètres ont été enregistrés.')
  }

  const addCategory = async (event) => {
    event.preventDefault()
    if (!newCategory.trim()) return
    const categories = await adminService.addCategory(newCategory.trim())
    setSettings((current) => ({ ...current, categories }))
    setNewCategory('')
    toast.success('Catégorie ajoutée.')
  }

  const startRename = (category) => { setEditingId(category.id); setEditingName(category.name) }

  const saveRename = async () => {
    if (!editingName.trim()) return
    const categories = await adminService.renameCategory(editingId, editingName.trim())
    setSettings((current) => ({ ...current, categories }))
    setEditingId(null)
    setEditingName('')
    toast.success('Catégorie renommée.')
  }

  const cancelRename = () => { setEditingId(null); setEditingName('') }

  const removeCategory = async () => {
    if (!deleteTarget) return
    const categories = await adminService.removeCategory(deleteTarget.id)
    setSettings((current) => ({ ...current, categories }))
    setDeleteTarget(null)
    toast.success('Catégorie supprimée.')
  }

  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Informations de la plateforme, règles de validation et catégories."
        action={
          <button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:opacity-60">
            {saving ? <LoaderCircle size={17} className="animate-spin" /> : <SaveAll size={17} />} Enregistrer
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.75fr)]">
        <div className="space-y-4">
          <SettingsCard
            icon={Settings2}
            title="Informations générales"
            description="Ces coordonnées servent aux utilisateurs de la plateforme."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom de la plateforme" value={settings.platformName} onChange={(value) => update('platformName', value)} className="sm:col-span-2" />
              <Field label="E-mail de contact" type="email" icon={Mail} value={settings.supportEmail} onChange={(value) => update('supportEmail', value)} />
              <Field label="Téléphone de contact" icon={Phone} value={settings.phone} onChange={(value) => update('phone', value)} />
              <FieldSelect label="Langue par défaut" icon={Languages} value={settings.defaultLanguage} onChange={(value) => update('defaultLanguage', value)} options={[{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }]} />
              <FieldSelect label="Devise" icon={Banknote} value={settings.currency} onChange={(value) => update('currency', value)} options={[{ value: 'BIF', label: 'Franc burundais (BIF)' }, { value: 'USD', label: 'Dollar américain (USD)' }, { value: 'EUR', label: 'Euro (EUR)' }]} />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={ShieldCheck}
            title="Règles de validation"
            description="Validez ou non les nouveaux ajouts avant leur publication."
          >
            <div className="divide-y divide-base-200">
              <Toggle label="Valider les nouvelles boutiques" description="Toute nouvelle boutique doit être validée avant publication." checked={settings.moderation.requireShopApproval} onChange={(value) => update('moderation.requireShopApproval', value)} />
              <Toggle label="Valider les nouveaux produits" description="Les produits sont soumis à validation avant affichage." checked={settings.moderation.requireProductApproval} onChange={(value) => update('moderation.requireProductApproval', value)} />
              <Toggle label="Masquer les avis signalés" description="Un avis signalé est masqué tant qu’il n’est pas vérifié." checked={settings.moderation.hideReportedReviews} onChange={(value) => update('moderation.hideReportedReviews', value)} />
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-4">
          <SettingsCard
            icon={Bell}
            title="Notifications par e-mail"
            description="Les alertes reçues sur la boîte de contact."
          >
            <div className="divide-y divide-base-200">
              <Toggle label="Nouvelle boutique à valider" description="Un e-mail est envoyé dès qu’une boutique est soumise." checked={settings.notifications.newShopPending} onChange={(value) => update('notifications.newShopPending', value)} />
              <Toggle label="Avis signalé" description="Un e-mail est envoyé dès qu’un avis est signalé." checked={settings.notifications.newReportedReview} onChange={(value) => update('notifications.newReportedReview', value)} />
              <Toggle label="Synthèse hebdomadaire" description="Un récapitulatif d’activité arrive chaque lundi matin." checked={settings.notifications.weeklyDigest} onChange={(value) => update('notifications.weeklyDigest', value)} />
            </div>
          </SettingsCard>

          <CategoriesCard
            settings={settings}
            newCategory={newCategory}
            editingId={editingId}
            editingName={editingName}
            setNewCategory={setNewCategory}
            addCategory={addCategory}
            startRename={startRename}
            saveRename={saveRename}
            cancelRename={cancelRename}
            setEditingName={setEditingName}
            removeCategory={setDeleteTarget}
          />
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer la catégorie"
        message={deleteTarget ? `La catégorie « ${deleteTarget.name} » sera supprimée. Cette action est irréversible.` : ''}
        confirmLabel="Supprimer"
        onConfirm={removeCategory}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

function CategoriesCard({ settings, newCategory, editingId, editingName, setNewCategory, addCategory, startRename, saveRename, cancelRename, setEditingName, removeCategory }) {
  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
          <Settings2 size={19} />
        </span>
        <div>
          <h2 className="font-semibold text-base-content">Catégories de produits et de boutiques</h2>
          <p className="mt-1 text-sm text-base-content/55">Ajoutez, modifiez ou supprimez les catégories partagées par les produits et les boutiques.</p>
        </div>
      </div>

      <form onSubmit={addCategory} className="mt-4 flex gap-2">
        <label className="sr-only" htmlFor="new-category">Nouvelle catégorie</label>
        <input id="new-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nom de la catégorie" className="h-10 min-w-0 flex-1 border border-base-300 px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
        <button type="submit" className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-soft" aria-label="Ajouter la catégorie">
          <Plus size={19} />
        </button>
      </form>

      <div className="mt-4 divide-y divide-base-200">
        {settings.categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
            <div className="min-w-0 flex-1">
              {editingId === category.id ? (
                <div className="flex gap-2">
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    onKeyDown={(event) => { if (event.key === 'Enter') saveRename(); if (event.key === 'Escape') cancelRename() }}
                    autoFocus
                    className="h-9 min-w-0 flex-1 border border-base-300 px-2.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  />
                  <button onClick={saveRename} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-soft" aria-label="Valider la modification">
                    <Check size={16} />
                  </button>
                  <button onClick={cancelRename} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-base-300 text-base-content/50 transition hover:bg-base-100" aria-label="Annuler">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-base-content">{category.name}</p>
                  <p className="mt-0.5 text-xs text-base-content/45">{category.count} produits</p>
                </>
              )}
            </div>
            {editingId !== category.id && (
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => startRename(category)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand" aria-label={`Renommer ${category.name}`}>
                  <Pencil size={17} />
                </button>
                <button onClick={() => removeCategory(category.id, category.name)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${category.name}`}>
                  <Trash2 size={17} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
          <Icon size={19} />
        </span>
        <div>
          <h2 className="font-semibold text-base-content">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-base-content/55">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Field({ label, type = 'text', icon: Icon, value, onChange, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span>
      <div className="relative">
        {Icon && <Icon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 w-full border border-base-300 bg-white ${Icon ? 'pl-10' : 'px-3'} pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10`} />
      </div>
    </label>
  )
}

function FieldSelect({ label, icon: Icon, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span>
      <div className="relative">
        {Icon && <Icon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />}
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10">
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </label>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3 first:pt-0">
      <span>
        <span className="block text-sm font-semibold text-base-content">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-base-content/55">{description}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-base-300 transition after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:bg-brand peer-checked:after:translate-x-5" />
    </label>
  )
}