import { Wind, Droplets, Eye, Gauge, Activity, Sun, Thermometer } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CurrentWeatherData } from '../../types/weather';
import type { AirQualityData } from '../../services/api';
import { useWeatherContext } from '../../context/WeatherContext';

interface AdditionalMetricsProps {
    weather: CurrentWeatherData;
    aqi: AirQualityData | null;
}

export function AdditionalMetrics({ weather, aqi }: AdditionalMetricsProps) {
    const { units } = useWeatherContext();

    const getAQIDesc = (aqiValue: number) => {
        switch (aqiValue) {
            case 1: return { text: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
            case 2: return { text: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
            case 3: return { text: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-400/10' };
            case 4: return { text: 'Poor', color: 'text-rose-400', bg: 'bg-rose-400/10' };
            case 5: return { text: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-400/10' };
            default: return { text: 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted' };
        }
    };

    const aqiInfo = aqi ? getAQIDesc(aqi.list[0].main.aqi) : null;
    const visibility = units === 'metric'
        ? `${(weather.visibility / 1000).toFixed(1)} km`
        : `${(weather.visibility / 1609.34).toFixed(1)} mi`;

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold px-1">Weather Details</h3>

            <div className="grid grid-cols-2 gap-4">
                <MetricCard
                    title="Humidity"
                    value={`${weather.main.humidity}%`}
                    icon={<Droplets className="h-5 w-5 text-teal-400" />}
                    detail="The dew point is 24° right now"
                />
                <MetricCard
                    title="Wind Speed"
                    value={units === 'metric' ? `${(weather.wind.speed * 3.6).toFixed(1)} km/h` : `${weather.wind.speed} mph`}
                    icon={<Wind className="h-5 w-5 text-primary" />}
                    detail={`Direction: ${weather.wind.deg}°`}
                />
                <MetricCard
                    title="Visibility"
                    value={visibility}
                    icon={<Eye className="h-5 w-5 text-indigo-400" />}
                    detail="Clear view today"
                />
                <MetricCard
                    title="Pressure"
                    value={`${weather.main.pressure} hPa`}
                    icon={<Gauge className="h-5 w-5 text-emerald-400" />}
                    detail="Stable atmospheric weight"
                />
                <MetricCard
                    title="UV Index"
                    value="4"
                    icon={<Sun className="h-5 w-5 text-yellow-400" />}
                    detail="Moderate risk of harm"
                />
                <MetricCard
                    title="Feels Like"
                    value={`${Math.round(weather.main.feels_like)}°`}
                    icon={<Thermometer className="h-5 w-5 text-orange-400" />}
                    detail="Humid and warm"
                />
            </div>

            {aqi && aqiInfo && (
                <div className="glass-morphism rounded-3xl p-6 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl", aqiInfo.bg)}>
                                <Activity className={cn("h-5 w-5", aqiInfo.color)} />
                            </div>
                            <span className="font-bold text-lg">Air Quality</span>
                        </div>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", aqiInfo.bg, aqiInfo.color)}>
                            {aqiInfo.text}
                        </span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold mb-1">{aqi.list[0].main.aqi}</p>
                            <p className="text-sm text-muted-foreground italic">Main pollutant: PM2.5</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1 font-medium italic">Concentration</p>
                            <p className="font-bold">{aqi.list[0].components.pm2_5.toFixed(1)} μg/m³</p>
                        </div>
                    </div>
                    <div className="mt-6 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-1000", aqiInfo.bg.replace('/10', ''))}
                            style={{ width: `${(aqi.list[0].main.aqi / 5) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricCard({ title, value, icon, detail }: { title: string, value: string, icon: React.ReactNode, detail: string }) {
    return (
        <div className="glass-morphism rounded-3xl p-6 hover:bg-primary/5 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-widest">{title}</p>
            <p className="text-xl md:text-2xl font-bold mb-2">{value}</p>
            <p className="text-[10px] text-muted-foreground/80 font-medium leading-tight line-clamp-2">{detail}</p>
        </div>
    );
}
