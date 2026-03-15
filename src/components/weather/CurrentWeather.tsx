import React from 'react';
import type { CurrentWeatherData, LocationData } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Droplets, Wind, Thermometer, Cloud, Heart } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface CurrentWeatherProps {
    data: CurrentWeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
    const { weather, main, wind, name, sys, coord } = data;
    const { toggleSavedCity, isCitySaved } = useWeatherContext();
    const condition = weather[0];
    
    // Construct LocationData from CurrentWeatherData
    const location: LocationData = {
        name: name,
        lat: coord.lat,
        lon: coord.lon,
        country: sys.country
    };

    const isSaved = isCitySaved(coord.lat, coord.lon);

    return (
        <section className="w-full glass-morphism rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/30 transition-all duration-1000" />

            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="flex flex-col items-center xl:items-start w-full xl:flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 bg-muted border border-border px-4 py-2 rounded-2xl backdrop-blur-md">
                            <MapPin className="h-4 w-4 text-primary" />
                            <h2 className="text-base md:text-lg font-semibold tracking-wide truncate max-w-[200px] md:max-w-md">{name}, {sys.country}</h2>
                        </div>
                        <Button
                            variant="glass"
                            size="icon"
                            className={cn(
                                "rounded-2xl transition-all duration-300",
                                isSaved ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : "text-muted-foreground hover:text-rose-500"
                            )}
                            onClick={() => toggleSavedCity(location)}
                            title={isSaved ? "Remove from saved" : "Save location"}
                        >
                            <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <WeatherIcon code={condition.icon} size={120} className="relative z-10 drop-shadow-[0_10px_30px_rgba(19,236,218,0.3)] transform hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex items-start justify-center md:justify-start">
                                <span className="text-6xl min-[400px]:text-7xl md:text-8xl font-bold tracking-tighter leading-none">
                                    {Math.round(main.temp)}
                                </span>
                                <span className="text-3xl min-[400px]:text-4xl md:text-5xl font-light text-primary mt-1">°</span>
                            </div>
                            <p className="text-lg md:text-xl font-medium capitalize mt-2 text-muted-foreground pl-1">
                                {condition.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full xl:w-auto grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-3 md:gap-4 shrink-0">
                    <MetricCard
                        icon={<Thermometer className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />}
                        label="Feels Like"
                        value={`${Math.round(main.feels_like)}°`}
                    />
                    <MetricCard
                        icon={<Droplets className="h-4 w-4 md:h-5 md:w-5 text-teal-400" />}
                        label="Humidity"
                        value={`${main.humidity}%`}
                    />
                    <MetricCard
                        icon={<Wind className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                        label="Wind"
                        value={main.temp > 50 ? `${wind.speed} mph` : `${(wind.speed * 3.6).toFixed(1)} km/h`}
                    />
                    <MetricCard
                        icon={<Cloud className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />}
                        label="Clouds"
                        value={`${data.clouds.all}%`}
                    />
                </div>
            </div>
        </section>
    );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3 p-3.5 md:p-4 rounded-[1.25rem] bg-muted border border-border hover:bg-primary/5 dark:hover:bg-white/10 transition-all duration-300 min-w-0 w-full overflow-hidden">
            <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-0.5 truncate">{label}</p>
                <p className="text-sm md:text-base font-bold truncate">{value}</p>
            </div>
        </div>
    );
}
