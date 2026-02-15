'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'pdfcraft_favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from local storage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load favorites', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const isFavorite = useCallback((toolId: string) => {
        return favorites.includes(toolId);
    }, [favorites]);

    const toggleFavorite = useCallback((toolId: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(toolId)
                ? prev.filter(id => id !== toolId)
                : [...prev, toolId];

            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            } catch (error) {
                console.error('Failed to save favorites', error);
            }

            return newFavorites;
        });
    }, []);

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        isLoaded
    };
}
