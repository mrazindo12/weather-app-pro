import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2, History, Search as SearchIcon, ChevronRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { type HybridSuggestion } from '../../hooks/useLocationSearch';
import type { LocationData } from '../../types/weather';
import { useLocationSearch } from '../../hooks/useLocationSearch';

interface SearchBarProps {
    onSearch: (location: LocationData) => void;
    recentSearches: LocationData[];
    onMyLocation: () => void;
}

export function SearchBar({ onSearch, recentSearches, onMyLocation }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { suggestions, isLoading, noResults, hasResults } = useLocationSearch(query);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectLocation = (loc: LocationData | HybridSuggestion) => {
        const isHybrid = 'isLandmark' in loc;
        const name = (isHybrid && loc.isLandmark) ? (loc.landmarkName || loc.name) : loc.name;

        onSearch({
            name,
            lat: loc.lat,
            lon: loc.lon,
            country: loc.country,
            state: loc.state
        });
        setIsFocused(false);
        setQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            handleSelectLocation(suggestions[0]);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showDropdown = isFocused && (
        hasResults ||
        isLoading ||
        noResults ||
        (query.length === 0 && recentSearches.length > 0)
    );

    return (
        <div className="relative w-full max-w-2xl mx-auto z-50">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <div className="relative w-full" ref={dropdownRef}>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search for a city, landmark, or university..."
                        icon
                        className="w-full text-base h-14"
                    />

                    {/* Suggestions / Recent Searches Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-16 left-0 right-0 glass-morphism rounded-[2rem] overflow-hidden shadow-2xl border-primary/10 dark:border-white/10 bg-background/80 backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-300 p-2">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="px-4 py-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                                    <p className="text-sm font-medium animate-pulse">Searching locations...</p>
                                </div>
                            )}

                            {/* No Results State */}
                            {noResults && (
                                <div className="px-4 py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground text-center">
                                    <div className="h-10 w-10 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-1">
                                        <SearchIcon className="h-5 w-5 opacity-40" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground/60 dark:text-white/60">No locations found</p>
                                    <p className="text-xs opacity-60">Try searching for a town, landmark, or city</p>
                                </div>
                            )}

                            {/* Suggestions List */}
                            {hasResults && !isLoading && (
                                <div>
                                    <p className="px-4 py-3 text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-60">
                                        Found Locations
                                    </p>
                                    <div className="space-y-1">
                                        {suggestions.map((loc, index) => (
                                            <button
                                                key={`${loc.lat}-${loc.lon}-${index}`}
                                                type="button"
                                                onClick={() => handleSelectLocation(loc)}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-primary/5 dark:hover:bg-white/10 rounded-2xl transition-all flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground dark:text-white/90 text-base">
                                                            {loc.isLandmark ? (
                                                                <>
                                                                    <span className="text-primary mr-1">✦</span>
                                                                    {loc.landmarkName}
                                                                </>
                                                            ) : loc.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground group-hover:text-foreground/60 dark:group-hover:text-white/60 transition-colors">
                                                            {loc.name} — {loc.state ? `${loc.state}, ` : ''}{loc.country}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Searches (only if query is empty) */}
                            {query.length === 0 && recentSearches.length > 0 && (
                                <div>
                                    <p className="px-4 py-3 text-[10px] font-bold text-muted-foreground dark:text-white/40 uppercase tracking-[0.2em]">
                                        Recently Viewed
                                    </p>
                                    <div className="space-y-1">
                                        {recentSearches.map((loc, index) => (
                                            <button
                                                key={`recent-${loc.lat}-${loc.lon}-${index}`}
                                                type="button"
                                                onClick={() => handleSelectLocation(loc)}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-primary/5 dark:hover:bg-white/10 rounded-2xl transition-all flex items-center gap-4 group"
                                            >
                                                <div className="h-9 w-9 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center text-muted-foreground dark:text-white/30 group-hover:bg-primary/10 dark:group-hover:bg-white/20 group-hover:text-primary transition-all">
                                                    <History className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground/80 dark:text-white/80">{loc.name}</p>
                                                    <p className="text-[10px] text-muted-foreground dark:text-white/40 uppercase tracking-widest font-black">
                                                        {loc.state ? `${loc.state}, ` : ''}{loc.country}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Button
                    type="button"
                    variant="glass"
                    onClick={onMyLocation}
                    className="h-14 w-14 rounded-[1.25rem] flex items-center justify-center hover:bg-primary hover:text-black transition-all group"
                    title="Use Current Location"
                >
                    <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </Button>
            </form>
        </div>
    );
}
