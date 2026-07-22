"use client";

import { useEffect, useState } from "react";

import type {
  EstimateHistoryItem,
  House,
} from "./types";

const STORAGE_KEY = "property-estimate-history";

export default function useEstimateHistory() {
  const [history, setHistory] =
    useState<EstimateHistoryItem[]>([]);

  useEffect(() => {
    // Defer the state update to avoid an unnecessary synchronous re-render inside the effect.
    const timeoutId = window.setTimeout(() => {
        const storedHistory =
        localStorage.getItem(STORAGE_KEY);

        if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
        }
    }, 0);

    return () => window.clearTimeout(timeoutId);
    }, []);

  function addEstimateHistory(house: House, prediction: number) {
    const newItem: EstimateHistoryItem = {
      id: crypto.randomUUID(),
      house,
      prediction,
      createdAt: new Date().toISOString(),
    };

    const newHistory = [newItem, ...history].slice(0, 10);

    setHistory(newHistory);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(newHistory),
    );
  }

  return {
    history,
    addEstimateHistory,
  };
}