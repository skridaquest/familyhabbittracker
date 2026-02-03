
import React from 'react';
import { User } from '../types';
import { Crown } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  onSelect: () => void;
  rank?: number;
  score?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onSelect, rank, score }) => {
  const getCrownColor = (r: number) => {
    switch (r) {
      case 1: return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'; // Gold
      case 2: return 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]'; // Silver
      case 3: return 'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]'; // Bronze
      default: return 'text-slate-700';
    }
  };

  return (
    <div
      onClick={onSelect}
      className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center cursor-pointer
                 shadow-lg hover:shadow-purple-500/30 border border-slate-700
                 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-purple-500 relative"
    >
      {rank && rank <= 3 && (
        <div className="absolute -top-4 -right-4 bg-slate-900 rounded-full p-2 border border-slate-700 shadow-xl">
          <Crown className={`w-8 h-8 ${getCrownColor(rank)}`} fill="currentColor" fillOpacity={0.2} />
        </div>
      )}

      {rank && (
        <div className="absolute top-2 left-2 bg-slate-700/80 rounded-lg px-2 py-1 text-xs font-bold text-white border border-slate-600">
          #{rank}
        </div>
      )}

      <img
        src={user.avatarImage || `https://api.dicebear.com/8.x/${user.avatarStyle}/svg?seed=${user.avatarSeed}`}
        alt={user.name}
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 border-4 border-slate-600 object-cover bg-slate-700"
      />
      <h2 className="text-xl sm:text-2xl font-semibold text-white">{user.name}</h2>
      <p className="text-slate-400 mb-2">{user.role}</p>

      {score !== undefined && (
        <div className="mt-2 text-xs font-semibold px-3 py-1 bg-purple-900/40 text-purple-200 rounded-full border border-purple-500/30">
          {Math.round(score)}% Disciplined
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
