import {
  GamePair,
  Dataset,
  FlashcardProgress,
  FlashcardSession,
  SelectedDatasets,
} from "@/types";

const DB_NAME = "GameOverseDB";
const DB_VERSION = 2;
const DATASETS_STORE = "datasets";
const FLASHCARD_PROGRESS_STORE = "flashcardProgress";
const FLASHCARD_SESSIONS_STORE = "flashcardSessions";
const SELECTED_DATASETS_STORE = "selectedDatasets";

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

        // Create flashcard progress store
        if (!db.objectStoreNames.contains(FLASHCARD_PROGRESS_STORE)) {
          const progressStore = db.createObjectStore(FLASHCARD_PROGRESS_STORE, {
            keyPath: "cardId",
          });
          progressStore.createIndex("masteryLevel", "masteryLevel", {
            unique: false,
          });
          progressStore.createIndex("lastReviewed", "lastReviewed", {
            unique: false,
          });
        }

        // Create flashcard sessions store
        if (!db.objectStoreNames.contains(FLASHCARD_SESSIONS_STORE)) {
          const sessionsStore = db.createObjectStore(FLASHCARD_SESSIONS_STORE, {
            keyPath: "id",
          });
          sessionsStore.createIndex("startTime", "startTime", {
            unique: false,
          });
        }

        // Create selected datasets store
        if (!db.objectStoreNames.contains(SELECTED_DATASETS_STORE)) {
          db.createObjectStore(SELECTED_DATASETS_STORE, { keyPath: "id" });
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
      await this.init();
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

  // Flashcard Progress Methods
  async saveFlashcardProgress(progress: FlashcardProgress): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [FLASHCARD_PROGRESS_STORE],
        "readwrite"
      );
      const store = transaction.objectStore(FLASHCARD_PROGRESS_STORE);
      const request = store.put(progress);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error("Failed to save flashcard progress"));
    });
  }

  async getFlashcardProgress(
    cardId: string
  ): Promise<FlashcardProgress | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [FLASHCARD_PROGRESS_STORE],
        "readonly"
      );
      const store = transaction.objectStore(FLASHCARD_PROGRESS_STORE);
      const request = store.get(cardId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () =>
        reject(new Error("Failed to get flashcard progress"));
    });
  }

  async getAllFlashcardProgress(): Promise<FlashcardProgress[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [FLASHCARD_PROGRESS_STORE],
        "readonly"
      );
      const store = transaction.objectStore(FLASHCARD_PROGRESS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(new Error("Failed to get all flashcard progress"));
    });
  }

  // Flashcard Session Methods
  async saveFlashcardSession(session: FlashcardSession): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [FLASHCARD_SESSIONS_STORE],
        "readwrite"
      );
      const store = transaction.objectStore(FLASHCARD_SESSIONS_STORE);
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error("Failed to save flashcard session"));
    });
  }

  async getFlashcardSession(
    sessionId: string
  ): Promise<FlashcardSession | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [FLASHCARD_SESSIONS_STORE],
        "readonly"
      );
      const store = transaction.objectStore(FLASHCARD_SESSIONS_STORE);
      const request = store.get(sessionId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () =>
        reject(new Error("Failed to get flashcard session"));
    });
  }

  // Selected Datasets Methods
  async saveSelectedDatasets(
    selectedDatasets: SelectedDatasets
  ): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const data = { ...selectedDatasets, id: "selected_datasets" };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [SELECTED_DATASETS_STORE],
        "readwrite"
      );
      const store = transaction.objectStore(SELECTED_DATASETS_STORE);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error("Failed to save selected datasets"));
    });
  }

  async getSelectedDatasets(): Promise<SelectedDatasets | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [SELECTED_DATASETS_STORE],
        "readonly"
      );
      const store = transaction.objectStore(SELECTED_DATASETS_STORE);
      const request = store.get("selected_datasets");

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _id, ...selectedDatasets } = result;
          resolve(selectedDatasets);
        } else {
          resolve(null);
        }
      };
      request.onerror = () =>
        reject(new Error("Failed to get selected datasets"));
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

// Flashcard progress exports
export const saveFlashcardProgress = (progress: FlashcardProgress) =>
  dbManager.saveFlashcardProgress(progress);
export const getFlashcardProgress = (cardId: string) =>
  dbManager.getFlashcardProgress(cardId);
export const getAllFlashcardProgress = () =>
  dbManager.getAllFlashcardProgress();

// Flashcard session exports
export const saveFlashcardSession = (session: FlashcardSession) =>
  dbManager.saveFlashcardSession(session);
export const getFlashcardSession = (sessionId: string) =>
  dbManager.getFlashcardSession(sessionId);

// Selected datasets exports
export const saveSelectedDatasets = (selectedDatasets: SelectedDatasets) =>
  dbManager.saveSelectedDatasets(selectedDatasets);
export const getSelectedDatasets = () => dbManager.getSelectedDatasets();
