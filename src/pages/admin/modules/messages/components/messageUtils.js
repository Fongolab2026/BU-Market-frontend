export const formatBadge = (count) => (count > 99 ? '99+' : count)

export const plural = (count, singular, pluralForm) =>
  `${count} ${count > 1 ? pluralForm : singular}`
