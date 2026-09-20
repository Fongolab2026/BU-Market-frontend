export default function CardProduit({ product }) {
  const Icone = product.icon

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-base-300/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image du produit */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ background: product.image }}
      >
        {Icone && (
          <Icone
            size={64}
            strokeWidth={1.2}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Informations */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-1 font-semibold text-base-content">
          {product.name}
        </h3>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/45">
          {product.vendor}
        </span>
        <p className="mt-auto pt-1 font-bold text-base-content">
          {Number(product.price).toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          })}
        </p>
      </div>
    </article>
  )
}