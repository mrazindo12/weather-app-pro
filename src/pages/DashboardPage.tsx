import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useWeatherContext } from '../context/WeatherContext';
import { SearchBar } from '../components/weather/SearchBar';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { Forecast } from '../components/weather/Forecast';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { SunriseSunset } from '../components/weather/SunriseSunset';
import { UnitToggle } from '../components/weather/UnitToggle';
import { AdditionalMetrics } from '../components/weather/AdditionalMetrics';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Feedback';
import { Button } from '../components/ui/Button';
import { geocodingService } from '../services/geocodingService';
import type { LocationData } from '../types/weather';

export function DashboardPage() {
  const navigate = useNavigate();
  const { units, location: contextLocation, setLocation: setContextLocation, setTheme, setWeatherState, locationError } = useWeatherContext();
  const { currentWeather, forecast, airQuality, isLoading, error, fetchWeatherByLocation, fetchWeatherByCoords } = useWeather();
  const { searches, addSearch } = useRecentSearches();

  // Load weather for initial location on mount
  useEffect(() => {
    if (contextLocation) {
        handleSearch(contextLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextLocation.lat, contextLocation.lon]);

  // Update when units change
  useEffect(() => {
    if (contextLocation) {
      fetchWeatherByLocation(contextLocation);
    }
  }, [units]);

  useEffect(() => {
    if (currentWeather) {
      const iconCode = currentWeather.weather[0].icon;
      const condition = currentWeather.weather[0].main;
      const isDaytime = iconCode.includes('d');
      
      setWeatherState(condition, isDaytime);
      
      if (!isDaytime) {
        setTheme('night');
      } else {
        setTheme('day');
      }
    }
  }, [currentWeather, setTheme, setWeatherState]);

  const handleSearch = async (loc: LocationData) => {
    const success = await fetchWeatherByLocation(loc);
    if (success) {
      addSearch(loc);
      setContextLocation(loc);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          try {
            const results = await geocodingService.reverseGeocode(lat, lon);
            if (results.length > 0) {
                const loc: LocationData = {
                    name: results[0].name,
                    lat,
                    lon,
                    country: results[0].country,
                    state: results[0].state
                };
                handleSearch(loc);
            } else {
                fetchWeatherByCoords(lat, lon);
            }
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
            fetchWeatherByCoords(lat, lon);
          }
        },
        () => {
          alert('Unable to retrieve your location. Check browser settings.');
        }
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="container mx-auto px-6 py-8 md:py-10 max-w-7xl">
        {/* Top Navigation / Search */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-in slide-in-from-top-4 duration-700">
          <div className="w-full md:w-auto flex-1 max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              onMyLocation={handleMyLocation}
              recentSearches={searches}
            />
          </div>

          <div className="flex items-center gap-4">
            <UnitToggle />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 transition-all animate-in fade-in duration-1000">
          {locationError && (
            <div className="col-span-12">
               <div className="bg-primary/10 border border-primary/20 rounded-3xl p-4 text-center mb-6 animate-in slide-in-from-top-2">
                 <p className="text-sm font-medium text-foreground/80">{locationError}</p>
               </div>
            </div>
          )}

          {error && (
            <div className="col-span-12">
              <ErrorMessage message={error} />
            </div>
          )}

          {isLoading && !currentWeather && (
            <div className="col-span-12 flex justify-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {!error && !isLoading && currentWeather && forecast && (
            <>
              {/* Left Column: Current Weather & Hourly */}
              <div className="col-span-1 xl:col-span-8 flex flex-col gap-10 xl:gap-12">
                <CurrentWeather data={currentWeather} />
                <HourlyForecast data={forecast} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-12">
                  <SunriseSunset
                    sunrise={currentWeather.sys.sunrise}
                    sunset={currentWeather.sys.sunset}
                  />
                  <div 
                    onClick={() => navigate('/radar')}
                    className="glass-morphism rounded-3xl p-6 flex items-center justify-center border-primary/20 cursor-pointer group hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2 font-bold group-hover:text-primary transition-colors">Weather Map</p>
                      <p className="font-medium text-foreground/80">Radar satellite visualization</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-primary hover:bg-primary/10 transition-all group-hover:scale-105 active:scale-95"
                      >
                        View Detailed Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 5-Day Forecast & Metrics */}
              <div className="col-span-1 xl:col-span-4 flex flex-col gap-10 xl:gap-12">
                <div className="glass-morphism rounded-3xl p-1">
                  <Forecast data={forecast} />
                </div>
                <AdditionalMetrics weather={currentWeather} aqi={airQuality} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
