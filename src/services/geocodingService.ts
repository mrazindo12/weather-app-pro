import axios from 'axios';

export interface GeocodingResult {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    local_names?: {
        [key: string]: string;
    };
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
    },
});

export const geocodingService = {
    /**
     * Search for locations by name
     * @param query Location name (city, district, neighborhood)
     * @param limit Maximum number of results
     * @returns Promise containing search results
     */
    async searchLocations(query: string, limit: number = 5, signal?: AbortSignal): Promise<GeocodingResult[]> {
        if (!query.trim()) return [];
        const response = await api.get<GeocodingResult[]>('/direct', {
            params: { q: query, limit },
            signal
        });
        return response.data;
    },

    /**
     * Get location name from coordinates
     * @param lat Latitude
     * @param lon Longitude
     * @param limit Maximum number of results
     * @returns Promise containing location info
     */
    async reverseGeocode(lat: number, lon: number, limit: number = 1): Promise<GeocodingResult[]> {
        const response = await api.get<GeocodingResult[]>('/reverse', {
            params: { lat, lon, limit },
        });
        return response.data;
    }
};
