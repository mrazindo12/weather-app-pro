import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ForecastData } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface HourlyForecastProps {
    data: ForecastData;
}

export function HourlyForecast({ data }: HourlyForecastProps) {
    const hourlyData = data.list.slice(0, 12); // Show 36 hours for better scroll context
    
    const chartData = hourlyData.map(item => ({
        time: format(new Date(item.dt * 1000), 'HH:mm'),
        temp: Math.round(item.main.temp),
        rawTime: item.dt
    }));

    return (
        <div className="w-full glass-morphism rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">Weather Trends</h3>
                <div className="flex gap-2">
                    <span className="h-1.5 w-8 bg-primary rounded-full transition-all duration-300" />
                    <span className="h-1.5 w-1.5 bg-muted rounded-full" />
                    <span className="h-1.5 w-1.5 bg-muted rounded-full" />
                </div>
            </div>

            {/* Temperature Chart */}
            <div className="h-[200px] w-full -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip 
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="glass-morphism px-3 py-2 rounded-xl border-white/10 shadow-xl">
                                            <p className="text-xs font-bold text-primary">{payload[0].value}°</p>
                                            <p className="text-[10px] opacity-40 uppercase">{payload[0].payload.time}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="temp" 
                            stroke="var(--color-primary)" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorTemp)" 
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2 scroll-smooth">
                {hourlyData.map((item) => (
                    <div
                        key={item.dt}
                        className="flex-shrink-0 min-w-[110px] group cursor-pointer"
                    >
                        <div className="flex flex-col items-center gap-3 py-6 rounded-[2rem] bg-muted/30 border border-border/50 transition-all duration-300 group-hover:bg-primary group-hover:shadow-[0_0_30px_rgba(19,236,218,0.2)] group-hover:scale-105 group-hover:border-primary/50">
                            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary-foreground uppercase tracking-widest transition-colors">
                                {format(new Date(item.dt * 1000), 'h a')}
                            </span>
                            <div className="relative">
                                <WeatherIcon
                                    code={item.weather[0].icon}
                                    size={40}
                                    className="relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-md group-hover:drop-shadow-none group-hover:invert group-hover:brightness-0"
                                />
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-xl group-hover:text-primary-foreground transition-colors">
                                    {Math.round(item.main.temp)}°
                                </span>
                                <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 group-hover:text-primary-foreground transition-all">
                                    <Droplets className="h-3 w-3" />
                                    <span className="text-[10px] font-black">{Math.round(item.pop * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
