import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    Moon,
    Sun,
    AlertCircle
} from 'lucide-react';

interface WeatherIconProps {
    code: string;
    className?: string;
    size?: number;
}

export function WeatherIcon({ code, className = '', size = 24 }: WeatherIconProps) {
    // Map OpenWeatherMap icon codes to Lucide icons
    // Codes: https://openweathermap.org/weather-conditions
    switch (code) {
        case '01d': return <Sun className={`text-yellow-400 ${className}`} size={size} />;
        case '01n': return <Moon className={`text-slate-300 ${className}`} size={size} />;
        case '02d':
        case '02n':
        case '03d':
        case '03n':
        case '04d':
        case '04n': return <Cloud className={`text-slate-400 ${className}`} size={size} />;
        case '09d':
        case '09n': return <CloudDrizzle className={`text-emerald-400 ${className}`} size={size} />;
        case '10d':
        case '10n': return <CloudRain className={`text-emerald-500 ${className}`} size={size} />;
        case '11d':
        case '11n': return <CloudLightning className={`text-purple-500 ${className}`} size={size} />;
        case '13d':
        case '13n': return <CloudSnow className={`text-sky-200 ${className}`} size={size} />;
        case '50d':
        case '50n': return <CloudFog className={`text-slate-400 ${className}`} size={size} />;
        default: return <AlertCircle className={`text-red-400 ${className}`} size={size} />;
    }
}
