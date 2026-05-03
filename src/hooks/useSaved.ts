import { useState, useEffect, useCallback } from 'react';
import { SavedTool } from '../types';
import {
  loadSavedTools,
  saveTool as storageSaveTool,
  removeSavedTool as storageRemoveTool,
} from '../lib/storage';

interface UseSavedResult {
  savedTools: SavedTool[];
  loading: boolean;
  saveTool: (tool: SavedTool) => Promise<void>;
  removeTool: (toolOrId: SavedTool | string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSaved(): UseSavedResult {
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const tools = await loadSavedTools();
      setSavedTools(tools);
    } catch (error) {
      console.warn('useSaved refresh error:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const tools = await loadSavedTools();
        if (mounted) setSavedTools(tools);
      } catch (error) {
        console.warn('useSaved init error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const saveTool = useCallback(async (tool: SavedTool) => {
    try {
      await storageSaveTool(tool);
      const updated = await loadSavedTools();
      setSavedTools(updated);
    } catch (error) {
      console.warn('saveTool error:', error);
    }
  }, []);

  const removeTool = useCallback(async (toolOrId: SavedTool | string) => {
    try {
      if (typeof toolOrId === 'string') {
        await storageRemoveTool(toolOrId);
      } else if (toolOrId.sourceKey) {
        const existing = await loadSavedTools();
        const duplicates = existing.filter((tool) => tool.sourceKey === toolOrId.sourceKey);
        for (const tool of duplicates) {
          await storageRemoveTool(tool.id);
        }
      } else {
        await storageRemoveTool(toolOrId.id);
      }
      const updated = await loadSavedTools();
      setSavedTools(updated);
    } catch (error) {
      console.warn('removeTool error:', error);
    }
  }, []);

  return { savedTools, loading, saveTool, removeTool, refresh };
}
