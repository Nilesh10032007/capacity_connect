import React from 'react';
import { MOCK_FEEDBACK } from '../../../services/mockData';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-amber-400" />
            <span>Trainee Feedback & Course Ratings</span>
          </h2>
          <p className="text-xs text-slate-400">Reviews and qualitative comments submitted by operational officers.</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs">
          <span className="text-slate-400">Average Rating:</span>
          <span className="font-extrabold text-amber-400 text-sm flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400" />
            4.9 / 5.0
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_FEEDBACK.map((fb) => (
          <div key={fb.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={fb.traineeAvatar} alt={fb.traineeName} className="h-9 w-9 rounded-full object-cover border border-slate-800" />
                <div>
                  <h4 className="text-sm font-bold text-white">{fb.traineeName}</h4>
                  <span className="text-[11px] text-slate-400">{fb.courseTitle}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{fb.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic leading-relaxed">"{fb.comment}"</p>
            <div className="text-[10px] text-slate-500 flex justify-between items-center pt-2 border-t border-slate-800/80">
              <span>Submitted on {fb.date}</span>
              <span className="text-emerald-400 font-semibold uppercase">{fb.sentiment} Feedback</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
