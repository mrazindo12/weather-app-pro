import React, { useEffect, useState } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { weatherService } from '../services/weatherService';
import type { CurrentWeatherData, LocationData } from '../types/weather';
import { WeatherIcon } from '../components/weather/WeatherIcon';
import { X, MapPin, Thermometer, Wind } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function SavedCitiesPage() {
    const { savedCities, toggleSavedCity, setLocation } = useWeatherContext();
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="container mx-auto px-6 py-8 md:py-10 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Saved Locations</h1>
                        <p className="text-muted-foreground">Manage and monitor your specific neighborhoods and cities worldwide.</p>
                    </div>
                </div>

                {savedCities.length === 0 ? (
                    <div className="glass-morphism rounded-[2.5rem] p-20 text-center animate-in fade-in zoom-in duration-500">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <MapPin className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">No locations saved yet</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Search for any neighborhood or district in the dashboard and tap the heart icon to save it here.
                        </p>
                        <Button onClick={() => navigate('/')} className="rounded-2xl px-8">
                            Go to Dashboard
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {savedCities.map((loc) => (
                            <CityWeatherCard
                                key={`${loc.lat}-${loc.lon}`}
                                location={loc}
                                onRemove={() => toggleSavedCity(loc)}
                                onClick={() => {
                                    setLocation(loc);
                                    navigate('/');
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CityWeatherCard({ location, onRemove, onClick }: { location: LocationData, onRemove: () => void, onClick: () => void }) {
    const [data, setData] = useState<CurrentWeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const { units } = useWeatherContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await weatherService.getWeatherByCoords(location.lat, location.lon, units);
                setData(res);
            } catch (err) {
                console.error(`Failed to fetch weather for ${location.name}`, err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [location.lat, location.lon, units]);

    if (loading) {
        return (
            <div className="glass-morphism rounded-[2.5rem] p-8 h-48 animate-pulse flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div 
            onClick={onClick}
            className="group relative glass-morphism rounded-[2.5rem] p-8 cursor-pointer hover:bg-primary/5 transition-all duration-500 hover:scale-[1.02] border-primary/10 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{location.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {location.state ? `${location.state}, ` : ''}{location.country}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-10 w-10 hover:bg-rose-500/10 hover:text-rose-500 -mt-2 -mr-2"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                        <WeatherIcon code={data.weather[0].icon} size={48} className="drop-shadow-lg" />
                        <div className="text-4xl font-bold">{Math.round(data.main.temp)}°</div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold capitalize mb-1">{data.weather[0].description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3" /> {Math.round(data.main.temp_max)}°
                            </span>
                            <span className="flex items-center gap-1">
                                <Wind className="h-3 w-3" /> {data.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
