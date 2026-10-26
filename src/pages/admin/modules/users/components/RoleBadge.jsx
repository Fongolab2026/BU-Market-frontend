import { ROLE_META, SUPER_ADMIN_META } from './usersConstants.js'

export default function RoleBadge({ role, superAdmin = false }) {
  const meta = superAdmin ? SUPER_ADMIN_META : ROLE_META[role] || ROLE_META.buyer
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${meta.className}`}
    >
      <Icon size={13} /> {meta.label}
    </span>
  )
}
