import {
  Apple,
  BookOpen,
  Edit,
  Eye,
  EyeOff,
  Gamepad2,
  House,
  Package,
  Palette,
  Plus,
  Search,
  Shirt,
  Smartphone,
  Sparkles,
  Sprout,
  TreePine,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "../../../components/ConfirmDialog.jsx";
import { PageHeader, StatusBadge } from "../../../components/ui.jsx";
import { merchantCategoryService } from "../services/merchantCategoryService.js";

const categoryIcons = {
  Alimentation: Apple,
  "Mode & accessoires": Shirt,
  Artisanat: Wrench,
  "Maison & décoration": House,
  "Beauté & soins": Sparkles,
  Électronique: Smartphone,
};

const iconOptions = [
  { key: "apple", label: "Alimentation", Icon: Apple },
  { key: "shirt", label: "Mode", Icon: Shirt },
  { key: "wrench", label: "Artisanat", Icon: Wrench },
  { key: "house", label: "Maison", Icon: House },
  { key: "sparkles", label: "Beauté", Icon: Sparkles },
  { key: "smartphone", label: "Électronique", Icon: Smartphone },
  { key: "book-open", label: "Livres", Icon: BookOpen },
  { key: "gamepad-2", label: "Loisirs", Icon: Gamepad2 },
  { key: "palette", label: "Création", Icon: Palette },
  { key: "tree-pine", label: "Nature", Icon: TreePine },
  { key: "sprout", label: "Jardin", Icon: Sprout },
];

const iconByKey = Object.fromEntries(
  iconOptions.map((option) => [option.key, option.Icon]),
);

export function MerchantCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "package",
    active: true,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    merchantCategoryService.list().then((result) => {
      setCategories(result);
      setLoading(false);
    });
  }, []);

  const reload = () => merchantCategoryService.list().then(setCategories);

  const openCreate = () => {
    setForm({ name: "", description: "", icon: "package", active: true });
    setModal("create");
  };
  const openEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description,
      icon: category.icon,
      active: category.active,
    });
    setModal(category.id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    if (modal === "create") {
      await merchantCategoryService.create({
        name: form.name,
        description: form.description,
        icon: form.icon,
      });
      toast.success("Catégorie ajoutée.");
    } else {
      await merchantCategoryService.update(modal, {
        name: form.name,
        description: form.description,
        icon: form.icon,
      });
      toast.success("Catégorie mise à jour.");
    }
    setSubmitting(false);
    setModal(null);
    await reload();
  };

  const toggleStatus = async (category) => {
    const nextActive = !category.active;
    await merchantCategoryService.update(category.id, { active: nextActive });
    toast.success(
      category.active ? "Catégorie désactivée." : "Catégorie activée.",
    );
    await reload();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await merchantCategoryService.remove(deleteTarget.id);
    setDeleteTarget(null);
    toast.success("Catégorie supprimée.");
    await reload();
  };

  const activeCount = categories.filter((c) => c.active).length;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Espace vendeur"
        title="Catégories"
        description="Gérez les catégories de produits disponibles sur la plateforme."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
          >
            <Plus size={16} /> Nouvelle catégorie
          </button>
        }
      />

      <section className="card">
        <div className="flex flex-col gap-3 border-b border-base-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Rechercher une catégorie</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
              size={18}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une catégorie…"
              className="input input-bordered w-full pl-10 pr-3 text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-brand/10 text-brand">
              {categories.length} catégories
            </span>
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
              {activeCount} actives
            </span>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
              <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Chargement des catégories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-base-100 flex items-center justify-center mb-4">
                <Package className="text-base-content/30" size={28} />
              </div>
              <p className="font-bold text-base-content">Aucune catégorie</p>
              <p className="mt-1 text-sm text-base-content/45">
                Créez votre première catégorie.
              </p>
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories
                  .filter(
                    (c) =>
                      !search.trim() ||
                      c.name
                        .toLowerCase()
                        .includes(search.trim().toLowerCase()),
                  )
                  .map((category) => (
                    <article
                      key={category.id}
                      className="group rounded-2xl border border-base-200 bg-white overflow-hidden transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="aspect-square bg-linear-to-br from-brand/10 to-brand/5 flex items-center justify-center">
                        {(() => {
                          const Icon =
                            iconByKey[category.icon] ||
                            categoryIcons[category.name] ||
                            Package;
                          return (
                            <Icon
                              className="text-brand"
                              size={56}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          );
                        })()}
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-base-content">
                              {category.name}
                            </p>
                            <p className="mt-0.5 text-xs text-base-content/50 flex items-center gap-1">
                              <Package size={12} /> {category.count} produits
                            </p>
                          </div>
                          <StatusBadge
                            status={category.active ? "active" : "inactive"}
                            label={category.active ? "Active" : "Inactive"}
                          />
                        </div>
                        <p className="text-sm text-base-content/60 line-clamp-2">
                          {category.description || "Aucune description"}
                        </p>
                        <div className="flex items-center gap-2 pt-2 border-t border-base-100">
                          <button
                            onClick={() => toggleStatus(category)}
                            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${category.active ? "bg-base-100 text-base-content/60 hover:bg-base-200" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                          >
                            {category.active ? (
                              <>
                                {" "}
                                <EyeOff size={14} /> Désactiver{" "}
                              </>
                            ) : (
                              <>
                                {" "}
                                <Eye size={14} /> Activer{" "}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(category)}
                            className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand"
                            aria-label={`Modifier ${category.name}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(category)}
                            className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label={`Supprimer ${category.name}`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </section>

              <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Supprimer la catégorie"
                message={
                  deleteTarget
                    ? `La catégorie « ${deleteTarget.name} » sera supprimée.`
                    : ""
                }
                confirmLabel="Supprimer"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
              />

              {modal && (
                <CategoryForm
                  isCreate={modal === "create"}
                  form={form}
                  setFormField={(name, value) =>
                    setForm((current) => ({ ...current, [name]: value }))
                  }
                  submitting={submitting}
                  onSubmit={handleSubmit}
                  onClose={() => setModal(null)}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function CategoryForm({
  isCreate,
  form,
  setFormField,
  submitting,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <form onSubmit={onSubmit} className="card w-full max-w-lg p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">
              {isCreate ? "Nouvelle catégorie" : "Modifier la catégorie"}
            </h2>
            <p className="mt-1 text-sm text-base-content/55">
              {isCreate
                ? "Cette catégorie sera disponible pour vos produits."
                : "Mettez à jour les informations de la catégorie."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Nom de la catégorie
            </span>
            <input
              value={form.name}
              onChange={(event) => setFormField("name", event.target.value)}
              placeholder="Ex : Alimentation"
              className="input input-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setFormField("description", event.target.value)
              }
              placeholder="Description courte..."
              rows={3}
              className="textarea textarea-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Icône
            </span>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormField("icon", key)}
                  title={label}
                  aria-label={`Choisir l'icône ${label}`}
                  className={`flex size-10 items-center justify-center rounded-xl border-2 transition ${form.icon === key ? "border-brand bg-brand/10 text-brand" : "border-base-200 text-base-content/50 hover:border-brand/50"}`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setFormField("active", event.target.checked)}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm font-medium text-base-content/80">
              Catégorie active
            </span>
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!form.name.trim() || submitting}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Enregistrement…" : isCreate ? "Créer" : "Modifier"}
          </button>
        </div>
      </form>
    </div>
  );
}
