import { Sunrise, Sunset } from 'lucide-react';
import { format } from 'date-fns';

interface SunriseSunsetProps {
    sunrise: number; // Unix timestamp
    sunset: number;  // Unix timestamp
}

export function SunriseSunset({ sunrise, sunset }: SunriseSunsetProps) {
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return format(date, 'h:mm a');
    };

    // Calculate progress (this is a simplification, ideally based on current time)
    const now = Math.floor(Date.now() / 1000);
    const totalDaylight = sunset - sunrise;
    const progress = Math.max(0, Math.min(100, ((now - sunrise) / totalDaylight) * 100));

    return (
        <div className="glass-morphism rounded-[2.5rem] p-8 h-full flex flex-col">
            <h3 className="text-lg font-bold tracking-tight mb-8">Sunrise & Sunset</h3>

            <div className="flex-1 flex flex-col justify-center">
                <div className="relative w-full h-32 mb-12">
                    {/* The Arc */}
                    <div className="absolute inset-x-0 bottom-0 h-32 border-b border-border/50">
                        <svg className="w-full h-full overflow-visible text-foreground" viewBox="0 0 100 50">
                            {/* Dotted path */}
                            <path
                                d="M 0 50 A 50 50 0 0 1 100 50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                strokeDasharray="3,3"
                                className="opacity-20"
                            />
                            {/* Progress path */}
                            <path
                                d="M 0 50 A 50 50 0 0 1 100 50"
                                fill="none"
                                stroke="#11f2d6"
                                strokeWidth="1"
                                strokeDasharray="157"
                                strokeDashoffset={157 - (157 * (progress / 100))}
                                className="transition-all duration-1000"
                            />
                            {/* The Sun */}
                            <circle
                                r="3"
                                fill="#11f2d6"
                                className="shadow-[0_0_15px_rgba(17,242,214,0.8)] transition-all duration-1000"
                                style={{
                                    cx: 50 - 50 * Math.cos((progress * Math.PI) / 100),
                                    cy: 50 - 50 * Math.sin((progress * Math.PI) / 100)
                                }}
                            />
                        </svg>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-400/10 rounded-xl">
                            <Sunrise className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Sunrise</p>
                            <p className="font-bold">{formatTime(sunrise)}</p>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse items-center gap-3">
                        <div className="p-2 bg-indigo-400/10 rounded-xl">
                            <Sunset className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Sunset</p>
                            <p className="font-bold">{formatTime(sunset)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
