import React from 'react';
import { Match } from '../types';

interface ImminentGameBannerProps {
  matches: Match[];
}

const ImminentGameBanner: React.FC<ImminentGameBannerProps> = ({ matches }) => {
  if (matches.length === 0) return null;

  const getMinutesUntil = (dateTime: string) => {
    const now = new Date().getTime();
    const matchTime = new Date(dateTime).getTime();
    return Math.round((matchTime - now) / 60000);
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 text-white p-4 mb-6 shadow-lg rounded-lg animate-pulse-slow">
      <div className="text-center font-bold">
        {matches.map(match => {
            const minutes = getMinutesUntil(match.dateTime);
            const [team1, team2] = match.teams;
            return (
                <div key={match.id} className="text-lg sm:text-xl">
                    <span role="img" aria-label="Warning">⚠️</span> COMEÇANDO EM BREVE ({minutes} min): {team1.name} vs {team2.name}
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default ImminentGameBanner;
