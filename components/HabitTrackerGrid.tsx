
import React from 'react';
import { Check, X, ArrowLeft } from 'lucide-react';
import { UserData, HabitStatus } from '../types';

interface HabitTrackerGridProps {
  user: UserData;
  dates: string[];
  onStatusChange: (userName: string, date: string, habit: string) => void;
  onBack: () => void;
}

const StatusIcon: React.FC<{ status: HabitStatus }> = ({ status }) => {
  switch (status) {
    case HabitStatus.Completed:
      return <Check className="text-emerald-400 mx-auto" size={24} />;
    case HabitStatus.Incomplete:
      return <X className="text-rose-400 mx-auto" size={24} />;
    default:
      return <div className="w-4 h-4 rounded-full bg-slate-600 mx-auto opacity-50 transition-opacity group-hover:opacity-100"></div>;
  }
};


const HabitTrackerGrid: React.FC<HabitTrackerGridProps> = ({ user, dates, onStatusChange, onBack }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-slate-700 w-full">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="flex items-center ml-6">
          <img
            src={`https://api.dicebear.com/8.x/${user.avatarStyle}/svg?seed=${user.avatarSeed}`}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover bg-slate-700"
          />
          <h2 className="text-2xl sm:text-3xl font-bold ml-4 text-white">{user.name}'s Habits</h2>
        </div>
      </div>

      <div className="overflow-auto max-h-[60vh]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 bg-slate-800 z-20 px-4 py-3 text-sm font-semibold text-slate-300 border-b-2 border-r border-slate-600">Date</th>
              {user.habits.map(habit => (
                <th key={habit} className="sticky top-0 bg-slate-800 z-10 px-4 py-3 text-sm font-semibold text-slate-300 border-b-2 border-slate-600 whitespace-nowrap">
                  {habit}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map(date => (
              <tr key={date} className="group hover:bg-slate-700/50">
                <td className="sticky left-0 bg-slate-800 group-hover:bg-slate-700 p-2 sm:p-3 text-center font-medium border-r border-b border-slate-600 whitespace-nowrap">
                  Feb {date}
                </td>
                {user.habits.map(habit => (
                  <td
                    key={`${date}-${habit}`}
                    className="text-center p-2 sm:p-3 border-b border-slate-600 cursor-pointer"
                    onClick={() => onStatusChange(user.name, date, habit)}
                  >
                    <StatusIcon status={user.progress[date]?.[habit] ?? HabitStatus.Empty} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTrackerGrid;
