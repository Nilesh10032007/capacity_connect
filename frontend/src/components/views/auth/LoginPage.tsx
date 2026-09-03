import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types';
import {
  GraduationCap,
  BookOpen,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2,
  BrainCircuit,
  Radar,
  Globe,
  Award,
  Users,
  FolderPlus,
  BarChart3,
  Cpu
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import logoImg from '../../../assets/logo.png';

interface RoleTextContent {
  badge: string;
  headline: string;
  subheadline: string;
  features: { icon: React.ReactNode; label: string }[];
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('trainee');
  const [email, setEmail] = useState('ananya.sharma@imd.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const heroImages: Record<UserRole, string> = {
    trainee: '/trainee_hero.png',
    trainer: '/trainer_hero.png',
    admin: '/admin_hero.png'
  };

  const roleTextContents: Record<UserRole, RoleTextContent> = {
    trainee: {
      badge: 'IMD / MoES • Trainee Capacity Development Portal',
      headline: 'Empowering Earth System Scientists with Competency-Driven Capacity Development',
      subheadline: 'Standardized operational training in Doppler Weather Radar interpretation, Numerical Weather Prediction (WRF), INSAT Satellite Data Assimilation, and AI Extreme Weather Nowcasting.',
      features: [
        { icon: <Radar className="h-4 w-4 text-cyan-400" />, label: 'Doppler Radar Nowcasting' },
        { icon: <Globe className="h-4 w-4 text-blue-400" />, label: 'WRF Weather Modeling' },
        { icon: <BrainCircuit className="h-4 w-4 text-emerald-400" />, label: 'Competency Radar & Skill Gaps' },
        { icon: <Award className="h-4 w-4 text-amber-400" />, label: 'WMO Certified Competencies' }
      ]
    },
    trainer: {
      badge: 'MoES Senior Instructor & Content Authoring Studio',
      headline: 'Author Certified Curricula & Empower Next-Gen Meteorological Officers',
      subheadline: 'Publish interactive lectures, upload NetCDF datasets and Python notebooks, create MCQ assessment banks, and track officer competency growth.',
      features: [
        { icon: <BookOpen className="h-4 w-4 text-emerald-400" />, label: 'Course & Syllabus Authoring' },
        { icon: <FolderPlus className="h-4 w-4 text-cyan-400" />, label: 'NetCDF & Python Asset Library' },
        { icon: <CheckCircle2 className="h-4 w-4 text-amber-400" />, label: 'MCQ Exam & Quiz Builder' },
        { icon: <Users className="h-4 w-4 text-purple-400" />, label: 'Learner Performance & Feedback' }
      ]
    },
    admin: {
      badge: 'Ministry Governance & Executive Capacity Directorate',
      headline: 'Institutional Capacity Governance, AI Trainer Matcher & Analytics',
      subheadline: 'Oversee national scientific workforce competencies, evaluate departmental skill gaps, approve courses, and match senior trainers using AI algorithms.',
      features: [
        { icon: <Cpu className="h-4 w-4 text-cyan-400" />, label: 'AI Best Trainer Matcher' },
        { icon: <BarChart3 className="h-4 w-4 text-purple-400" />, label: 'Org Competency Analytics' },
        { icon: <Shield className="h-4 w-4 text-blue-400" />, label: 'Course Approval Workflow' },
        { icon: <Sparkles className="h-4 w-4 text-amber-400" />, label: 'Executive PDF/CSV Reports' }
      ]
    }
  };

  const currentText = roleTextContents[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'trainee') setEmail('ananya.sharma@imd.gov.in');
    else if (role === 'trainer') setEmail('vk.murthy@moes.gov.in');
    else setEmail('admin.capacity@moes.gov.in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(selectedRole, email, password);
    setIsLoading(false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowForgotModal(false);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-800 overflow-hidden">
      {/* LEFT SIDE: 60% Image Container - Shifted Upwards with Increased Top Padding */}
      <div className="hero-left-panel relative hidden w-full lg:w-[60%] lg:flex flex-col justify-center overflow-hidden p-12 pt-16 text-white bg-slate-950">
        
        {/* Background Image Stack for Smooth Cross-Fade Transition */}
        {(['trainee', 'trainer', 'admin'] as UserRole[]).map((r) => (
          <img
            key={r}
            src={heroImages[r]}
            alt={`${r} role hero background`}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out transform ${
              selectedRole === r ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />
        ))}

        {/* Soft Contrast Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

        {/* Hero Description & Logo - Shifted Up with Enhanced Top Padding */}
        <div
          key={selectedRole}
          className="relative z-10 max-w-xl space-y-4 animate-fadeIn my-auto pt-8"
        >
          {/* Transparent Brand Logo Image */}
          <div>
            <img
              src={logoImg}
              alt="CAPACITY CONNECT"
              className="h-14 md:h-16 w-auto object-contain drop-shadow-2xl mb-3"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-400/40 backdrop-blur-md shadow-lg">
            <Building className="h-3.5 w-3.5 text-cyan-400" />
            <span>{currentText.badge}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight drop-shadow-lg">
            {currentText.headline}
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed font-medium drop-shadow-md">
            {currentText.subheadline}
          </p>

          {/* Scientific Feature Pills */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {currentText.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl bg-slate-900/80 px-3.5 py-3 border border-slate-700/80 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-slate-800 hover:border-cyan-500/40"
              >
                {feat.icon}
                <span className="truncate">{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: 40% Login Form Container */}
      <div className="flex w-full lg:w-[40%] items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header Branding */}
          <div className="lg:hidden text-center space-y-2 mb-6">
            <img src={logoImg} alt="CAPACITY CONNECT" className="mx-auto h-12 w-auto object-contain" />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="mb-3">
              <img src={logoImg} alt="CAPACITY CONNECT" className="h-12 w-auto object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Portal Sign In</h2>
            <p className="text-xs text-slate-500">Select your role to sign into the platform.</p>
          </div>

          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select User Role</label>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1.5 border border-slate-200">
              {[
                { id: 'trainee', label: 'Trainee', icon: <GraduationCap className="h-4 w-4" /> },
                { id: 'trainer', label: 'Trainer', icon: <BookOpen className="h-4 w-4" /> },
                { id: 'admin', label: 'Admin', icon: <Shield className="h-4 w-4" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRoleSelect(item.id as UserRole)}
                  className={`flex flex-col items-center gap-1 rounded-lg py-2.5 px-2 text-xs font-bold transition-all duration-200 ${
                    selectedRole === item.id
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email / Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 transition-all"
                  placeholder="official.email@gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-cyan-600 focus:ring-cyan-600"
                />
                <span className="font-medium">Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-cyan-700 hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/25 hover:bg-cyan-700 transition-all active:scale-[0.99]"
            >
              <span>{isLoading ? 'Authenticating...' : `Log In as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Institutional Password"
        subtitle="Enter your official IMD / MoES email address to receive reset instructions."
      >
        {resetSent ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-900">Reset Link Dispatched</h4>
            <p className="mt-1 text-xs text-slate-600">
              Verification email sent to ({resetEmail || email}). Please check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Official Email</label>
              <input
                type="email"
                required
                value={resetEmail || email}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-cyan-600 focus:outline-none"
                placeholder="official.email@gov.in"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
