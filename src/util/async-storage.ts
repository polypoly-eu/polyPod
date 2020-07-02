const storage = new Map<string, string>();

//TODO implement storage

export default {
  async getItem(key: string): Promise<string | null> {
    return storage.get(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    storage.set(key, value);
  }
};
