import { useState, useEffect, useCallback } from 'react';
import { apiFetch, getOrgContext } from '../api';

export interface FeedCard {
  id: string;
  title: string;
  body: string;
  gap_type: string;
  urgency: 'alta' | 'media' | 'baixa';
  confidence: number;
  is_bonus: boolean;
  bonus_reason: string | null;
  state: string;
  entity_name: string | null;
}

interface FeedPage {
  items: FeedCard[];
  total: number;
  offset: number;
  limit: number;
}

export function useFeed() {
  const [cards, setCards] = useState<FeedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { orgId, buId } = getOrgContext();
    if (!orgId || !buId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<FeedPage>(
        `/api/orchestrator/feed?org_id=${encodeURIComponent(orgId)}&bu_id=${encodeURIComponent(buId)}&limit=20&offset=0`,
      );
      setCards(data.items ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { cards, loading, error, reload: load };
}
