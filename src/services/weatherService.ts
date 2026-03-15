import axios from 'axios';
import type { CurrentWeatherData, ForecastData } from '../types/weather';

export type WeatherUnits = 'metric' | 'imperial';

export interface AirQualityData {
    coord: {
        lon: number;
        lat: number;
    };
    list: {
        main: {
            aqi: number;
        };
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
        dt: number;
    }[];
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
    console.warn('VITE_OPENWEATHER_API_KEY is not defined in the environment variables.');
}

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
    },
});

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const forecastCache = new Map<string, { data: ForecastData; timestamp: number }>();

export const weatherService = {
    /**
     * Fetch current weather data for a specific city
     * @param city Name of the city
     * @param units Metric or Imperial
     * @returns Promise containing current weather data
     */
    async getCurrentWeather(city: string, units: WeatherUnits = 'metric'): Promise<CurrentWeatherData> {
        const response = await api.get<CurrentWeatherData>('/weather', {
            params: { q: city, units },
        });
        return response.data;
    },

    /**
     * Fetch 5-day / 3-hour forecast data for a specific city
     * @param city Name of the city
     * @param units Metric or Imperial
     * @returns Promise containing forecast data
     */
    async getForecast(city: string, units: WeatherUnits = 'metric'): Promise<ForecastData> {
        const cacheKey = `city-${city}-${units}`;
        const cached = forecastCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        const response = await api.get<ForecastData>('/forecast', {
            params: { q: city, units },
        });

        forecastCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
    },

    /**
     * Fetch Air Pollution data for specific coordinates
     * @param lat Latitude
     * @param lon Longitude
     * @returns Promise containing air quality data
     */
    async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
        const response = await api.get<AirQualityData>('/air_pollution', {
            params: { lat, lon },
        });
        return response.data;
    },

    /**
     * Fetch 5-day / 3-hour forecast data by coordinates
     * @param lat Latitude
     * @param lon Longitude
     * @param units Metric or Imperial
     * @returns Promise containing forecast data
     */
    async getForecastByCoords(lat: number, lon: number, units: WeatherUnits = 'metric'): Promise<ForecastData> {
        const cacheKey = `coords-${lat}-${lon}-${units}`;
        const cached = forecastCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        const response = await api.get<ForecastData>('/forecast', {
            params: { lat, lon, units },
        });

        forecastCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
    },

    /**
     * Fetch current weather data by coordinates
     * @param lat Latitude
     * @param lon Longitude
     * @param units Metric or Imperial
     * @returns Promise containing current weather data
     */
    async getWeatherByCoords(lat: number, lon: number, units: WeatherUnits = 'metric'): Promise<CurrentWeatherData> {
        const response = await api.get<CurrentWeatherData>('/weather', {
            params: { lat, lon, units },
        });
        return response.data;
    },
};
