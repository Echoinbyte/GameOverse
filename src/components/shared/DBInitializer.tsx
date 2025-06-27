"use client";

import { useEffect } from "react";
import { initDB } from "@/lib/indexedDB";

export default function DBInitializer() {
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initialize();
  }, []);

  return null; // This component doesn't render anything
}
