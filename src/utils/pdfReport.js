import { jsPDF } from "jspdf";

/**
 * Génération des rapports PDF de BU-Marché (espaces vendeur et administration).
 *
 * Le document reprend l'identité visuelle du projet : bandeau orange (couleur
 * primaire `#c2410c`), liseré ambre (accent `#f0a500`) et cartes de synthèse.
 * Aucune donnée n'est codée en dur : tout provient des services de l'application.
 */

// Palette alignée sur `theme.css` (thème bumarket).
const BRAND = [194, 65, 12]; // #c2410c
const ACCENT = [240, 165, 0]; // #f0a500
const INK = [36, 31, 43]; // #241f2b
const MUTED = [124, 117, 133];
const LINE = [222, 222, 222];
const SOFT = [247, 246, 249];

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  completed: "Livrée",
  cancelled: "Annulée",
};

const dateStamp = () => new Date().toISOString().slice(0, 10);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("fr-FR") : String(value ?? "—");
};

/**
 * Construit et enregistre un rapport PDF.
 *
 * @param {object}   options
 * @param {string}   options.fileName   Nom du fichier téléchargé.
 * @param {string}   options.title      Titre affiché dans le bandeau.
 * @param {string}   [options.subtitle] Sous-titre (à droite du bandeau).
 * @param {Array<{label:string,value:string,change?:string}>} [options.stats]
 * @param {Array<{title:string,columns:string[],widths?:number[],rows:Array<Array<string>>}>} [options.tables]
 * @param {string}   [options.note]     Mention de bas de page.
 */
export function buildReport({ fileName, title, subtitle, stats = [], tables = [], note = "" }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const maxY = pageHeight - 18;

  // ---------- Bandeau ----------
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, 30, pageWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("BU-Marché", margin, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(228, 219, 240);
  doc.text(title, margin, 21);

  doc.setFontSize(9);
  doc.setTextColor(214, 202, 228);
  doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, pageWidth - margin, 13, { align: "right" });
  if (subtitle) doc.text(subtitle, pageWidth - margin, 20, { align: "right" });

  let y = 42;

  // ---------- Cartes de synthèse ----------
  if (stats.length > 0) {
    const gap = 4;
    const boxW = (contentWidth - gap * (stats.length - 1)) / stats.length;
    const boxH = 21;

    stats.forEach((stat, index) => {
      const x = margin + index * (boxW + gap);
      doc.setDrawColor(...LINE);
      doc.setFillColor(250, 249, 251);
      doc.roundedRect(x, y, boxW, boxH, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      const labelLines = doc.splitTextToSize(String(stat.label || "").toUpperCase(), boxW - 6);
      doc.text(labelLines.slice(0, 2), x + 3, y + 5.5);

      doc.setFontSize(12.5);
      doc.setTextColor(...INK);
      doc.text(doc.splitTextToSize(String(stat.value ?? "—"), boxW - 6).slice(0, 2), x + 3, y + 13);

      if (stat.change) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...MUTED);
        doc.text(doc.splitTextToSize(String(stat.change), boxW - 6).slice(0, 1), x + 3, y + 18);
      }
    });

    y += boxH + 10;
  }

  // ---------- Tableaux ----------
  tables.forEach((table) => {
    if (!table || !table.rows || table.rows.length === 0) return;

    if (y + 24 > maxY) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(table.title, margin, y);
    y += 5.5;

    const widths =
      table.widths && table.widths.length === table.columns.length
        ? table.widths.map((w) => (w / table.widths.reduce((a, b) => a + b, 0)) * contentWidth)
        : table.columns.map(() => contentWidth / table.columns.length);

    // En-tête du tableau
    doc.setFillColor(...BRAND);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    let x = margin;
    table.columns.forEach((column, index) => {
      doc.text(String(column), x + 2.5, y + 5.4);
      x += widths[index];
    });
    y += 8;

    doc.setFont("helvetica", "normal");
    table.rows.forEach((row, rowIndex) => {
      if (y + 8 > maxY) {
        doc.addPage();
        y = 20;
      }
      if (rowIndex % 2 === 1) {
        doc.setFillColor(...SOFT);
        doc.rect(margin, y, contentWidth, 7.5, "F");
      }
      doc.setTextColor(...INK);
      doc.setFontSize(8.5);
      x = margin;
      row.forEach((cell, index) => {
        const clipped = doc.splitTextToSize(String(cell ?? "—"), widths[index] - 5)[0] ?? "—";
        doc.text(clipped, x + 2.5, y + 5);
        x += widths[index];
      });
      y += 7.5;
    });

    y += 8;
  });

  if (note) {
    if (y + 12 > maxY) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(doc.splitTextToSize(note, contentWidth), margin, y);
  }

  // ---------- Pied de page ----------
  const pages = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      `BU-Marché · Rapport confidentiel — page ${page}/${pages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" },
    );
  }

  doc.save(fileName);
}

/** Rapport de l'espace vendeur, à partir des données du tableau de bord. */
export function downloadMerchantReport(data) {
  const stats = (data.stats || []).map((stat) => ({
    label: stat.label,
    value: stat.value,
    change: stat.change,
  }));

  const weekRows = (data.weeklySales || []).map((value, index) => [
    ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][index] || `J${index + 1}`,
    `${formatNumber(value)} BIF`,
  ]);

  const orderRows = (data.orders || []).slice(0, 15).map((order) => [
    `#${order.id}`,
    order.client || "—",
    formatDate(order.created_at),
    statusLabels[order.status] || order.status,
    `${formatNumber(order.total_price ?? order.total)} BIF`,
  ]);

  buildReport({
    fileName: `rapport-vendeur-bu-marche-${dateStamp()}.pdf`,
    title: "Rapport d'activité — Espace vendeur",
    subtitle: data.shop?.name ? `Boutique : ${data.shop.name}` : "Espace vendeur",
    stats,
    tables: [
      { title: "Ventes des 7 derniers jours", columns: ["Jour", "Chiffre d'affaires"], widths: [2, 3], rows: weekRows },
      {
        title: "Dernières commandes",
        columns: ["Commande", "Client", "Date", "Statut", "Montant"],
        widths: [2, 4, 3, 2.4, 3],
        rows: orderRows,
      },
    ],
    note: "Rapport généré automatiquement depuis l'espace vendeur de BU-Marché à partir des données enregistrées.",
  });
}

/** Rapport de l'espace administration, à partir des données du tableau de bord. */
export function downloadAdminReport(data) {
  const stats = (data.stats || []).map((stat) => ({
    label: stat.label,
    value: stat.value,
    change: stat.change,
  }));

  const weekRows = (data.weeklyActivity || []).map((value, index) => [
    ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][index] || `J${index + 1}`,
    String(value),
  ]);

  const queueRows = (data.moderationQueue || []).slice(0, 15).map((item) => [
    item.type || "—",
    item.title || "—",
    item.owner || "—",
    item.date || "—",
    item.status || "—",
  ]);

  buildReport({
    fileName: `rapport-admin-bu-marche-${dateStamp()}.pdf`,
    title: "Rapport de supervision — Espace administration",
    subtitle: "Plateforme BU-Marché",
    stats,
    tables: [
      { title: "Activité des 7 derniers jours", columns: ["Jour", "Activités"], widths: [2, 3], rows: weekRows },
      {
        title: "File de modération",
        columns: ["Type", "Élément", "Propriétaire", "Date", "Statut"],
        widths: [2, 4, 3, 3, 2.5],
        rows: queueRows,
      },
    ],
    note: "Rapport généré automatiquement depuis l'espace administration de BU-Marché.",
  });
}
