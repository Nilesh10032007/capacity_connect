import React, { useState } from 'react';
import { MOCK_USERS } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { GraduationCap, Search, Filter, Eye, Award } from 'lucide-react';
import { User } from '../../../types';

export const AdminTraineeManagementView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedTrainee, setSelectedTrainee] = useState<User | null>(null);

  const traineeList = Object.values(MOCK_USERS).filter((u) => u.role === 'trainee');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-400" />
            <span>Trainee Officers Governance Directory</span>
          </h2>
          <p className="text-xs text-slate-400">Search trainees, inspect competency profiles, and track readiness indicators.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trainee name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-4">Officer Name</th>
              <th className="p-4">Department</th>
              <th className="p-4">Designation</th>
              <th className="p-4">Readiness Score</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {traineeList.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <span>{t.name}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{t.email}</span>
                  </div>
                </td>
                <td className="p-4">{t.department}</td>
                <td className="p-4">{t.designation}</td>
                <td className="p-4 font-mono font-bold text-cyan-400">{t.readinessScore}%</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedTrainee(t)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    View Competency Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrainee && (
        <Modal
          isOpen={!!selectedTrainee}
          onClose={() => setSelectedTrainee(null)}
          title={`Competency Audit: ${selectedTrainee.name}`}
          subtitle={selectedTrainee.department}
        >
          <div className="space-y-3 text-xs text-slate-300">
            <p><strong>Qualification:</strong> {selectedTrainee.qualification}</p>
            <p><strong>Experience:</strong> {selectedTrainee.experienceYears} Years</p>
            <p><strong>Readiness Rating:</strong> {selectedTrainee.readinessScore}%</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
