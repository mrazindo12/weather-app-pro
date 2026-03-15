import { useState, useEffect, useRef } from 'react';
import { geocodingService, type GeocodingResult } from '../services/geocodingService';
import { customLocations, type LandmarkLocation } from '../data/customLocations';

export interface HybridSuggestion extends GeocodingResult {
    isLandmark?: boolean;
    landmarkName?: string;
}

export function useLocationSearch(query: string) {
    const [suggestions, setSuggestions] = useState<HybridSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const cleanQuery = query.trim().toLowerCase();
        
        // Clear suggestions if query is too short
        if (cleanQuery.length <= 1) {
            setSuggestions([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        const fetchSuggestions = async () => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            setIsLoading(true);
            setError(null);

            try {
                // 1. Check Custom Landmarks
                const localMatches: HybridSuggestion[] = customLocations
                    .filter(loc => 
                        loc.name.toLowerCase().includes(cleanQuery) || 
                        loc.displayName.toLowerCase().includes(cleanQuery)
                    )
                    .map(loc => ({
                        name: loc.displayName,
                        lat: loc.lat,
                        lon: loc.lon,
                        country: loc.country,
                        state: loc.city,
                        isLandmark: true,
                        landmarkName: loc.name
                    }))
                    .slice(0, 5);

                // 2. Fetch from OpenWeatherMap API
                let apiResults: GeocodingResult[] = [];
                if (cleanQuery.length >= 3) {
                    apiResults = await geocodingService.searchLocations(
                        query, 
                        5, 
                        abortControllerRef.current.signal
                    );
                }

                // 3. Merge results (prioritize landmarks, then uniq by coords)
                const merged: HybridSuggestion[] = [...localMatches];
                
                apiResults.forEach(res => {
                    const exists = merged.some(m => 
                        Math.abs(m.lat - res.lat) < 0.01 && Math.abs(m.lon - res.lon) < 0.01
                    );
                    if (!exists) {
                        merged.push(res);
                    }
                });

                setSuggestions(merged.slice(0, 5));
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    // Do nothing for aborted requests
                    return;
                }
                console.error('Geocoding error:', err);
                setError('Failed to fetch suggestions');
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        // 400ms debounce as requested
        const timer = setTimeout(fetchSuggestions, 400);

        return () => {
            clearTimeout(timer);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [query]);

    return {
        suggestions,
        isLoading,
        error,
        isIdle: query.trim().length === 0,
        hasResults: suggestions.length > 0,
        noResults: query.trim().length > 1 && !isLoading && !error && suggestions.length === 0
    };
}
