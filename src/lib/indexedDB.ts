import { GamePair, Dataset } from "@/types";

const DB_NAME = "GameOverseDB";
const DB_VERSION = 1;
const DATASETS_STORE = "datasets";

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create datasets store
        if (!db.objectStoreNames.contains(DATASETS_STORE)) {
          const store = db.createObjectStore(DATASETS_STORE, { keyPath: "id" });
          store.createIndex("name", "name", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
    });
  }

  async saveDataset(name: string, pairs: GamePair[]): Promise<Dataset> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const dataset: Dataset = {
      id: `dataset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      pairs,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], "readwrite");
      const store = transaction.objectStore(DATASETS_STORE);
      const request = store.add(dataset);

      request.onsuccess = () => {
        resolve(dataset);
      };

      request.onerror = () => {
        reject(new Error("Failed to save dataset"));
      };
    });
  }

  async getAllDatasets(): Promise<Dataset[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], "readonly");
      const store = transaction.objectStore(DATASETS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error("Failed to fetch datasets"));
      };
    });
  }

  async getDataset(id: string): Promise<Dataset | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], "readonly");
      const store = transaction.objectStore(DATASETS_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error("Failed to fetch dataset"));
      };
    });
  }

  async updateDataset(
    id: string,
    updates: Partial<Omit<Dataset, "id" | "createdAt">>
  ): Promise<Dataset> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const existingDataset = await this.getDataset(id);
    if (!existingDataset) {
      throw new Error("Dataset not found");
    }

    const updatedDataset: Dataset = {
      ...existingDataset,
      ...updates,
      updatedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], "readwrite");
      const store = transaction.objectStore(DATASETS_STORE);
      const request = store.put(updatedDataset);

      request.onsuccess = () => {
        resolve(updatedDataset);
      };

      request.onerror = () => {
        reject(new Error("Failed to update dataset"));
      };
    });
  }

  async deleteDataset(id: string): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DATASETS_STORE], "readwrite");
      const store = transaction.objectStore(DATASETS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to delete dataset"));
      };
    });
  }
}

// Create a singleton instance
const dbManager = new IndexedDBManager();

// Export functions that ensure the DB is initialized
export const initDB = () => dbManager.init();
export const saveDataset = (name: string, pairs: GamePair[]) =>
  dbManager.saveDataset(name, pairs);
export const getAllDatasets = () => dbManager.getAllDatasets();
export const getDataset = (id: string) => dbManager.getDataset(id);
export const updateDataset = (
  id: string,
  updates: Partial<Omit<Dataset, "id" | "createdAt">>
) => dbManager.updateDataset(id, updates);
export const deleteDataset = (id: string) => dbManager.deleteDataset(id);
