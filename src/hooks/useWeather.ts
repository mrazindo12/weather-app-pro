import { useState, useCallback } from 'react';
import type { CurrentWeatherData, ForecastData, LocationData } from '../types/weather';
import { weatherService, type AirQualityData } from '../services/weatherService';
import { useWeatherContext } from '../context/WeatherContext';

interface UseWeatherReturn {
    currentWeather: CurrentWeatherData | null;
    forecast: ForecastData | null;
    airQuality: AirQualityData | null;
    isLoading: boolean;
    error: string | null;
    fetchWeatherByLocation: (location: LocationData) => Promise<boolean>;
    fetchWeatherByCoords: (lat: number, lon: number) => Promise<boolean>;
}

export function useWeather(): UseWeatherReturn {
    const { units } = useWeatherContext();
    const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherByLocation = useCallback(async (location: LocationData): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const [currentRes, forecastRes, aqiRes] = await Promise.all([
                weatherService.getWeatherByCoords(location.lat, location.lon, units),
                // Still using city name for forecast if coords fail, but ideally should use coords
                // OpenWeatherMap /forecast endpoint also supports lat/lon
                weatherService.getForecastByCoords(location.lat, location.lon, units),
                weatherService.getAirQuality(location.lat, location.lon)
            ]);

            setCurrentWeather(currentRes);
            setForecast(forecastRes);
            setAirQuality(aqiRes);
            return true;
        } catch (err: unknown) {
            console.error('Fetch error:', err);
            setError('Failed to fetch weather data for the selected location.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [units]);

    const fetchWeatherByCoords = useCallback(async (lat: number, lon: number): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const currentRes = await weatherService.getWeatherByCoords(lat, lon, units);
            const [forecastRes, aqiRes] = await Promise.all([
                weatherService.getForecastByCoords(lat, lon, units),
                weatherService.getAirQuality(lat, lon)
            ]);

            setCurrentWeather(currentRes);
            setForecast(forecastRes);
            setAirQuality(aqiRes);
            return true;
        } catch (_err) {
            setError('Failed to fetch weather for your location.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [units]);

    return { currentWeather, forecast, airQuality, isLoading, error, fetchWeatherByLocation, fetchWeatherByCoords };
}
