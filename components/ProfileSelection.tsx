
import React from 'react';
import { User } from '../types';
import ProfileCard from './ProfileCard';

interface RankedUser extends User {
  rank: number;
  score: number;
}

interface ProfileSelectionProps {
  users: RankedUser[];
  onSelectProfile: (name: string) => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ users, onSelectProfile }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {users.map(user => (
        <ProfileCard
          key={user.name}
          user={user}
          onSelect={() => onSelectProfile(user.name)}
          rank={user.rank}
          score={user.score}
        />
      ))}
    </div>
  );
};

export default ProfileSelection;
