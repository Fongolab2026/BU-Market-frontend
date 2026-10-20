/**
 * Plugin Vite — génération du QR code vers la page d'atterrissage (accessible réseau).
 *
 * À chaque `npm run dev`, dès que le serveur est en écoute, on résout l'URL
 * réseau réellement exposée (mode host, i.e. IP LAN atteignable par les
 * autres appareils du même Wi-Fi) et on écrit un QR code PNG dans
 * `./qr-codes/`.
 *
 * La page d'atterrissage est servie à la racine `/` (route index de
 * `DefaultEntry`), d'où l'URL sans chemin supplémentaire.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(ROOT, "qr-codes");
const OUT_FILE = resolve(OUT_DIR, "landing-qr.png");
const LANDING_PATH = "/";

const LOCAL_ADDRESSES = new Set(["127.0.0.1", "::1", "localhost"]);

/**
 * Liste les adresses IPv4 du réseau local (non loopback, non internes,
 * hors interfaces virtuelles Docker/VM quand possible).
 */
function lanAddresses() {
  const result = [];
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const isVirtual = /docker|vmnet|veth|br-|tun|wpan/i.test(name);
    if (isVirtual) continue;
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal && !LOCAL_ADDRESSES.has(net.address)) {
        result.push({ name, address: net.address });
      }
    }
  }
  return result;
}

/** URL réseau (IP LAN) vers la page d'atterrissage, pour scan depuis un autre appareil. */
function resolveNetworkUrl(server) {
  const port =
    server.httpServer?.address()?.port ??
    server.config.server?.port ??
    5173;

  // 1) Privilégier `resolvedUrls.network` de Vite (mode host actif).
  const network = server.resolvedUrls?.network?.[0];
  if (network) {
    const u = new URL(LANDING_PATH, network);
    if (!LOCAL_ADDRESSES.has(u.hostname)) return u.toString();
  }

  // 2) Sinon, prendre la première IP LAN détectée localement.
  const addrs = lanAddresses();
  const hostAddress = addrs.length > 0 ? addrs[0].address : "localhost";
  return `http://${hostAddress}:${port}${LANDING_PATH}`;
}

export function landingQrPlugin() {
  return {
    name: "landing-qr-generator",
    apply: "serve",
    configureServer(server) {
      const generate = async () => {
        try {
          const url = resolveNetworkUrl(server);
          const isNetworkUrl = !LOCAL_ADDRESSES.has(new URL(url).hostname);
          const png = await QRCode.toBuffer(url, {
            type: "png",
            width: 1024,
            margin: 2,
            errorCorrectionLevel: "H",
            color: { dark: "#000000", light: "#ffffff" },
          });
          mkdirSync(OUT_DIR, { recursive: true });
          writeFileSync(OUT_FILE, png);

          if (isNetworkUrl) {
            console.log(
              `\n  📱 QR code page d'atterrissage (réseau) → qr-codes/landing-qr.png\n  🔗 URL encodée (accessible depuis un autre appareil) : ${url}\n  💡 Flashez ce QR avec un autre téléphone sur le même Wi-Fi.\n`
            );
          } else {
            console.warn(
              `\n  ⚠️  QR code généré avec l'URL locale (${url}).\n  Pour le partage réseau, vérifiez que ` +
                `vite.config.js a bien server.host = true et qu'une IP LAN est détectée.\n`
            );
          }
        } catch (err) {
          console.warn("  [qr] Génération impossible :", err?.message ?? err);
        }
      };

      if (server.httpServer?.listening) setTimeout(generate, 200);
      else server.httpServer?.once("listening", () => setTimeout(generate, 200));
    },
  };
}