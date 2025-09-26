import React from 'react';
import { Championship } from '../types';
import NotificationBell from './NotificationBell';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface HeaderProps {
  selectedChampionship: Championship;
  onSelectChampionship: (championship: Championship) => void;
  notificationPermission: NotificationPermission;
  onNotificationRequest: () => void;
}

const championshipOptions = [
  { id: Championship.BRASILEIRAO, label: 'Brasileirão', icon: null },
  { id: Championship.LIBERTADORES, label: 'Libertadores', icon: null },
  { id: Championship.COPA_DO_BRASIL, label: 'Copa do Brasil', icon: null },
  { id: Championship.FAVORITES, label: 'Favoritos', icon: '⭐' },
];

const Header: React.FC<HeaderProps> = ({ selectedChampionship, onSelectChampionship, notificationPermission, onNotificationRequest }) => {
  return (
    <header className="p-4 sm:p-6 w-full">
        <div className="flex justify-between items-center mb-6">
            <div className="w-12"></div> {/* Spacer */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
                Guia de Jogos TV
            </h1>
            <div className="w-12 flex justify-end">
                <NotificationBell permission={notificationPermission} requestPermission={onNotificationRequest} />
            </div>
        </div>
      <nav className="flex justify-center items-center flex-wrap gap-2 sm:gap-4">
        {championshipOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectChampionship(option.id)}
            className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
              selectedChampionship === option.id
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.icon && <span className="text-lg">{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
