import React from 'react';
import { MOCK_CERTIFICATES, MOCK_ASSESSMENTS } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Award, Shield, FileText } from 'lucide-react';

export const AssessmentCertManagementView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-400" />
          <span>Certifications & Assessment Audit Management</span>
        </h2>
        <p className="text-xs text-slate-400">Institutional records of certified officers and pending qualification approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Issued Institutional Certificates</span>
          </h3>

          <div className="space-y-2">
            {MOCK_CERTIFICATES.map((cert) => (
              <div key={cert.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">{cert.recipientName}</h4>
                  <span className="text-[10px] text-cyan-400 block">{cert.courseTitle}</span>
                </div>
                <Badge variant="cyan">{cert.certificateCode}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-400" />
            <span>Assessment Audits</span>
          </h3>

          <div className="space-y-2">
            {MOCK_ASSESSMENTS.map((asm) => (
              <div key={asm.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">{asm.title}</h4>
                  <span className="text-[10px] text-slate-400 block">Pass Threshold: {asm.passingScore}%</span>
                </div>
                <Badge variant="purple">{asm.difficulty}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
