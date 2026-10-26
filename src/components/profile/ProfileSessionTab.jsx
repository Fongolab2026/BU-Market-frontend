import { KeyRound, LogOut } from 'lucide-react'
import { Card } from './ProfileFormFields.jsx'

export default function ProfileSessionTab({ displayName, email, onLogout }) {
  return (
    <Card
      icon={KeyRound}
      title="Session et déconnexion"
      description="Informations sur votre session en cours."
    >
      <div className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-200/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Connecté en tant que {displayName}</p>
          <p className="truncate text-xs text-base-content/60">{email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="btn btn-outline shrink-0 border-error text-error hover:bg-error hover:text-error-content"
        >
          <LogOut className="size-4" /> Se déconnecter
        </button>
      </div>
    </Card>
  )
}
