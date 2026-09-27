import api, { endpoints } from "./api";

/**
 * Demandes de location d'espace vendeur (page /louer-espace).
 *
 * Statuts possibles : pending | validated | rejected | suspended.
 */
export const boutiqueApi = {
  create: (data) => api.post(endpoints.boutiques.create, data),
  /**
   * Demande du commerçant connecté.
   * -> { exists: false, status: null } s'il n'a jamais posté
   * -> { exists: true, status, boutique } sinon
   */
  myRequest: () => api.get(endpoints.boutiques.myRequest),
};
