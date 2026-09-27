import { endpoints, apiGet } from "../../../../../services/api.js";
import { formatChange, formatDateTime, formatNumber } from "../../shared/adminApi.js";

export const dashboardEndpoints = {
  stats: endpoints.admin.stats,
  activity: endpoints.admin.activity,
  moderationQueue: endpoints.admin.moderationQueue,
};

/** Couleurs de cartes KPI acceptees par StatCard. */
const TONES = ["brand", "violet", "emerald", "amber"];
const ACTIVITY_ICONS = { shop: "shop", user: "user", alert: "alert", settings: "settings" };

/** L'API renvoie des tons positive/negative/neutral, l'UI attend des couleurs. */
const toneToCardTone = (tone, index) => {
  if (tone === "positive") return "emerald";
  if (tone === "negative") return "amber";
  return TONES[index % TONES.length];
};

const mapStat = (stat, index) => ({
  id: stat.id,
  label: stat.label,
  value: formatNumber(stat.value),
  change: formatChange(stat.change),
  trend: stat.trend,
  tone: toneToCardTone(stat.tone, index),
});

const mapQueueItem = (item) => ({
  id: item.id,
  type: item.type,
  title: item.title,
  owner: item.owner,
  date: formatDateTime(item.date),
  status: item.status,
});

const mapActivity = (entry) => ({
  id: entry.id,
  title: entry.title,
  description: entry.description,
  time: formatDateTime(entry.time),
  kind: ACTIVITY_ICONS[entry.kind] ?? "settings",
});

export const dashboardService = {
  get: async () => {
    const [stats, activity] = await Promise.all([
      apiGet(dashboardEndpoints.stats),
      apiGet(dashboardEndpoints.activity),
    ]);
    return {
      stats: (stats.stats || []).map(mapStat),
      weeklyActivity: stats.weeklyActivity || [],
      moderationQueue: (stats.moderationQueue || []).map(mapQueueItem),
      activity: (Array.isArray(activity) ? activity : []).map(mapActivity),
    };
  },
};
