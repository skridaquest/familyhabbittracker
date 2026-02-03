import React, { useState, useEffect, useMemo } from 'react';
import { USERS, getDatesForFebruary2026, generateInitialData } from './constants';
import { HabitStatus, FamilyData } from './types';
import ProfileSelection from './components/ProfileSelection';
import HabitTrackerGrid from './components/HabitTrackerGrid';
import OverallProgress from './components/OverallProgress';

import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Initialize with empty structure, data will be populated from Supabase
  const [appData, setAppData] = useState<FamilyData>(generateInitialData());

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('daily_habits')
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (data) {
        setAppData(prevData => {
          const newData = JSON.parse(JSON.stringify(prevData));
          data.forEach((row: any) => {
            if (newData[row.user_name] && newData[row.user_name].progress[row.date_str]) {
              newData[row.user_name].progress[row.date_str][row.habit_name] = row.status;
            }
          });
          return newData;
        });
      }
    };

    fetchData();

    // Optional: Realtime subscription could go here
  }, []);

  const { overallProgress, totalCompleted } = useMemo(() => {
    if (!selectedProfile) return { overallProgress: 0, totalCompleted: 0 };

    let completedHabits = 0;
    let totalPossibleHabits = 0;
    const numDays = getDatesForFebruary2026().length;

    const user = USERS[selectedProfile];
    if (user) {
      totalPossibleHabits += user.habits.length * numDays;
    }

    const userData = appData[selectedProfile];
    if (userData) {
      Object.values(userData.progress).forEach(day => {
        Object.values(day).forEach(status => {
          if (status === HabitStatus.Completed) {
            completedHabits++;
          }
        });
      });
    }

    const percentage = totalPossibleHabits > 0 ? Math.round((completedHabits / totalPossibleHabits) * 100) : 0;

    return { overallProgress: percentage, totalCompleted: completedHabits };
  }, [appData, selectedProfile]);


  const handleProfileSelect = (name: string) => {
    setSelectedProfile(name);
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
  };

  const handleStatusChange = async (userName: string, date: string, habit: string) => {
    // Calculate based on current state. safe enough for manual toggling
    const currentStatus = appData[userName].progress[date][habit];
    const newStatus = ((currentStatus + 1) % 3) as HabitStatus;

    // Optimistic Update
    setAppData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
      newData[userName].progress[date][habit] = newStatus;
      return newData;
    });

    // Supabase Upsert
    const { error } = await supabase
      .from('daily_habits')
      .upsert({
        user_name: userName,
        date_str: date,
        habit_name: habit,
        status: newStatus
      }, { onConflict: 'user_name, date_str, habit_name' });

    if (error) {
      console.error("Error updating status:", error);
      // Revert on error (optional, but good practice)
    }
  };

  const userArray = Object.values(USERS);
  const selectedUserData = selectedProfile ? appData[selectedProfile] : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 m-auto h-[500px] w-[500px] bg-purple-900/20 rounded-full blur-3xl -z-0"></div>
      <div className="w-full max-w-7xl mx-auto z-10 flex flex-col items-center">
        <header className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Family Habit Tracker</h1>
          <p className="text-slate-400 mt-2 text-lg">February 2026</p>
        </header>

        <main className="w-full">
          {!selectedUserData ? (
            <ProfileSelection users={userArray} onSelectProfile={handleProfileSelect} />
          ) : (
            <>
              <OverallProgress percentage={overallProgress} />
              <HabitTrackerGrid
                user={selectedUserData}
                dates={getDatesForFebruary2026()}
                onStatusChange={handleStatusChange}
                onBack={handleBackToProfiles}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
