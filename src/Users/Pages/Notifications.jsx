import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  MessageSquareText,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import NavBar from "../Composants/nav";
import Footer from "../Composants/Footer";
import { ListSkeleton } from "../../components/skeletons";
import { buyerNotificationService } from "../../services/buyerNotificationService.js";

const FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "unread", label: "Non lues" },
  { key: "read", label: "Lues" },
];

const iconByKind = {
  shop: Store,
  alert: AlertTriangle,
  order: ShoppingBag,
  product: Package,
  message: MessageSquareText,
  system: BellRing,
  promotion: AlertTriangle,
};

const toneByKind = {
  shop: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  alert: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
  order: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  product: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  message: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  system: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  promotion: "bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
};

const isNotificationRead = (notification) =>
  Boolean(notification?.read ?? notification?.is_read);

const formatRelative = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;

  const days = Math.round(hours / 24);
  if (days < 7) return `Il y a ${days} j`;

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatFullDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [pendingId, setPendingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await buyerNotificationService.list();
      setNotifications(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      if (silent) {
        toast.error("Impossible d’actualiser les notifications.");
      } else {
        setError("Impossible de charger vos notifications pour le moment.");
        toast.error("Impossible de charger vos notifications.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !isNotificationRead(notification)).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !isNotificationRead(notification));
    }
    if (filter === "read") {
      return notifications.filter((notification) => isNotificationRead(notification));
    }
    return notifications;
  }, [filter, notifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load({ silent: true });
  };

  const handleMarkRead = async (id) => {
    setPendingId(id);
    try {
      await buyerNotificationService.markRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true, read: true }
            : notification,
        ),
      );
      toast.success("Notification marquée comme lue.");
    } catch {
      toast.error("Impossible de marquer cette notification comme lue.");
    } finally {
      setPendingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    setMarkingAll(true);
    try {
      await buyerNotificationService.markAllRead();
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
          read: true,
        })),
      );
      toast.success("Toutes vos notifications sont marquées comme lues.");
    } catch {
      toast.error("Impossible de marquer les notifications comme lues.");
    } finally {
      setMarkingAll(false);
    }
  };

  const emptyTitle =
    filter === "unread"
      ? "Vous êtes à jour"
      : filter === "read"
        ? "Aucune notification lue"
        : "Aucune notification pour le moment";

  const emptyDescription =
    filter === "unread"
      ? "Toutes vos notifications ont été lues."
      : filter === "read"
        ? "Les notifications que vous aurez lues apparaîtront ici."
        : "Les réponses du support et les informations sur vos commandes s’afficheront ici.";

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Bell size={24} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Espace acheteur
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
                  Notifications
                </h1>
                <p className="mt-1.5 max-w-xl text-sm leading-6 text-base-content/60">
                  Retrouvez les réponses du support client et les informations liées à vos
                  commandes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="btn btn-ghost btn-sm gap-2 border border-base-300/70"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                Actualiser
              </button>
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={!unreadCount || markingAll}
                className="btn btn-primary btn-sm gap-2"
              >
                <CheckCheck size={16} />
                Tout marquer comme lu
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-base-300/70 pt-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              {unreadCount === 0
                ? "Aucune non lue"
                : `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
            </span>
            <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/65">
              {notifications.length} notification{notifications.length > 1 ? "s" : ""}
            </span>
          </div>
        </section>

        <div
          className="mt-5 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrer les notifications"
        >
          {FILTERS.map(({ key, label }) => {
            const count =
              key === "all"
                ? notifications.length
                : key === "unread"
                  ? unreadCount
                  : notifications.length - unreadCount;
            const active = filter === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-content shadow-sm"
                    : "border-base-300/80 bg-(--surface) text-base-content/65 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    active ? "bg-primary-content/20" : "bg-base-200 text-base-content/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-5">
            <ListSkeleton
              rows={5}
              lines={3}
              itemClassName="rounded-2xl border border-base-300 bg-(--surface)"
            />
          </div>
        ) : error ? (
          <div className="mt-5 rounded-3xl border border-error/30 bg-error/5 px-6 py-12 text-center">
            <AlertTriangle size={36} className="mx-auto text-error/80" />
            <p className="mt-3 text-sm font-semibold text-base-content">{error}</p>
            <button
              type="button"
              onClick={() => load()}
              className="btn btn-primary btn-sm mt-5"
            >
              Réessayer
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-base-300 bg-(--surface) px-6 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-base-200 text-base-content/40">
              <Bell size={26} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-base-content">{emptyTitle}</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-base-content/60">
              {emptyDescription}
            </p>
            {filter !== "all" && notifications.length > 0 ? (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="btn btn-primary btn-sm mt-5"
              >
                Voir toutes les notifications
              </button>
            ) : (
              <Link to="/accueil" className="btn btn-primary btn-sm mt-5">
                Retour à l’accueil
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredNotifications.map((notification) => {
              const unread = !isNotificationRead(notification);
              const kind = String(notification.kind || notification.type || "system").toLowerCase();
              const Icon = iconByKind[kind] || Bell;
              const tone = toneByKind[kind] || "bg-base-200 text-base-content/65";
              const title = notification.title || "Notification";
              const message = notification.message || "Aucun détail supplémentaire.";
              const date = notification.time || notification.created_at;

              return (
                <article
                  key={notification.id}
                  className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
                    unread
                      ? "border-primary/25 bg-primary/[0.035]"
                      : "border-base-300 bg-(--surface)"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
                    >
                      <Icon size={19} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="truncate text-sm font-bold text-base-content">
                              {title}
                            </h2>
                            {unread && (
                              <span
                                className="size-2 shrink-0 rounded-full bg-primary"
                                aria-label="Non lue"
                              />
                            )}
                          </div>
                          <p
                            className="mt-1 text-xs text-base-content/50"
                            title={formatFullDate(date)}
                          >
                            {formatRelative(date)}
                          </p>
                        </div>

                        {unread && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(notification.id)}
                            disabled={pendingId === notification.id}
                            className="btn btn-ghost btn-xs gap-1.5 text-primary"
                          >
                            <Check size={14} />
                            Marquer comme lu
                          </button>
                        )}
                      </div>

                      <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-base-content/75">
                        {message}
                      </p>

                      {kind === "message" && (
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                          <MessageSquareText size={14} />
                          Reçu du support client
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
