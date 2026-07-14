import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  PlayCircle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Module, Exam, Submission } from '../types';

interface StudentDashboardProps {
  modules: Module[];
  exams: Exam[];
  submissions: Submission[];
  onTakeExam: (exam: Exam) => void;
  onViewResults: (submission: Submission) => void;
  setSelectedTab: (tab: string) => void;
}

export default function StudentDashboard({
  modules,
  exams,
  submissions,
  onTakeExam,
  onViewResults,
  setSelectedTab
}: StudentDashboardProps) {
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string | null>(null);

  // Helper to find module info
  const getModuleInfo = (moduleId: string) => {
    return modules.find(m => m.id === moduleId) || {
      name: 'Unknown Module',
      code: 'UNK',
      color: 'slate',
      teacherName: 'Unknown Instructor'
    };
  };

  // Submissions map for fast lookup
  const submissionMap = new Map<string, Submission>();
  submissions.forEach(sub => {
    submissionMap.set(sub.examId, sub);
  });

  // Calculate statistics
  const enrolledCount = modules.length;
  
  // Active exams: status 'active' and not yet submitted
  const activeExams = exams.filter(exam => exam.status === 'active' && !submissionMap.has(exam.id));
  const activeCount = activeExams.length;

  // Upcoming exams: status 'upcoming'
  const upcomingExams = exams.filter(exam => exam.status === 'upcoming');
  const upcomingCount = upcomingExams.length;

  // Graded exams
  const gradedSubmissions = submissions.filter(sub => sub.graded);
  const averageScorePercent = gradedSubmissions.length > 0 
    ? Math.round(
        gradedSubmissions.reduce((sum, sub) => {
          const exam = exams.find(e => e.id === sub.examId);
          if (exam) {
            return sum + ((sub.score || 0) / exam.totalPoints) * 100;
          }
          return sum + 100; // Fallback
        }, 0) / gradedSubmissions.length
      )
    : 0;

  // Filter exams based on selected module
  const filteredExams = exams.filter(exam => {
    if (selectedModuleFilter && exam.moduleId !== selectedModuleFilter) return false;
    return true;
  });

  // Helper to render module color border/tag
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'indigo': return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', accent: 'bg-indigo-600', progress: 'bg-indigo-600' };
      case 'rose': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', accent: 'bg-rose-600', progress: 'bg-rose-600' };
      case 'emerald': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-600', progress: 'bg-emerald-600' };
      case 'amber': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: 'bg-amber-600', progress: 'bg-amber-600' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', accent: 'bg-slate-600', progress: 'bg-slate-600' };
    }
  };

  // Calculate exam completions per module
  const getModuleProgress = (moduleId: string) => {
    const moduleExams = exams.filter(e => e.moduleId === moduleId);
    if (moduleExams.length === 0) return { completed: 0, total: 0, percent: 0 };
    
    const completedInModule = moduleExams.filter(e => submissionMap.has(e.id)).length;
    return {
      completed: completedInModule,
      total: moduleExams.length,
      percent: Math.round((completedInModule / moduleExams.length) * 100)
    };
  };

  return (
    <div className="space-y-8 animate-fade-in" id="student-dashboard">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-700 to-purple-800 rounded-3xl text-white shadow-xl shadow-blue-950/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative z-10 space-y-1.5">
          <p className="text-emerald-200 text-xs font-bold tracking-widest uppercase">ACADEMIC DASHBOARD</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome Back, John!</h1>
          <p className="text-emerald-50/80 text-sm">
            You have <strong className="text-white underline underline-offset-4 decoration-emerald-300">{activeCount} available exams</strong> that need to be taken today. Good luck!
          </p>
        </div>
        <div className="relative z-10 flex items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
          <Calendar size={18} className="text-blue-200 mr-2.5" />
          <div className="text-right">
            <p className="text-2xs text-blue-200 font-semibold uppercase leading-none">TODAY'S DATE</p>
            <p className="text-xs font-bold mt-1">July 14, 2026</p>
          </div>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="student-stats-grid">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide">My Modules</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{enrolledCount}</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl relative">
            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white animate-ping" />
            <Clock size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Active Exams</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{activeCount}</h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Tests</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{upcomingCount}</h3>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Avg Score</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
              {gradedSubmissions.length > 0 ? `${averageScorePercent}%` : 'N/A'}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Enrolled Courses, Right Upcoming/Active Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Courses and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-800">Enrolled Modules</h2>
              {selectedModuleFilter && (
                <button 
                  onClick={() => setSelectedModuleFilter(null)}
                  className="text-2xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="enrolled-modules-grid">
              {modules.map((mod) => {
                const colors = getColorClasses(mod.color);
                const progress = getModuleProgress(mod.id);
                const isSelected = selectedModuleFilter === mod.id;

                return (
                  <div 
                    key={mod.id}
                    onClick={() => setSelectedModuleFilter(isSelected ? null : mod.id)}
                    className={`
                      bg-white p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group
                      ${isSelected 
                        ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-md' 
                        : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'
                      }
                    `}
                  >
                    {/* Color Banner */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${colors.accent}`} />

                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {mod.code}
                      </span>
                      <span className="text-3xs text-slate-400 font-semibold">
                        {progress.completed}/{progress.total} Completed
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {mod.name}
                    </h3>
                    <p className="text-2xs text-slate-400 font-medium mt-0.5">Instructor: {mod.teacherName}</p>

                    {/* Progress Bar */}
                    <div className="mt-4.5 space-y-1.5">
                      <div className="flex justify-between text-3xs font-semibold text-slate-500">
                        <span>Course Exams Done</span>
                        <span>{progress.percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${colors.progress} transition-all duration-500`}
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Analytics Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Learning Analytics</h3>
                <p className="text-3xs text-slate-400 font-semibold">Visual assessment of scores across modules</p>
              </div>
              <div className="flex items-center space-x-1.5 text-2xs font-bold text-emerald-600">
                <TrendingUp size={14} />
                <span>On Track</span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 flex items-end justify-between pt-4 px-2 select-none">
              {modules.map((mod) => {
                const sub = submissions.find(s => {
                  const exam = exams.find(e => e.id === s.examId);
                  return exam && exam.moduleId === mod.id && s.graded;
                });
                const colors = getColorClasses(mod.color);
                
                // If there's a score, show it, else default/mock or 0
                let scorePercent = 0;
                if (sub) {
                  const exam = exams.find(e => e.id === sub.examId);
                  if (exam) {
                    scorePercent = Math.round(((sub.score || 0) / exam.totalPoints) * 100);
                  }
                } else if (mod.id === 'mod-cs101') {
                  scorePercent = 0; // Not done yet
                } else if (mod.id === 'mod-phys105') {
                  scorePercent = 0; // Not done
                } else {
                  scorePercent = 40; // Default lower placeholder for visual purposes if no exam
                }

                return (
                  <div key={mod.id} className="flex flex-col items-center flex-1 space-y-2 group">
                    <div className="relative w-full flex justify-center items-end h-32">
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-800 text-white text-3xs font-bold px-2 py-1 rounded-md shadow pointer-events-none">
                        {scorePercent > 0 ? `${scorePercent}% Grade` : 'No submissions'}
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className={`w-10 rounded-t-lg ${colors.accent} opacity-85 group-hover:opacity-100 transition-all duration-300 shadow-sm`}
                        style={{ height: `${Math.max(scorePercent, 6)}%` }}
                      />
                    </div>
                    <span className="text-3xs font-bold text-slate-700 uppercase tracking-tight">{mod.code}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Upcoming & Available Exams List */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-800">
            {selectedModuleFilter ? 'Filtered Assessments' : 'Upcoming & Active Tests'}
          </h2>

          <div className="space-y-3" id="exams-summary-list">
            {filteredExams.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <AlertCircle size={24} className="text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700">No exams scheduled</p>
                <p className="text-3xs text-slate-400 mt-0.5">There are no assessments matching the current filter.</p>
              </div>
            ) : (
              filteredExams.map((exam) => {
                const modInfo = getModuleInfo(exam.moduleId);
                const colors = getColorClasses(modInfo.color);
                const submission = submissionMap.get(exam.id);
                
                // Identify exam actual view state
                let state: 'takeable' | 'upcoming' | 'graded' | 'submitted' = 'upcoming';
                if (submission) {
                  state = submission.graded ? 'graded' : 'submitted';
                } else if (exam.status === 'active') {
                  state = 'takeable';
                }

                return (
                  <div 
                    key={exam.id}
                    className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm space-y-4.5 hover:shadow-md transition-all duration-200"
                  >
                    {/* Header: Module name and Status Badge */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className={`px-2 py-0.5 rounded text-4xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {modInfo.code}
                        </span>
                        <p className="text-2xs font-semibold text-slate-400 mt-1 line-clamp-1">{modInfo.name}</p>
                      </div>

                      {/* Badges */}
                      {state === 'takeable' && (
                        <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-3xs font-extrabold animate-pulse">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          <span>Active Now</span>
                        </span>
                      )}
                      {state === 'upcoming' && (
                        <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-3xs font-bold">
                          <span>Upcoming</span>
                        </span>
                      )}
                      {state === 'graded' && (
                        <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-3xs font-bold">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                          <span>Graded: {Math.round(((submission?.score || 0) / exam.totalPoints) * 100)}%</span>
                        </span>
                      )}
                      {state === 'submitted' && (
                        <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-3xs font-bold">
                          <span>Submitted</span>
                        </span>
                      )}
                    </div>

                    {/* Main title & Info */}
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-800 line-clamp-1">{exam.title}</h3>
                      <p className="text-3xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{exam.description}</p>
                    </div>

                    {/* Meta info & Action button */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center space-x-3 text-3xs font-semibold text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={11} className="text-slate-400" />
                          <span>{exam.durationMinutes} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award size={11} className="text-slate-400" />
                          <span>{exam.totalPoints} pts</span>
                        </div>
                      </div>

                      {state === 'takeable' && (
                        <button
                          id={`start-exam-${exam.id}`}
                          onClick={() => onTakeExam(exam)}
                          className="flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-3xs font-bold shadow-sm shadow-emerald-600/10 transition-colors"
                        >
                          <PlayCircle size={11} />
                          <span>Start Exam</span>
                        </button>
                      )}

                      {state === 'graded' && submission && (
                        <button
                          id={`review-exam-${exam.id}`}
                          onClick={() => onViewResults(submission)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-3xs font-bold transition-colors"
                        >
                          <span>Review</span>
                          <ArrowRight size={10} />
                        </button>
                      )}

                      {state === 'submitted' && (
                        <span className="text-3xs font-semibold text-slate-400 italic">Awaiting Grade</span>
                      )}

                      {state === 'upcoming' && (
                        <div className="flex items-center space-x-1 text-3xs font-bold text-indigo-500">
                          <Calendar size={11} />
                          <span>Jul 16</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
