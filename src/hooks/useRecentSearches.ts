import { useState, useCallback } from 'react';
import type { LocationData } from '../types/weather';

const STORAGE_KEY = 'weather_recent_locations_v2';
const MAX_SEARCHES = 10;

export function useRecentSearches() {
    const [searches, setSearches] = useState<LocationData[]>(() => {
        try {
            const item = window.localStorage.getItem(STORAGE_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage', error);
            return [];
        }
    });

    const addSearch = useCallback((loc: LocationData) => {
        setSearches(prev => {
            // Remove the location if it already exists (check by coordinates)
            const filtered = prev.filter(item => 
                !(item.lat === loc.lat && item.lon === loc.lon)
            );
            const updated = [loc, ...filtered].slice(0, MAX_SEARCHES);

            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
                console.warn('Error saving to localStorage', error);
            }

            return updated;
        });
    }, []);

    const removeSearch = useCallback((loc: LocationData) => {
        setSearches(prev => {
            const updated = prev.filter(item => 
                !(item.lat === loc.lat && item.lon === loc.lon)
            );
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
                console.warn('Error saving to localStorage', error);
            }
            return updated;
        });
    }, []);

    const clearSearches = useCallback(() => {
        setSearches([]);
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('Error clearing localStorage', error);
        }
    }, []);

    return { searches, addSearch, removeSearch, clearSearches };
}
