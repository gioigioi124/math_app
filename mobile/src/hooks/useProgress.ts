import { useState, useEffect } from "react";
import { progressApi } from "../services/progress.api";
import { useProgressStore } from "../store/progress.store";

export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const { progress, setProgress } = useProgressStore();

  const loadProgress = async () => {
    setLoading(true);
    try {
      const data = await progressApi.getProgress();
      setProgress(data);
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  return { progress, loading, refetch: loadProgress };
};
