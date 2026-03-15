import type { ForecastData } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { format, isSameDay } from 'date-fns';

interface ForecastProps {
    data: ForecastData;
}

export function Forecast({ data }: ForecastProps) {
    // Extract one reading per day (e.g., closest to noon)
    const dailyForecasts = data.list.reduce((acc, current) => {
        const date = new Date(current.dt * 1000);
        const existingDayIndex = acc.findIndex((item) =>
            isSameDay(new Date(item.dt * 1000), date)
        );

        if (existingDayIndex === -1 && acc.length < 5) {
            acc.push(current);
        } else if (existingDayIndex !== -1) {
            if (date.getHours() >= 11 && date.getHours() <= 14) {
                acc[existingDayIndex] = current;
            }
        }

        return acc;
    }, [] as typeof data.list);

    return (
        <div className="glass-morphism rounded-[2.5rem] p-8 h-full">
            <h3 className="text-xl font-bold mb-8">5-Day Forecast</h3>
            <div className="space-y-4">
                {dailyForecasts.map((item, i) => (
                    <div
                        key={item.dt}
                        className="flex items-center justify-between p-4 rounded-3xl bg-muted border border-border hover:bg-primary/5 transition-all duration-300 group cursor-pointer"
                    >
                        <p className="w-16 font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                            {i === 0 ? 'Today' : format(new Date(item.dt * 1000), 'EEE')}
                        </p>

                        <div className="flex items-center gap-4 flex-1 justify-center min-w-0">
                            <WeatherIcon
                                code={item.weather[0].icon}
                                size={32}
                                className="drop-shadow-md group-hover:scale-110 transition-transform flex-shrink-0"
                            />
                            <span className="text-sm font-bold text-muted-foreground capitalize truncate hidden sm:inline-block max-w-[80px]">
                                {item.weather[0].description}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 w-24 sm:w-28 justify-end">
                            <span className="font-bold text-base sm:text-lg">{Math.round(item.main.temp_max)}°</span>
                            <div className="h-1 w-10 sm:w-12 bg-muted rounded-full overflow-hidden relative hidden min-[400px]:block">
                                <div className="absolute inset-y-0 left-2 right-4 bg-gradient-to-r from-emerald-400 to-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                            <span className="text-muted-foreground text-xs sm:text-sm font-bold">{Math.round(item.main.temp_min)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
