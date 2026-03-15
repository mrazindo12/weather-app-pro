import React, { createContext, useContext, useState, useEffect } from 'react';
import type { LocationData } from '../types/weather';
import { geocodingService } from '../services/geocodingService';

export type WeatherUnits = 'metric' | 'imperial';
export type AppTheme = 'aurora' | 'day' | 'night' | 'clear' | 'clouds' | 'rain' | 'storm' | 'snow' | 'fog';

interface WeatherContextType {
    units: WeatherUnits;
    theme: AppTheme;
    location: LocationData;
    savedCities: LocationData[];
    weatherCondition: string;
    isDay: boolean;
    locationError: string | null;
    toggleUnits: () => void;
    setTheme: (theme: AppTheme) => void;
    setLocation: (location: LocationData) => void;
    toggleSavedCity: (location: LocationData) => void;
    isCitySaved: (lat: number, lon: number) => boolean;
    setWeatherState: (condition: string, isDay: boolean) => void;
}

const DEFAULT_LOCATION: LocationData = {
    name: 'Accra',
    lat: 5.6037,
    lon: -0.1870,
    country: 'GH'
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
    const [units, setUnits] = useState<WeatherUnits>(() => {
        const saved = localStorage.getItem('weather-units');
        return (saved as WeatherUnits) || 'metric';
    });

    const [theme, setTheme] = useState<AppTheme>('aurora');
    const [weatherCondition, setWeatherCondition] = useState<string>('clear');
    const [isDay, setIsDay] = useState<boolean>(true);
    const [locationError, setLocationError] = useState<string | null>(null);

    const [location, setLocation] = useState<LocationData>(() => {
        const saved = localStorage.getItem('last-location');
        return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    });

    const [savedCities, setSavedCities] = useState<LocationData[]>(() => {
        const saved = localStorage.getItem('saved-locations-v2');
        return saved ? JSON.parse(saved) : [];
    });

    // Auto-detect location on first load
    useEffect(() => {
        const hasRequestedLocation = sessionStorage.getItem('has-requested-location');
        
        if (!hasRequestedLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    sessionStorage.setItem('has-requested-location', 'true');

                    try {
                        // Reverse geocode to get a friendly name
                        const results = await geocodingService.reverseGeocode(latitude, longitude);
                        if (results && results.length > 0) {
                            const loc = results[0];
                            setLocation({
                                name: loc.name,
                                lat: latitude,
                                lon: longitude,
                                country: loc.country,
                                state: loc.state
                            });
                        } else {
                            setLocation({
                                name: 'My Location',
                                lat: latitude,
                                lon: longitude,
                                country: ''
                            });
                        }
                    } catch (err) {
                        console.error('Reverse geocoding failed:', err);
                        setLocation({
                            name: 'My Location',
                            lat: latitude,
                            lon: longitude,
                            country: ''
                        });
                    }
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    setLocationError('Location access denied. Showing weather for Accra.');
                    sessionStorage.setItem('has-requested-location', 'true');
                }
            );
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('weather-units', units);
    }, [units]);

    useEffect(() => {
        localStorage.setItem('last-location', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('saved-locations-v2', JSON.stringify(savedCities));
    }, [savedCities]);

    const toggleUnits = () => {
        setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
    };

    const toggleSavedCity = (loc: LocationData) => {
        setSavedCities((prev) => {
            const exists = prev.find((c) => c.lat === loc.lat && c.lon === loc.lon);
            if (exists) {
                return prev.filter((c) => !(c.lat === loc.lat && c.lon === loc.lon));
            }
            return [...prev, loc];
        });
    };

    const isCitySaved = (lat: number, lon: number) => 
        savedCities.some((c) => c.lat === lat && c.lon === lon);

    const setWeatherState = (condition: string, dayStatus: boolean) => {
        setWeatherCondition(condition.toLowerCase());
        setIsDay(dayStatus);
    };

    return (
        <WeatherContext.Provider value={{
            units, theme, location, savedCities, weatherCondition, isDay, locationError,
            toggleUnits, setTheme, setLocation, toggleSavedCity, isCitySaved, setWeatherState
        }}>
            {children}
        </WeatherContext.Provider>
    );
}

export function useWeatherContext() {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    return context;
}
