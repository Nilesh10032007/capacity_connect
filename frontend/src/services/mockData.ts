import type {
  User,
  Competency,
  Course,
  Assessment,
  Certificate,
  ResourceItem,
  SkillGapItem,
  FeedbackItem,
  Announcement,
  HeatmapCell,
  TrainerMatchResult,
  NotificationItem
} from '../types';

export const MOCK_USERS: Record<string, User> = {
  trainee: {
    id: 'usr_tr_101',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@imd.gov.in',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Severe Weather & Radar Division',
    designation: 'Scientific Officer - Grade II',
    qualification: 'Ph.D. in Atmospheric Sciences',
    experienceYears: 4,
    skills: ['Radar Meteorology', 'Python', 'Doppler Data', 'GIS', 'Weather Forecasting'],
    interests: ['AI in Nowcasting', 'Extreme Weather Events', 'Tropical Cyclones'],
    certifications: ['Advanced Doppler Weather Radar Ops', 'GIS Spatial Hydrology Level 1'],
    bio: 'Dedicated meteorologist specializing in convective storm dynamics and Doppler Weather Radar signal processing.',
    completionPercentage: 82,
    readinessScore: 78
  },
  trainer: {
    id: 'usr_tn_201',
    name: 'Prof. V. K. Murthy',
    email: 'vk.murthy@moes.gov.in',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    department: 'Numerical Modeling Centre',
    designation: 'Chief Scientist & Senior Professor',
    qualification: 'Ph.D. in Geophysical Fluid Dynamics',
    experienceYears: 18,
    skills: ['Numerical Weather Prediction', 'Data Assimilation', 'Supercomputing', 'Fortran 90/Python'],
    interests: ['Global Climate Modeling', 'Monsoon Predictability', 'AI/ML Integration'],
    certifications: ['WMO Senior Master Trainer', 'Global Assimilation Fellow'],
    bio: 'Leading researcher in high-resolution mesoscale weather modeling with over 20 years of operational forecasting experience.',
    completionPercentage: 96,
    readinessScore: 95
  },
  admin: {
    id: 'usr_ad_301',
    name: 'Dr. S. R. Raghunath',
    email: 'admin.capacity@moes.gov.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Capacity Building & Human Resource Directorate',
    designation: 'Director General of Training',
    qualification: 'Ph.D. in Meteorology & Public Policy',
    experienceYears: 24,
    skills: ['Capacity Strategy', 'Institutional Governance', 'Competency Frameworks', 'Resource Planning'],
    interests: ['National Disaster Resilience', 'International WMO Collaborations'],
    certifications: ['Certified Executive Administrator', 'WMO Capacity Specialist'],
    bio: 'Overseeing capacity development across national meteorological services and regional research laboratories.',
    completionPercentage: 100,
    readinessScore: 98
  }
};

export const MOCK_COMPETENCIES: Competency[] = [
  {
    id: 'comp_1',
    name: 'Radar Meteorology & Doppler Interpretation',
    category: 'Remote Sensing',
    currentLevel: 2,
    requiredLevel: 4,
    gap: 2,
    description: 'Ability to interpret dual-polarization radar reflectivity, radial velocity, spectral width, and severe thunderstorm signatures.',
    lastAssessedDate: '2026-08-15',
    trend: 'improving'
  },
  {
    id: 'comp_2',
    name: 'Numerical Weather Prediction (NWP) Modeling',
    category: 'Numerical Modeling',
    currentLevel: 3,
    requiredLevel: 4,
    gap: 1,
    description: 'Understanding of WRF model configuration, boundary conditions, parameterization schemes, and ensemble forecasting.',
    lastAssessedDate: '2026-08-10',
    trend: 'stable'
  },
  {
    id: 'comp_3',
    name: 'Satellite Data Assimilation (INSAT-3DR/3DS)',
    category: 'Remote Sensing',
    currentLevel: 2,
    requiredLevel: 5,
    gap: 3,
    description: 'Processing multispectral imagery, sounder atmospheric profiles, and assimilating radiance into operational models.',
    lastAssessedDate: '2026-07-28',
    trend: 'needs_attention'
  },
  {
    id: 'comp_4',
    name: 'Climate Data Analysis & Monsoon Dynamics',
    category: 'Atmospheric Physics',
    currentLevel: 4,
    requiredLevel: 4,
    gap: 0,
    description: 'Analyzing long-term climate reanalysis datasets (ERA5), teleconnections (ENSO, IOD), and seasonal rainfall forecasts.',
    lastAssessedDate: '2026-08-20',
    trend: 'stable'
  },
  {
    id: 'comp_5',
    name: 'AI/ML in Extreme Weather Forecasting',
    category: 'Data Science & AI',
    currentLevel: 2,
    requiredLevel: 4,
    gap: 2,
    description: 'Application of deep learning models (ConvLSTM, Graph Neural Networks) for precipitative nowcasting and cyclone track prediction.',
    lastAssessedDate: '2026-08-05',
    trend: 'improving'
  },
  {
    id: 'comp_6',
    name: 'GIS & Spatial Hydrology for Severe Weather',
    category: 'Data Science & AI',
    currentLevel: 3,
    requiredLevel: 3,
    gap: 0,
    description: 'Spatial analysis of catchment rainfall, flash flood warnings, and vulnerability mapping using QGIS & ArcGIS Pro.',
    lastAssessedDate: '2026-08-12',
    trend: 'stable'
  },
  {
    id: 'comp_7',
    name: 'Oceanographic & Atmospheric Instrumentation',
    category: 'Instrumentation',
    currentLevel: 1,
    requiredLevel: 3,
    gap: 2,
    description: 'Maintenance, calibration, and troubleshooting of automatic weather stations (AWS), radiosondes, and ocean buoys.',
    lastAssessedDate: '2026-06-30',
    trend: 'needs_attention'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_101',
    code: 'MET-401',
    title: 'Advanced Doppler Weather Radar & Storm Nowcasting',
    subject: 'Radar Meteorology',
    description: 'Comprehensive operational training on dual-polarization radar operations, microburst detection, hail velocity signatures, and 0-3 hour nowcasting algorithms.',
    difficulty: 'Advanced',
    duration: '6 Weeks (36 hrs)',
    trainerId: 'usr_tn_201',
    trainerName: 'Prof. V. K. Murthy',
    trainerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    competenciesCovered: ['Radar Meteorology & Doppler Interpretation', 'AI/ML in Extreme Weather Forecasting'],
    prerequisites: ['Basic Meteorology', 'Vector Physics'],
    thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 142,
    completionRate: 88,
    rating: 4.9,
    reviewCount: 38,
    status: 'published',
    progress: 75,
    resourcesCount: 14,
    modules: [
      { id: 'm1', title: 'Module 1: Principles of Electromagnetic Waves & Radar Equation', duration: '4 hrs', contentType: 'video', isCompleted: true },
      { id: 'm2', title: 'Module 2: Dual-Polarization Parameters (ZDR, KDP, RhoHV)', duration: '6 hrs', contentType: 'video', isCompleted: true },
      { id: 'm3', title: 'Module 3: Doppler Radial Velocity De-aliasing & Wind Profiling', duration: '8 hrs', contentType: 'lab', isCompleted: true },
      { id: 'm4', title: 'Module 4: Mesocyclone & Tornado Vortex Signatures (TVS)', duration: '6 hrs', contentType: 'video', isCompleted: false },
      { id: 'm5', title: 'Module 5: Operational Severe Weather Nowcasting Practicum', duration: '12 hrs', contentType: 'interactive', isCompleted: false }
    ]
  },
  {
    id: 'crs_102',
    code: 'NWP-502',
    title: 'Operational Numerical Weather Prediction & WRF Modeling',
    subject: 'Numerical Modeling',
    description: 'Master regional mesoscale atmospheric modeling using WRF-ARW. Learn mesh setup, physics parameterization selection, data assimilation techniques, and ensemble post-processing.',
    difficulty: 'Expert',
    duration: '8 Weeks (50 hrs)',
    trainerId: 'usr_tn_201',
    trainerName: 'Prof. V. K. Murthy',
    trainerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    competenciesCovered: ['Numerical Weather Prediction (NWP) Modeling', 'Satellite Data Assimilation (INSAT-3DR/3DS)'],
    prerequisites: ['Thermodynamics', 'Linux Shell Scripting'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 98,
    completionRate: 79,
    rating: 4.8,
    reviewCount: 29,
    status: 'published',
    progress: 40,
    resourcesCount: 22,
    modules: [
      { id: 'm1', title: 'Module 1: Governing Hydrodynamic Equations of Atmosphere', duration: '6 hrs', contentType: 'video', isCompleted: true },
      { id: 'm2', title: 'Module 2: WRF Preprocessing System (WPS) & Domain Setup', duration: '8 hrs', contentType: 'lab', isCompleted: true },
      { id: 'm3', title: 'Module 3: Microphysics & Cumulus Parameterization Schemes', duration: '10 hrs', contentType: 'video', isCompleted: false }
    ]
  },
  {
    id: 'crs_103',
    code: 'SAT-305',
    title: 'INSAT-3DR & 3DS Satellite Meteorology Applications',
    subject: 'Remote Sensing',
    description: 'Deep dive into geostationary meteorological satellites, atmospheric soundings, sea surface temperature (SST) estimation, and tropical cyclone intensity estimation using Dvorak technique.',
    difficulty: 'Intermediate',
    duration: '4 Weeks (24 hrs)',
    trainerId: 'usr_tn_202',
    trainerName: 'Dr. Radhika Sen',
    trainerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    competenciesCovered: ['Satellite Data Assimilation (INSAT-3DR/3DS)'],
    prerequisites: ['Basic Remote Sensing'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 210,
    completionRate: 92,
    rating: 4.7,
    reviewCount: 54,
    status: 'published',
    progress: 100,
    resourcesCount: 18
  },
  {
    id: 'crs_104',
    code: 'AIML-601',
    title: 'Deep Learning & Physics-Informed AI for Weather Nowcasting',
    subject: 'Data Science & AI',
    description: 'Explore neural network architectures for Earth system forecasting. Includes Graph Neural Networks (GNNs), FourCastNet, Pangu-Weather concepts, and Python PyTorch implementations.',
    difficulty: 'Expert',
    duration: '6 Weeks (40 hrs)',
    trainerId: 'usr_tn_203',
    trainerName: 'Dr. Rahul Mehta',
    trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    competenciesCovered: ['AI/ML in Extreme Weather Forecasting', 'GIS & Spatial Hydrology for Severe Weather'],
    prerequisites: ['Python Data Science', 'Linear Algebra'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 185,
    completionRate: 84,
    rating: 4.95,
    reviewCount: 46,
    status: 'published',
    progress: 15,
    resourcesCount: 25
  },
  {
    id: 'crs_105',
    code: 'GIS-202',
    title: 'QGIS & Spatial Analytics for Flash Flood & Hazard Warning',
    subject: 'Data Science & AI',
    description: 'Practical training on geospatial integration of rainfall observations, terrain elevation models (DEM), river basin hydrology, and automated flood alert map generation.',
    difficulty: 'Intermediate',
    duration: '4 Weeks (20 hrs)',
    trainerId: 'usr_tn_202',
    trainerName: 'Dr. Radhika Sen',
    trainerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    competenciesCovered: ['GIS & Spatial Hydrology for Severe Weather'],
    prerequisites: ['Cartography Basics'],
    thumbnail: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 165,
    completionRate: 91,
    rating: 4.6,
    reviewCount: 31,
    status: 'published',
    progress: 0,
    resourcesCount: 12
  },
  {
    id: 'crs_106',
    code: 'INS-101',
    title: 'Automatic Weather Station (AWS) Calibration & Sensor Maintenance',
    subject: 'Instrumentation',
    description: 'Hardware protocol, telemetry standards, sensor diagnostics, and field maintenance protocols for automated weather stations across mountain and coastal networks.',
    difficulty: 'Beginner',
    duration: '3 Weeks (18 hrs)',
    trainerId: 'usr_tn_204',
    trainerName: 'Er. Prakash Joshi',
    trainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    competenciesCovered: ['Oceanographic & Atmospheric Instrumentation'],
    prerequisites: ['Electrical Basics'],
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    enrolledCount: 75,
    completionRate: 95,
    rating: 4.75,
    reviewCount: 18,
    status: 'published',
    progress: 0,
    resourcesCount: 9
  }
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm_1',
    title: 'Doppler Radar Refectivity & Velocity Mid-Term Exam',
    courseTitle: 'Advanced Doppler Weather Radar & Storm Nowcasting',
    courseId: 'crs_101',
    durationMinutes: 45,
    totalQuestions: 15,
    passingScore: 75,
    difficulty: 'Hard',
    dueDate: '2026-09-08',
    status: 'upcoming',
    retakeAllowed: true,
    questions: [
      {
        id: 'q1',
        questionText: 'What radar reflectivity signature is most indicative of a severe hail core within a convective thunderstorm cell?',
        options: [
          'High reflectivity (>60 dBZ) accompanied by low differential reflectivity (ZDR ~ 0 to -1 dB)',
          'Low reflectivity (<30 dBZ) with high differential reflectivity (ZDR > 4 dB)',
          'High velocity spectrum width without reflectivity enhancement',
          'Uniform reflectivity factor across all elevation angles'
        ],
        correctOptionIndex: 0,
        explanation: 'Large tumbling hailstones produce very high horizontal reflectivity (ZDR ~ 0 or slightly negative) because they tumble randomly as isotropic targets.'
      },
      {
        id: 'q2',
        questionText: 'In a radial velocity display, a side-by-side couplet of inbound and outbound velocity maxima indicates which atmospheric vortex feature?',
        options: [
          'Uniform stratiform wind shear',
          'Mesocyclone rotation or tornado vortex signature',
          'Widespread atmospheric subsidence',
          'Bright band melting layer'
        ],
        correctOptionIndex: 1,
        explanation: 'Tight adjacent couplets of inbound (towards radar) and outbound (away from radar) velocities represent strong storm-scale rotation.'
      },
      {
        id: 'q3',
        questionText: 'What is the primary operational advantage of Dual-Polarization radar over single-polarization radar?',
        options: [
          'Higher mechanical antenna rotation speed',
          'Ability to discriminate target shape (raindrops vs hail vs biological echoes)',
          'Complete immunity to ground clutter',
          'Lower electrical power consumption'
        ],
        correctOptionIndex: 1,
        explanation: 'Dual-pol transmits pulses in horizontal and vertical orientations, allowing hydrometeor classification based on shape and aspect ratio.'
      }
    ]
  },
  {
    id: 'asm_2',
    title: 'INSAT-3DR Sounder & Satellite Image Interpretation Quiz',
    courseTitle: 'INSAT-3DR & 3DS Satellite Meteorology Applications',
    courseId: 'crs_103',
    durationMinutes: 30,
    totalQuestions: 10,
    passingScore: 80,
    difficulty: 'Medium',
    completedDate: '2026-08-22',
    userScore: 90,
    status: 'completed',
    retakeAllowed: false
  },
  {
    id: 'asm_3',
    title: 'WRF Atmospheric Modeling Environment Configuration Check',
    courseTitle: 'Operational Numerical Weather Prediction & WRF Modeling',
    courseId: 'crs_102',
    durationMinutes: 60,
    totalQuestions: 20,
    passingScore: 70,
    difficulty: 'Hard',
    dueDate: '2026-09-12',
    status: 'available',
    retakeAllowed: true
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_8801',
    certificateCode: 'IMD-CAP-2026-8801',
    courseTitle: 'INSAT-3DR & 3DS Satellite Meteorology Applications',
    courseId: 'crs_103',
    issueDate: '2026-08-23',
    recipientName: 'Dr. Ananya Sharma',
    issuingAuthority: 'India Meteorological Department (IMD) & MoES',
    grade: 'Distinction (90%)',
    verificationUrl: 'https://capacityconnect.moes.gov.in/verify/IMD-CAP-2026-8801'
  },
  {
    id: 'cert_7420',
    certificateCode: 'IMD-CAP-2026-7420',
    courseTitle: 'Fundamentals of Tropical Cyclone Forecasting',
    courseId: 'crs_107',
    issueDate: '2026-05-14',
    recipientName: 'Dr. Ananya Sharma',
    issuingAuthority: 'National Weather Forecasting Centre (NWFC)',
    grade: 'Passed (86%)',
    verificationUrl: 'https://capacityconnect.moes.gov.in/verify/IMD-CAP-2026-7420'
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: 'res_1',
    title: 'IMD Operational Doppler Weather Radar Standard Operating Manual 2026.pdf',
    type: 'pdf',
    fileSize: '14.2 MB',
    uploadedBy: 'Prof. V. K. Murthy',
    uploadDate: '2026-08-25',
    downloadUrl: '#',
    courseId: 'crs_101',
    category: 'Manuals'
  },
  {
    id: 'res_2',
    title: 'Python Doppler Radar Velocity De-aliasing Demo Notebook.ipynb',
    type: 'code',
    fileSize: '4.8 MB',
    uploadedBy: 'Prof. V. K. Murthy',
    uploadDate: '2026-08-28',
    downloadUrl: '#',
    courseId: 'crs_101',
    category: 'Code Scripts'
  },
  {
    id: 'res_3',
    title: 'WRF v4.5 Physics Parameterization Best Practices Guide.pdf',
    type: 'pdf',
    fileSize: '8.6 MB',
    uploadedBy: 'Prof. V. K. Murthy',
    uploadDate: '2026-08-18',
    downloadUrl: '#',
    courseId: 'crs_102',
    category: 'Guides'
  },
  {
    id: 'res_4',
    title: 'INSAT-3DR Sounder Thermal Band Sample Dataset.nc',
    type: 'dataset',
    fileSize: '128.5 MB',
    uploadedBy: 'Dr. Radhika Sen',
    uploadDate: '2026-08-10',
    downloadUrl: '#',
    courseId: 'crs_103',
    category: 'Datasets'
  }
];

export const MOCK_SKILL_GAPS: SkillGapItem[] = [
  {
    id: 'sg_1',
    competencyName: 'Satellite Data Assimilation (INSAT-3DR/3DS)',
    department: 'Severe Weather & Radar Division',
    currentLevel: 2,
    requiredLevel: 5,
    gapScore: 3,
    priority: 'High',
    affectedTraineesCount: 42,
    recommendedCourses: ['INSAT-3DR & 3DS Satellite Meteorology Applications', 'Advanced Doppler Weather Radar & Storm Nowcasting'],
    recommendedResources: ['INSAT-3DR Sounder Thermal Band Sample Dataset.nc']
  },
  {
    id: 'sg_2',
    competencyName: 'AI/ML in Extreme Weather Forecasting',
    department: 'Numerical Modeling Centre',
    currentLevel: 2,
    requiredLevel: 4,
    gapScore: 2,
    priority: 'High',
    affectedTraineesCount: 38,
    recommendedCourses: ['Deep Learning & Physics-Informed AI for Weather Nowcasting'],
    recommendedResources: ['Python Doppler Radar Velocity De-aliasing Demo Notebook.ipynb']
  },
  {
    id: 'sg_3',
    competencyName: 'Oceanographic & Atmospheric Instrumentation',
    department: 'Observational Network Division',
    currentLevel: 1,
    requiredLevel: 3,
    gapScore: 2,
    priority: 'Medium',
    affectedTraineesCount: 29,
    recommendedCourses: ['Automatic Weather Station (AWS) Calibration & Sensor Maintenance'],
    recommendedResources: ['IMD Operational Doppler Weather Radar Standard Operating Manual 2026.pdf']
  }
];

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb_1',
    traineeName: 'Dr. Ananya Sharma',
    traineeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    courseTitle: 'Advanced Doppler Weather Radar & Storm Nowcasting',
    rating: 5,
    date: '2026-08-29',
    comment: 'Exceptional course. The practical case studies on mesocyclone velocity couplets during the 2025 cyclone season were directly applicable to our operational forecasting shifts.',
    sentiment: 'positive'
  },
  {
    id: 'fb_2',
    traineeName: 'Rajesh Verma',
    traineeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseTitle: 'Operational Numerical Weather Prediction & WRF Modeling',
    rating: 4.5,
    date: '2026-08-25',
    comment: 'Very thorough mathematical background on cumulus schemes. Would appreciate extra lab computing hours for HPC cluster compilation.',
    sentiment: 'constructive'
  },
  {
    id: 'fb_3',
    traineeName: 'Priya Nair',
    traineeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    courseTitle: 'INSAT-3DR & 3DS Satellite Meteorology Applications',
    rating: 5,
    date: '2026-08-20',
    comment: 'The Dvorak technique exercises for tropical cyclone intensity estimation were clear and brilliantly demonstrated!',
    sentiment: 'positive'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc_1',
    title: 'MoES National Skill Assessment Drive 2026 Scheduled for Q4',
    content: 'All scientific personnel across IMD, NCMRWF, and INCOIS are requested to complete their core competency self-assessments by September 25, 2026.',
    date: '2026-08-30',
    author: 'Director General of Training',
    priority: 'high',
    targetRoles: ['trainee', 'trainer', 'admin'],
    category: 'Institutional Directive'
  },
  {
    id: 'anc_2',
    title: 'New Compute Node Allocated for WRF Model Practicum Workshops',
    content: 'An additional 256 CPU core nodes on the PRAMYT HPC cluster have been reserved for trainees enrolled in NWP-502.',
    date: '2026-08-27',
    author: 'IT & Supercomputing Division',
    priority: 'medium',
    targetRoles: ['trainee', 'trainer'],
    category: 'Infrastructure'
  }
];

export const MOCK_HEATMAP_DATA: HeatmapCell[] = [
  // Weather Forecasting
  { department: 'Forecasting', competency: 'Radar Meteorology', currentAvg: 3.4, requiredAvg: 4.5, gap: 1.1, traineeCount: 45 },
  { department: 'Forecasting', competency: 'NWP Modeling', currentAvg: 3.2, requiredAvg: 4.0, gap: 0.8, traineeCount: 45 },
  { department: 'Forecasting', competency: 'Satellite Data', currentAvg: 2.8, requiredAvg: 4.5, gap: 1.7, traineeCount: 45 },
  { department: 'Forecasting', competency: 'Climate Analysis', currentAvg: 4.0, requiredAvg: 4.0, gap: 0.0, traineeCount: 45 },
  { department: 'Forecasting', competency: 'AI/ML Forecasting', currentAvg: 2.1, requiredAvg: 4.0, gap: 1.9, traineeCount: 45 },

  // Observation
  { department: 'Observation', competency: 'Radar Meteorology', currentAvg: 4.2, requiredAvg: 4.5, gap: 0.3, traineeCount: 60 },
  { department: 'Observation', competency: 'NWP Modeling', currentAvg: 2.0, requiredAvg: 3.0, gap: 1.0, traineeCount: 60 },
  { department: 'Observation', competency: 'Satellite Data', currentAvg: 3.5, requiredAvg: 4.0, gap: 0.5, traineeCount: 60 },
  { department: 'Observation', competency: 'Climate Analysis', currentAvg: 2.5, requiredAvg: 3.0, gap: 0.5, traineeCount: 60 },
  { department: 'Observation', competency: 'AI/ML Forecasting', currentAvg: 1.8, requiredAvg: 3.5, gap: 1.7, traineeCount: 60 },

  // Climate Division
  { department: 'Climate', competency: 'Radar Meteorology', currentAvg: 2.2, requiredAvg: 3.0, gap: 0.8, traineeCount: 35 },
  { department: 'Climate', competency: 'NWP Modeling', currentAvg: 3.8, requiredAvg: 4.5, gap: 0.7, traineeCount: 35 },
  { department: 'Climate', competency: 'Satellite Data', currentAvg: 3.6, requiredAvg: 4.0, gap: 0.4, traineeCount: 35 },
  { department: 'Climate', competency: 'Climate Analysis', currentAvg: 4.8, requiredAvg: 5.0, gap: 0.2, traineeCount: 35 },
  { department: 'Climate', competency: 'AI/ML Forecasting', currentAvg: 2.9, requiredAvg: 4.0, gap: 1.1, traineeCount: 35 },

  // IT & HPC Division
  { department: 'IT', competency: 'Radar Meteorology', currentAvg: 2.0, requiredAvg: 2.5, gap: 0.5, traineeCount: 25 },
  { department: 'IT', competency: 'NWP Modeling', currentAvg: 4.1, requiredAvg: 4.5, gap: 0.4, traineeCount: 25 },
  { department: 'IT', competency: 'Satellite Data', currentAvg: 3.0, requiredAvg: 3.5, gap: 0.5, traineeCount: 25 },
  { department: 'IT', competency: 'Climate Analysis', currentAvg: 3.0, requiredAvg: 3.5, gap: 0.5, traineeCount: 25 },
  { department: 'IT', competency: 'AI/ML Forecasting', currentAvg: 4.6, requiredAvg: 4.8, gap: 0.2, traineeCount: 25 }
];

export const MOCK_TRAINER_MATCHES: TrainerMatchResult[] = [
  {
    trainerId: 'usr_tn_201',
    trainerName: 'Prof. V. K. Murthy',
    trainerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    matchScore: 96,
    expertise: ['Numerical Weather Prediction', 'Doppler Radar', 'Data Assimilation'],
    rating: 4.9,
    experienceYears: 18,
    coursesTaught: 12,
    availability: 'Available',
    reasons: ['Highest subject matter expertise in NWP/Radar', '4.9/5 historical trainee satisfaction', 'WMO Master Trainer Certification']
  },
  {
    trainerId: 'usr_tn_202',
    trainerName: 'Dr. Radhika Sen',
    trainerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    matchScore: 89,
    expertise: ['Satellite Meteorology', 'INSAT Data Processing', 'GIS'],
    rating: 4.75,
    experienceYears: 12,
    coursesTaught: 8,
    availability: 'Available',
    reasons: ['Extensive practical expertise with INSAT payloads', 'Strong GIS workflow background']
  },
  {
    trainerId: 'usr_tn_203',
    trainerName: 'Dr. Rahul Mehta',
    trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    matchScore: 84,
    expertise: ['AI/ML in Earth Sciences', 'Physics-Informed Neural Networks', 'Python'],
    rating: 4.95,
    experienceYears: 9,
    coursesTaught: 5,
    availability: 'High Load',
    reasons: ['Top tier machine learning publications', 'High rating on Python live labs']
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Assessment Assigned',
    message: 'Doppler Radar Refectivity Mid-Term Exam is now open for completion.',
    timestamp: '10 mins ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'n2',
    title: 'Certificate Awarded',
    message: 'Congratulations! Your certificate for INSAT-3DR Satellite Meteorology is ready for download.',
    timestamp: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 'n3',
    title: 'Course Update',
    message: 'New lab resource added to NWP-502: WRF Domain WPS Script.',
    timestamp: '1 day ago',
    read: true,
    type: 'info'
  }
];
