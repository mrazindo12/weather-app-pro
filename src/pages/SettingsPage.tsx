import { useWeatherContext } from '../context/WeatherContext';
import { useTheme } from '../contexts/ThemeContext';
import { Settings, Ruler, Palette, Info, Shield, HelpCircle, ChevronRight, Globe, Github } from 'lucide-react';

export function SettingsPage() {
    const { units, toggleUnits } = useWeatherContext();
    const { theme: uiTheme, setTheme: setUITheme } = useTheme();

    return (
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="container mx-auto px-6 py-8 md:py-10 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
                    <p className="text-muted-foreground">Adjust your preferences and learn more about WeatherScope.</p>
                </div>

                <div className="space-y-10">
                    {/* General Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-6">
                            <Settings className="h-4 w-4" /> General
                        </h2>
                        <div className="glass-morphism rounded-[2.5rem] divide-y divide-border/30 overflow-hidden">
                            <div className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="bg-primary/10 p-3 rounded-2xl">
                                        <Ruler className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold mb-1">Temperature Units</p>
                                        <p className="text-sm text-muted-foreground">Choose between Celsius and Fahrenheit</p>
                                    </div>
                                </div>
                                <div className="flex bg-muted p-1 rounded-2xl border border-border">
                                    <button 
                                        onClick={() => units === 'imperial' && toggleUnits()}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${units === 'metric' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Metric (°C)
                                    </button>
                                    <button 
                                        onClick={() => units === 'metric' && toggleUnits()}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${units === 'imperial' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Imperial (°F)
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="bg-indigo-400/10 p-3 rounded-2xl">
                                        <Palette className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold mb-1">Appearance</p>
                                        <p className="text-sm text-muted-foreground">Toggle light and dark themes</p>
                                    </div>
                                </div>
                                <div className="flex bg-muted p-1 rounded-2xl border border-border">
                                    <button 
                                        onClick={() => setUITheme('light')}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${uiTheme === 'light' ? 'bg-indigo-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Light
                                    </button>
                                    <button 
                                        onClick={() => setUITheme('dark')}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${uiTheme === 'dark' ? 'bg-indigo-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Dark
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Support & About */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">
                            <Info className="h-4 w-4" /> About
                        </h2>
                        <div className="glass-morphism rounded-[2.5rem] divide-y divide-border/30 overflow-hidden">
                            <button className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
                                <div className="flex items-center gap-6">
                                    <div className="bg-emerald-400/10 p-3 rounded-2xl">
                                        <Globe className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold mb-1">Version</p>
                                        <p className="text-sm text-muted-foreground">v2.1.0-aurora (Latest Release)</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
                                <div className="flex items-center gap-6">
                                    <div className="bg-rose-400/10 p-3 rounded-2xl">
                                        <Shield className="h-6 w-6 text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold mb-1">Privacy Policy</p>
                                        <p className="text-sm text-muted-foreground">Learn how we handle your weather data</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors text-left group">
                                <div className="flex items-center gap-6">
                                    <div className="bg-blue-400/10 p-3 rounded-2xl">
                                        <HelpCircle className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold mb-1">Help & Support</p>
                                        <p className="text-sm text-muted-foreground">Frequently asked questions and support</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </section>

                    <footer className="pt-12 flex flex-col items-center gap-6 opacity-60">
                        <div className="flex items-center gap-8">
                            <a href="#" className="hover:text-primary transition-colors"><Github className="h-6 w-6" /></a>
                            <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Careers</a>
                        </div>
                        <p className="text-sm font-medium">© 2026 WeatherScope AI. Powered by OpenWeatherMap.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
