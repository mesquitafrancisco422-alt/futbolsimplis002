import React, { useState, useEffect, useCallback } from 'react';
import { Championship, Match } from './types';
import { fetchMatches } from './services/geminiService';
import Header from './components/Header';
import MatchList from './components/MatchList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Notification from './components/Notification';
import ImminentGameBanner from './components/ImminentGameBanner';

const FAVORITES_STORAGE_KEY = 'favoriteMatches';

type NotificationPermission = 'default' | 'granted' | 'denied';

// --- Notification Helpers ---
const postMessageToSW = (message: object) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
    } else {
        console.error("Service worker not active.");
    }
};

const scheduleNotification = (match: Match) => {
    const [team1, team2] = match.teams;
    const title = `Começando em 10 min: ${team1.name} vs ${team2.name}`;
    const options = {
        body: `A partida será transmitida em: ${match.broadcasters.map(b => b.name).join(', ')}.`,
        tag: match.id, // Use match ID as tag to prevent duplicates and for cancellation
        icon: '/favicon.ico', // Optional: Add an icon
        renotify: true,
    };
    postMessageToSW({ type: 'SCHEDULE_NOTIFICATION', payload: { match, title, options } });
};

const cancelNotification = (matchId: string) => {
    postMessageToSW({ type: 'CANCEL_NOTIFICATION', payload: { matchId } });
};


// --- Storage Helpers ---
const getFavoriteMatchesFromStorage = (): Match[] => {
    try {
        const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Error reading favorites from localStorage:", error);
        return [];
    }
};

const saveFavoriteMatchesToStorage = (matches: Match[]): void => {
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(matches));
    } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
    }
};

const App: React.FC = () => {
  const [selectedChampionship, setSelectedChampionship] = useState<Championship>(Championship.BRASILEIRAO);
  const [matches, setMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [imminentMatches, setImminentMatches] = useState<Match[]>([]);

  // --- Effects ---
  const checkImminentMatches = useCallback(() => {
    const favs = getFavoriteMatchesFromStorage();
    const now = new Date().getTime();
    const imminent = favs.filter(match => {
        const matchTime = new Date(match.dateTime).getTime();
        const thirtyMinutes = 30 * 60 * 1000;
        return matchTime > now && matchTime - now < thirtyMinutes;
    });
    const sortedImminent = imminent.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    setImminentMatches(sortedImminent);
  }, []);

  useEffect(() => {
    // Initial setup
    if ('Notification' in window) {
      setNotificationPermission(window.Notification.permission as NotificationPermission);
    }
    const favs = getFavoriteMatchesFromStorage();
    setFavorites(favs.map(m => m.id));
    checkImminentMatches(); // Initial check

    // Set up periodic check every minute for reliability
    const intervalId = setInterval(checkImminentMatches, 60 * 1000);

    // Cleanup on component unmount
    return () => {
        clearInterval(intervalId);
    };
  }, [checkImminentMatches]);

  const loadMatches = useCallback(async (championship: Championship) => {
    setIsLoading(true);
    setError(null);
    if (championship !== Championship.FAVORITES) {
      setImminentMatches([]); // Clear banner when loading a new list, but keep it for favorites view
    }
    try {
        if (championship === Championship.FAVORITES) {
            const favMatches = getFavoriteMatchesFromStorage();
            const sortedFavs = favMatches.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
            setMatches(sortedFavs);
            checkImminentMatches(); // Re-check imminent matches when viewing favorites
        } else {
            const fetchedMatches = await fetchMatches(championship);
            setMatches(fetchedMatches);
        }
    } catch (err) {
        const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        setError(errorMessage);
        setMatches([]);
    } finally {
      setIsLoading(false);
    }
  }, [checkImminentMatches]);

  useEffect(() => {
    loadMatches(selectedChampionship);
  }, [selectedChampionship, loadMatches]);


  // --- Handlers ---
  const handleRequestNotificationPermission = () => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission().then(permission => {
        setNotificationPermission(permission as NotificationPermission);
        if (permission === 'granted') {
            showNotification('✅ Notificações ativadas!');
            getFavoriteMatchesFromStorage().forEach(scheduleNotification);
        }
      });
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }

  const handleToggleFavorite = (match: Match) => {
    const currentFavorites = getFavoriteMatchesFromStorage();
    const isAlreadyFavorite = currentFavorites.some(favMatch => favMatch.id === match.id);

    let updatedFavorites: Match[];
    if (isAlreadyFavorite) {
        updatedFavorites = currentFavorites.filter(favMatch => favMatch.id !== match.id);
        cancelNotification(match.id);
        showNotification('Jogo removido dos favoritos!');
        // OPTIMIZATION: Manually remove from imminent matches list
        setImminentMatches(prev => prev.filter(m => m.id !== match.id));
    } else {
        updatedFavorites = [...currentFavorites, match];
        if (notificationPermission === 'granted') {
            scheduleNotification(match);
        }
        showNotification('⭐ Jogo adicionado aos favoritos!');
        // OPTIMIZATION: Check if the new favorite is imminent and add it
        const now = new Date().getTime();
        const matchTime = new Date(match.dateTime).getTime();
        const thirtyMinutes = 30 * 60 * 1000;
        if (matchTime > now && matchTime - now < thirtyMinutes) {
            setImminentMatches(prev => 
                [...prev, match].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
            );
        }
    }
    saveFavoriteMatchesToStorage(updatedFavorites);
    setFavorites(updatedFavorites.map(m => m.id));

    // If the user is currently on the favorites tab, update the list in real-time
    if (selectedChampionship === Championship.FAVORITES) {
        const sortedFavs = updatedFavorites.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        setMatches(sortedFavs);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto max-w-screen-2xl pb-16">
        <Header
          selectedChampionship={selectedChampionship}
          onSelectChampionship={setSelectedChampionship}
          notificationPermission={notificationPermission}
          onNotificationRequest={handleRequestNotificationPermission}
        />
        <ImminentGameBanner matches={imminentMatches} />
        <div className="min-h-[60vh] flex flex-col justify-center">
            {isLoading && <LoadingSpinner />}
            {!isLoading && error && <ErrorDisplay message={error} />}
            {!isLoading && !error && <MatchList matches={matches} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Dados dos jogos fornecidos via IA. A programação pode sofrer alterações.</p>
      </footer>
      <Notification message={notification} />
    </div>
  );
};

export default App;