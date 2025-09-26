import React from 'react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isFavorite, onToggleFavorite }) => {
  const [team1, team2] = match.teams;
  const matchDate = new Date(match.dateTime);

  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dateParts = dateFormatter.formatToParts(matchDate);
  let weekday = '', day = '', month = '';
  dateParts.forEach(part => {
    switch(part.type) {
      case 'weekday': weekday = part.value; break;
      case 'day': day = part.value; break;
      case 'month': month = part.value; break;
    }
  });

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const formattedDate = `${capitalize(weekday)}, ${day} de ${capitalize(month)}`;


  const formattedTime = matchDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div 
      tabIndex={0}
      className="relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:scale-105"
    >
        <button
            onClick={() => onToggleFavorite(match)}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/80 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-all ${isFavorite ? 'text-yellow-400 scale-110' : 'text-gray-400'}`} viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        </button>

      <div className="p-6 sm:p-8">
        <div className="text-center text-gray-300 mb-6">
          <p className="font-semibold text-lg">{formattedDate}</p>
          <p className="text-4xl font-bold text-white">{formattedTime}</p>
        </div>
        
        <div className="flex items-center justify-around text-white mb-8">
          <div className="flex flex-col items-center w-1/3 text-center">
            <img src={team1.logoUrl} alt={team1.name} className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-full bg-gray-700 mb-3" />
            <span className="font-bold text-base sm:text-lg">{team1.name}</span>
          </div>
          <div className="text-4xl font-light text-gray-500">vs</div>
          <div className="flex flex-col items-center w-1/3 text-center">
            <img src={team2.logoUrl} alt={team2.name} className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-full bg-gray-700 mb-3" />
            <span className="font-bold text-base sm:text-lg">{team2.name}</span>
          </div>
        </div>

        <div className="text-center">
            <p className="text-base text-gray-400 mb-4">Onde assistir:</p>
            <div className="flex flex-col space-y-3">
                {match.broadcasters.length > 0 ? (
                    match.broadcasters.map((broadcaster) => (
                        <a
                            key={broadcaster.name}
                            href={broadcaster.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-4 font-semibold text-lg rounded-lg transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                        >
                            Assistir no {broadcaster.name}
                        </a>
                    ))
                ) : (
                    <div className="bg-gray-700/50 rounded-lg py-4">
                        <p className="text-gray-400 text-center text-base font-medium">Transmissão não informada</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;