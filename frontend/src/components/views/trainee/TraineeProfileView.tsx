import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import {
  UserCheck,
  Building,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Edit,
  Sparkles,
  CheckCircle,
  Tag
} from 'lucide-react';
import { traineeService } from '../../../services/api/traineeService';

export const TraineeProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useApp();

  const [competencies, setCompetencies] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');

  useEffect(() => {
    traineeService.getCompetencies().then(setCompetencies).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      bio,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean)
    });
    setIsEditing(false);
    showToast('Institutional profile updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-cyan-500/30 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <Badge variant="cyan" icon={<GraduationCap className="h-3 w-3" />}>
                  {user?.role.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">{user?.designation}</p>
              <p className="text-xs text-slate-400">{user?.department} • {user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <Edit className="h-4 w-4 text-cyan-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Qualifications & Bio */}
        <div className="space-y-4 md:col-span-1">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              <span>Academic & Experience</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Qualification</span>
                <span className="text-slate-200">{user?.qualification}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Years of Service</span>
                <span className="text-slate-200">{user?.experienceYears} Years Operational Experience</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Department</span>
                <span className="text-slate-200">{user?.department}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-bold text-white mb-2">Biography</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{user?.bio}</p>
          </div>
        </div>

        {/* Right 2 Columns: Skills, Interests & Competencies */}
        <div className="space-y-4 md:col-span-2">
          {/* Skills & Interests Tags */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4 text-cyan-400" />
                <span>Technical Skills & Operational Tools</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills.map((skill, i) => (
                  <span key={i} className="rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs text-cyan-300 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Research Interests</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.interests.map((interest, i) => (
                  <span key={i} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-300 font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Competency Snapshot */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Verified Competency Level Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {competencies.slice(0, 4).map((c: any) => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-200 font-semibold mb-1">
                    <span className="truncate max-w-[150px]">{c.name}</span>
                    <span className="text-cyan-400">Level {c.currentLevel}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${(c.currentLevel / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Institutional Profile"
        subtitle="Update bio description and technical skill tags."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Biography</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
