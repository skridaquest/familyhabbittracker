
import React from 'react';
import { User } from '../types';

interface ProfileCardProps {
  user: User;
  onSelect: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center cursor-pointer
                 shadow-lg hover:shadow-purple-500/30 border border-slate-700
                 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-purple-500"
    >
      <img
        src={user.avatarImage || `https://api.dicebear.com/8.x/${user.avatarStyle}/svg?seed=${user.avatarSeed}`}
        alt={user.name}
        className="w-32 h-32 rounded-full mb-4 border-4 border-slate-600 object-cover bg-slate-700"
      />
      <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
      <p className="text-slate-400">{user.role}</p>
    </div>
  );
};

export default ProfileCard;
