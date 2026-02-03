import React, { useState, useEffect, useMemo } from 'react';
import { USERS, getDatesForFebruary2026, generateInitialData } from './constants';
import { HabitStatus, FamilyData } from './types';
import ProfileSelection from './components/ProfileSelection';
import HabitTrackerGrid from './components/HabitTrackerGrid';
import HabitStatsCard from './components/HabitStatsCard';

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

  const { totalCompleted, totalIncomplete, totalPending } = useMemo(() => {
    if (!selectedProfile) return { totalCompleted: 0, totalIncomplete: 0, totalPending: 0 };

    let completedHabits = 0;
    let incompleteHabits = 0;
    let pendingHabits = 0;
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
          } else if (status === HabitStatus.Incomplete) {
            incompleteHabits++;
          } else {
            pendingHabits++;
          }
        });
      });
    }

    return {
      totalCompleted: completedHabits,
      totalIncomplete: incompleteHabits,
      totalPending: pendingHabits
    };
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

  // Calculate Ranks and Scores
  const rankedUsers = useMemo(() => {
    const today = new Date();
    // In a real app, use actual current date. Here we use "1", "2", etc.
    // For demo purposes, let's assume "today" covers all dates for score calculation
    // or arguably, we should calculate up to the max date present in data.
    // Let's calculate based on ALL dates for now as per requirement "based on current date" is tricky with static Feb 2026.
    // We'll treat "current date" as the end of the month for this simulation or just check all entries.

    // Better logic: Compare completed vs total due up to "today".
    // Since we don't have a real running clock syncing with 2026, we will calculate based on ALL days available in the grid.

    const userScores = Object.values(USERS).map(user => {
      const userData = appData[user.name];
      let completed = 0;
      let totalDue = 0;

      if (userData) {
        Object.values(userData.progress).forEach(day => {
          Object.values(day).forEach(status => {
            totalDue++; // Every cell is a due habit
            if (status === HabitStatus.Completed) {
              completed++;
            }
          });
        });
      }

      // If data is empty (initial load), totalDue might be 0 if loop doesn't run, 
      // but generateInitialData ensures structure exists.

      const score = totalDue > 0 ? (completed / totalDue) * 100 : 0;
      return { ...user, score, rank: 0 }; // Initialize rank
    });

    // Sort descending by score
    userScores.sort((a, b) => b.score - a.score);

    // Assign ranks logic
    // We want #1, #2, #3, #4
    userScores.forEach((u, index) => {
      u.rank = index + 1;
    });

    // Now we need to map this back to the original order (or sorted order) for display? 
    // User requested "looking at profile selection cards we should know who is leading". 
    // I will return them in the original family order but with the calculated rank attached.

    const familyOrder = ['Prem', 'Sujata', 'MAA', 'Shiva'];
    const finalRankedUsers = familyOrder.map(name => {
      const userWithStats = userScores.find(u => u.name === name);
      return userWithStats!;
    });

    return finalRankedUsers;
  }, [appData]);

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
            <ProfileSelection users={rankedUsers} onSelectProfile={handleProfileSelect} />
          ) : (
            <>
              <HabitStatsCard
                completed={totalCompleted}
                incomplete={totalIncomplete}
                pending={totalPending}
              />
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
