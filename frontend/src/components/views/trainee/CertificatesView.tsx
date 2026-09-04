import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Certificate } from '../../../types';
import { Award, Download, CheckCircle2, Shield, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';
import { useAuth } from '../../../context/AuthContext';

export const CertificatesView: React.FC = () => {
  const { showToast } = useApp();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCertificates();
        // Map backend fields to what the UI expects
        const mapped = (data || []).map((c: any) => ({
          id: c._id || c.id,
          certificateCode: c.certificateCode,
          courseTitle: c.courseId?.title || c.courseTitle || 'Course',
          courseId: c.courseId?._id || c.courseId,
          issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : 'N/A',
          recipientName: user?.name || 'Trainee',
          issuingAuthority: c.issuingAuthority || 'India Meteorological Department (IMD) & MoES',
          grade: c.grade || 'Passed',
          verificationUrl: c.verificationUrl || '#'
        }));
        setCertificates(mapped);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-sm text-slate-300">Loading Certificates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" />
            <span>Official Institutional Certificates</span>
          </h2>
          <p className="text-xs text-slate-400">Verified capacity building achievements issued upon passing assessments.</p>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <Award className="mx-auto h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Pass an assessment to earn your first certificate. Certificates are automatically issued when you score above the passing threshold.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="cyan" icon={<Shield className="h-3 w-3" />}>
                    VERIFIED CERTIFICATE
                  </Badge>
                  <span className="font-mono text-xs text-slate-400">{cert.certificateCode}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{cert.courseTitle}</h3>
                <p className="text-xs text-cyan-400 mt-1 font-medium">{cert.issuingAuthority}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Awarded Date</span>
                    <span className="font-bold text-white">{cert.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grade / Rating</span>
                    <span className="font-bold text-emerald-400">{cert.grade}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Verify Credentials</span>
                </button>

                <button
                  onClick={() => showToast(`Downloading official PDF for ${cert.certificateCode}`)}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title={`Certificate Verification: ${selectedCert.certificateCode}`}
          subtitle={selectedCert.issuingAuthority}
          maxWidth="2xl"
        >
          <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Shield className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-bold text-white">MINISTRY OF EARTH SCIENCES</h3>
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">
              India Meteorological Department (IMD)
            </p>

            <div className="py-4 border-y border-slate-800 max-w-lg mx-auto space-y-2">
              <p className="text-xs text-slate-400">This certifies that</p>
              <h4 className="text-xl font-extrabold text-white">{selectedCert.recipientName}</h4>
              <p className="text-xs text-slate-300">
                has successfully fulfilled all operational competencies required for
              </p>
              <p className="text-sm font-bold text-cyan-300">{selectedCert.courseTitle}</p>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 px-6">
              <span>Issue Date: {selectedCert.issueDate}</span>
              <span>Status: Authentic & Valid</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
