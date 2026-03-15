import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useWeatherContext } from './context/WeatherContext';
import { Sidebar } from './components/layout/Sidebar';
import { ThemeProvider } from './contexts/ThemeContext';
import { DashboardPage } from './pages/DashboardPage';
import { RadarMapPage } from './pages/RadarMapPage';
import { SavedCitiesPage } from './pages/SavedCitiesPage';
import { SettingsPage } from './pages/SettingsPage';

function MainLayout() {
  const { theme, weatherCondition, isDay } = useWeatherContext();

  const getBackgroundClass = () => {
    // If the theme is set to 'aurora' (default or explicit), use the aurora gradient
    if (theme === 'aurora') return 'weather-gradient-aurora';
    
    // Otherwise, check for weather conditions to apply dynamic backgrounds
    switch (weatherCondition) {
      case 'clear':
        return isDay ? 'bg-weather-clear' : 'weather-gradient-night';
      case 'clouds':
        return 'bg-weather-clouds';
      case 'rain':
      case 'drizzle':
        return 'bg-weather-rain';
      case 'thunderstorm':
        return 'bg-weather-storm';
      case 'snow':
        return 'bg-weather-snow';
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
      case 'sand':
      case 'ash':
      case 'squall':
      case 'tornado':
        return 'bg-weather-fog';
      default:
        // Fallback to time-based gradients if condition is unknown
        return isDay ? 'weather-gradient-aurora' : 'weather-gradient-night';
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-all duration-1000 ease-in-out ${getBackgroundClass()} text-foreground relative`}>
      <div className="weather-overlay" aria-hidden="true" />
      <Sidebar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="weather-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="radar" element={<RadarMapPage />} />
            <Route path="saved" element={<SavedCitiesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
