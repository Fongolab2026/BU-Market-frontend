export const ORDER_STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  completed: 'Livrée',
  cancelled: 'Annulée',
}

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
)

const NEXT_ORDER_STATUSES = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped'],
  shipped: ['completed'],
  completed: [],
  cancelled: [],
}

export function getOrderStatusOptions(currentStatus) {
  const available = new Set([
    currentStatus,
    ...(NEXT_ORDER_STATUSES[currentStatus] || []),
  ])
  return ORDER_STATUS_OPTIONS.filter((option) => available.has(option.value))
}
