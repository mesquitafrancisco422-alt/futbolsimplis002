import React from 'react';
import { Match } from '../types';
import MatchCard from './MatchCard';

interface MatchListProps {
  matches: Match[];
  favorites: string[];
  onToggleFavorite: (match: Match) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, favorites, onToggleFavorite }) => {
  if (matches.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Nenhum Jogo Encontrado</h2>
            <p className="text-lg">Não há jogos futuros agendados para este campeonato ou nos seus favoritos.</p>
        </div>
    )
  }
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 p-6 sm:p-8">
      {matches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match}
          isFavorite={favorites.includes(match.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default MatchList;