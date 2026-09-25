import { useState, useCallback, useRef } from 'react';

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function useLocationAutocomplete() {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 3) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'jsonv2',
          addressdetails: '1',
          limit: '6',
          'accept-language': 'az,en,ru',
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            signal: abortRef.current.signal,
            headers: { 'User-Agent': 'Eventrent.az/1.0 (info@eventrent.az)' },
          }
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
}