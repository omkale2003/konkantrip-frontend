const OWNER_STORAGE_KEY = "konkantrip_owner";

const storageService = {
  getOwner() {
    const storedOwner = localStorage.getItem(OWNER_STORAGE_KEY);

    if (!storedOwner) {
      return null;
    }

    try {
      return JSON.parse(storedOwner);
    } catch {
      localStorage.removeItem(OWNER_STORAGE_KEY);
      return null;
    }
  },

  setOwner(owner) {
    localStorage.setItem(
      OWNER_STORAGE_KEY,
      JSON.stringify(owner)
    );
  },

  removeOwner() {
    localStorage.removeItem(OWNER_STORAGE_KEY);
  },

  clearAuthStorage() {
    localStorage.removeItem(OWNER_STORAGE_KEY);
  },
};

export default storageService;