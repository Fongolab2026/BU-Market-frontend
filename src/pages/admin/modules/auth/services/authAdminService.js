import {
  authApi,
  clearTokens,
  setTokens,
} from "../../../../../services/index.js";
import { resolveRole } from "../../../../../utils/roles.js";

export const authAdminEndpoints = {
  login: "/auth/login/",
  me: "/users/users/me/",
};

export class AdminAccessError extends Error {
  constructor(message) {
    super(message);
    this.name = "AdminAccessError";
  }
}

const readField = (data, keys) => {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null) return data[key];
  }
  return undefined;
};

export const authAdminService = {
  /**
   * Connecte l'administrateur puis vérifie que le compte possède
   * bien le rôle admin avant d'enregistrer la session.
   */
  login: async ({ username, password }) => {
    const { data } = await authApi.login({ username, password });
    setTokens(data);

    let profile = readField(data, ["user", "profile"]);
    if (!profile) {
      try {
        profile = (await authApi.me()).data;
      } catch {
        profile = { username };
      }
    }

    const role = resolveRole(profile);
    if (role !== "admin") {
      clearTokens();
      throw new AdminAccessError(
        "Ce compte n'a pas accès à l'espace administrateur.",
      );
    }

    return { ...profile, role };
  },

  logout: () => {
    clearTokens();
  },
};
