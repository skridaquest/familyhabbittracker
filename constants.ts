
import { User, FamilyData, DayData, HabitStatus } from './types';
import fatherIcon from './assets/avatars/father.png';
import motherIcon from './assets/avatars/mother.png';
import girlIcon from './assets/avatars/girl.png';
import boyIcon from './assets/avatars/boy.png';

export const USERS: { [key: string]: User } = {
  Prem: {
    name: 'Prem',
    role: 'Father',
    avatarSeed: 'Prem',
    avatarStyle: 'personas',
    avatarImage: fatherIcon,
    habits: ['Yoga', 'Sadhana', 'Trading', 'Office', 'SaaS', 'Freelancing'],
  },
  Sujata: {
    name: 'Sujata',
    role: 'Mother',
    avatarSeed: 'Sujata',
    avatarStyle: 'personas',
    avatarImage: motherIcon,
    habits: ['Yoga', 'Sadhana', 'English', 'Trading', 'Self time'],
  },
  MAA: {
    name: 'MAA',
    role: 'Girl',
    avatarSeed: 'MAA',
    avatarStyle: 'micah',
    avatarImage: girlIcon,
    habits: ['Bath', 'Sadhana', 'Homework', 'Math', 'Reading', 'Experiment', 'Singing', 'Garden', 'Video'],
  },
  Shiva: {
    name: 'Shiva',
    role: 'Boy',
    avatarSeed: 'Shiva',
    avatarStyle: 'micah',
    avatarImage: boyIcon,
    habits: ['Bath', 'Sadhana', 'Phonics', 'Marathi reading'],
  },
};

export const getDatesForFebruary2026 = (): string[] => {
  const dates: string[] = [];
  // February 2026 has 28 days
  for (let i = 1; i <= 28; i++) {
    dates.push(i.toString());
  }
  return dates;
};

export const generateInitialData = (): FamilyData => {
  const dates = getDatesForFebruary2026();
  const initialData: FamilyData = {};

  Object.values(USERS).forEach(user => {
    const userProgress: { [date: string]: DayData } = {};
    dates.forEach(date => {
      const dayData: DayData = {};
      user.habits.forEach(habit => {
        dayData[habit] = HabitStatus.Empty;
      });
      userProgress[date] = dayData;
    });
    initialData[user.name] = { ...user, progress: userProgress };
  });

  return initialData;
};
