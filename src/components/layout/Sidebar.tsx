import { LayoutDashboard, Map as MapIcon, Settings, Heart, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const { theme: uiTheme, setTheme: setUiTheme } = useTheme();

    const navItems = [
        { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/' },
        { icon: <MapIcon className="h-5 w-5" />, label: 'Radar Map', path: '/radar' },
        { icon: <Heart className="h-5 w-5" />, label: 'Saved Cities', path: '/saved' },
        { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
    ];

    const toggleTheme = () => {
        setUiTheme(uiTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <aside className={cn(
            "flex flex-col w-20 lg:w-64 glass-morphism h-full p-4 transition-all duration-300",
            className
        )}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="bg-primary p-2 rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
                    <div className="h-6 w-6 border-4 border-background rounded-full border-t-transparent animate-spin-slow" />
                </div>
                <span className="font-bold text-xl tracking-tight hidden lg:block text-foreground">WeatherScope</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center w-full justify-start gap-4 px-3 py-4 lg:py-6 rounded-2xl group transition-all duration-300",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5 font-normal"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    "transition-transform duration-300",
                                    !isActive && "group-hover:scale-110"
                                )}>
                                    {item.icon}
                                </div>
                                <span className="hidden lg:block">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Theme Toggle */}
            <div className="mt-auto px-2 pb-6">
                <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="w-full justify-start gap-4 px-3 py-6 rounded-2xl group transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                        {uiTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </div>
                    <span className="hidden lg:block font-medium">
                        {uiTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </Button>
            </div>
        </aside>
    );
}
