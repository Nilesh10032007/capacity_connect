import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { Megaphone, PlusCircle, Calendar } from 'lucide-react';
import { Modal } from '../../common/Modal';

export const AnnouncementsView: React.FC = () => {
  const { showToast } = useApp();
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnc = {
      id: `anc_${Date.now()}`,
      title: title || 'Q4 Technical Capacity Workshop Dispatched',
      content: content || 'All officers are requested to review updated WRF model documentation.',
      date: '2026-09-01',
      author: 'Director General of Training',
      priority: 'high' as const,
      targetRoles: ['trainee' as const, 'trainer' as const],
      category: 'Directive'
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    setShowModal(false);
    showToast('Broadcasted institutional announcement');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-purple-400" />
            <span>Institutional Broadcasts & Announcements</span>
          </h2>
          <p className="text-xs text-slate-400">Issue national directives, schedule capacity workshops, and notify officers.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((anc) => (
          <div key={anc.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={anc.priority === 'high' ? 'rose' : 'cyan'}>{anc.category}</Badge>
                <span className="text-xs font-bold text-white">{anc.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{anc.date}</span>
            </div>
            <p className="text-xs text-slate-300">{anc.content}</p>
            <span className="text-[10px] text-slate-500 block">Issued by: {anc.author}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Institutional Announcement"
          subtitle="Broadcast to all trainees, trainers, or administrative officers."
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Content Directive</label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-400">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded bg-purple-600 font-bold text-white">
                Broadcast Now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
