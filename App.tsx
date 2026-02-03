import React, { useState, useEffect, useMemo } from 'react';
import { USERS, getDatesForFebruary2026, generateInitialData } from './constants';
import { HabitStatus, FamilyData } from './types';
import ProfileSelection from './components/ProfileSelection';
import HabitTrackerGrid from './components/HabitTrackerGrid';
import OverallProgress from './components/OverallProgress';

const App: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  
  const [appData, setAppData] = useState<FamilyData>(() => {
    try {
      const savedData = localStorage.getItem('habitTrackerDataFeb2026');
      if (savedData) {
        // FIX: The error "Property 'progress' does not exist on type 'unknown'" was caused by JSON.parse returning 'any'. Casting the parsed data to 'FamilyData' ensures type safety throughout the component.
        return JSON.parse(savedData) as FamilyData;
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
    return generateInitialData();
  });

  useEffect(() => {
    try {
      localStorage.setItem('habitTrackerDataFeb2026', JSON.stringify(appData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [appData]);

  const { overallProgress, totalCompleted } = useMemo(() => {
    let completedHabits = 0;
    let totalPossibleHabits = 0;
    const numDays = getDatesForFebruary2026().length;
    
    Object.values(USERS).forEach(user => {
      totalPossibleHabits += user.habits.length * numDays;
    });

    Object.values(appData).forEach(user => {
        Object.values(user.progress).forEach(day => {
            Object.values(day).forEach(status => {
                if (status === HabitStatus.Completed) {
                    completedHabits++;
                }
            });
        });
    });
    
    const percentage = totalPossibleHabits > 0 ? Math.round((completedHabits / totalPossibleHabits) * 100) : 0;
    
    return { overallProgress: percentage, totalCompleted: completedHabits };
  }, [appData]);


  const handleProfileSelect = (name: string) => {
    setSelectedProfile(name);
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
  };

  const handleStatusChange = (userName: string, date: string, habit: string) => {
    setAppData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
      const currentStatus = newData[userName].progress[date][habit];
      const nextStatus = (currentStatus + 1) % 3; // Cycle through 0, 1, 2
      newData[userName].progress[date][habit] = nextStatus as HabitStatus;
      return newData;
    });
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

        <OverallProgress percentage={overallProgress} />
        
        <main className="w-full">
          {!selectedUserData ? (
            <ProfileSelection users={userArray} onSelectProfile={handleProfileSelect} />
          ) : (
            <HabitTrackerGrid
              user={selectedUserData}
              dates={getDatesForFebruary2026()}
              onStatusChange={handleStatusChange}
              onBack={handleBackToProfiles}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
