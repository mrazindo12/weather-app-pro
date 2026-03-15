import { useWeatherContext } from '../../context/WeatherContext';
import { cn } from '../../lib/utils';

export function UnitToggle() {
    const { units, toggleUnits } = useWeatherContext();

    return (
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-sm transition-all hover:border-primary/30">
            <button
                onClick={() => units !== 'metric' && toggleUnits()}
                className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                    units === 'metric'
                        ? "bg-primary text-black shadow-[0_0_15px_rgba(17,242,214,0.4)]"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                )}
            >
                °C
            </button>
            <button
                onClick={() => units !== 'imperial' && toggleUnits()}
                className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                    units === 'imperial'
                        ? "bg-primary text-black shadow-[0_0_15px_rgba(17,242,214,0.4)]"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                )}
            >
                °F
            </button>
        </div>
    );
}
