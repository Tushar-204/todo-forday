// Mock storage for local development
const storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value ? { key, value, shared: false } : null;
  },

  async set(key, value, shared = false) {
    localStorage.setItem(key, value);
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    localStorage.removeItem(key);
    return { key, deleted: true, shared };
  },

  async list(prefix = '', shared = false) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
    return { keys, prefix, shared };
  }
};

// Add to window object
if (typeof window !== 'undefined') {
  window.storage = storage;
}

export default storage;