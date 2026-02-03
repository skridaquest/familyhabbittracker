import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HabitStatsCardProps {
    completed: number;
    incomplete: number;
    pending: number;
}

const HabitStatsCard: React.FC<HabitStatsCardProps> = ({ completed, incomplete, pending }) => {
    return (
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-4 w-full max-w-2xl mb-6 shadow-xl">
            <div className="grid grid-cols-3 gap-4">
                {/* Completed */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-900/20 border border-emerald-900/30">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                        <span className="text-emerald-200 text-sm font-medium">Done</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-100">{completed}</span>
                </div>

                {/* Incomplete */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-900/20 border border-rose-900/30">
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle className="text-rose-400 w-5 h-5" />
                        <span className="text-rose-200 text-sm font-medium">Missed</span>
                    </div>
                    <span className="text-2xl font-bold text-rose-100">{incomplete}</span>
                </div>

                {/* Pending */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-900/20 border border-amber-900/30">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-amber-400 w-5 h-5" />
                        <span className="text-amber-200 text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-100">{pending}</span>
                </div>
            </div>
        </div>
    );
};

export default HabitStatsCard;
