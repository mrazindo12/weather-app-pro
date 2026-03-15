import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeatherContext } from '../context/WeatherContext';
import { Cloud, Wind, Droplets, Thermometer, Layers, Navigation2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

// OWM Layer configuration
const OWM_LAYERS = [
    { id: 'precipitation_new', name: 'Rain', Icon: Droplets, color: 'text-blue-400' },
    { id: 'clouds_new', name: 'Clouds', Icon: Cloud, color: 'text-slate-400' },
    { id: 'wind_new', name: 'Wind', Icon: Wind, color: 'text-emerald-400' },
    { id: 'temp_new', name: 'Temp', Icon: Thermometer, color: 'text-orange-400' },
];

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export function RadarMapPage() {
    const { location } = useWeatherContext();
    const [center, setCenter] = useState<[number, number]>([location.lat, location.lon]);
    const [activeLayer, setActiveLayer] = useState('precipitation_new');
    const [opacity, setOpacity] = useState(0.7);

    useEffect(() => {
        setCenter([location.lat, location.lon]);
    }, [location.lat, location.lon]);

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Header info overlay */}
            <div className="absolute top-8 left-8 right-8 z-[1000] pointer-events-none">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-auto">
                    <div className="glass-morphism rounded-3xl px-8 py-4 backdrop-blur-2xl border-white/10 shadow-2xl">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Layers className="h-6 w-6 text-primary" />
                            Weather Radar
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">
                            Live Overlay for {location.name}
                        </p>
                    </div>

                    <div className="glass-morphism rounded-3xl p-2 flex items-center gap-2 backdrop-blur-2xl border-white/10 shadow-2xl">
                        {OWM_LAYERS.map((layer) => (
                            <Button
                                key={layer.id}
                                variant={activeLayer === layer.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveLayer(layer.id)}
                                className={`rounded-2xl transition-all duration-300 gap-2 px-4 ${
                                    activeLayer === layer.id ? 'bg-primary text-white scale-105 shadow-lg' : 'text-muted-foreground'
                                }`}
                            >
                                <layer.Icon className={`h-4 w-4 ${activeLayer === layer.id ? 'text-white' : layer.color}`} />
                                <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider">{layer.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-10 right-8 z-[1000] flex flex-col gap-4">
                <div className="glass-morphism rounded-[2rem] p-6 flex flex-col gap-6 backdrop-blur-2xl border-white/10 shadow-2xl min-w-[240px]">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold uppercase tracking-widest opacity-60">Opacity</span>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{Math.round(opacity * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <Button 
                            variant="glass" 
                            size="sm" 
                            className="rounded-xl flex-1 justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300"
                            onClick={() => setCenter([location.lat, location.lon])}
                        >
                            <Navigation2 className="h-4 w-4" /> Recenter
                        </Button>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <MapContainer
                center={center}
                zoom={6}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                zoomControl={false}
                className="radar-map"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* Weather Data Layers */}
                <TileLayer
                    key={`${activeLayer}-${opacity}`}
                    url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
                    opacity={opacity}
                    zIndex={10}
                />
                
                <MapUpdater center={center} />
            </MapContainer>
        </div>
    );
}
