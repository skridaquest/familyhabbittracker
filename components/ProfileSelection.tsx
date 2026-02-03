
import React from 'react';
import { User } from '../types';
import ProfileCard from './ProfileCard';

interface ProfileSelectionProps {
  users: User[];
  onSelectProfile: (name: string) => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ users, onSelectProfile }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {users.map(user => (
        <ProfileCard key={user.name} user={user} onSelect={() => onSelectProfile(user.name)} />
      ))}
    </div>
  );
};

export default ProfileSelection;
