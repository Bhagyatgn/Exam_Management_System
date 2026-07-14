import React from 'react';
import { 
  BookOpenCheck, 
  ClipboardCheck, 
  PlusCircle, 
  Users, 
  Award, 
  Calendar, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Module, Exam, Submission } from '../types';

interface TeacherDashboardProps {
  modules: Module[];
  exams: Exam[];
  submissions: Submission[];
  onCreateExamClick: () => void;
  onGradeClick: () => void;
}

export default function TeacherDashboard({
  modules,
  exams,
  submissions,
  onCreateExamClick,
  onGradeClick
}: TeacherDashboardProps) {

  // Statistics
  const activeExamsCount = exams.filter(e => e.status === 'active').length;
  const pendingGradingCount = submissions.filter(s => !s.graded).length;
  const totalStudents = modules.reduce((sum, m) => sum + (m.studentCount || 0), 0);

  const gradedSubmissions = submissions.filter(s => s.graded);
  const averageGradePercent = gradedSubmissions.length > 0
    ? Math.round(
        gradedSubmissions.reduce((sum, s) => {
          const exam = exams.find(e => e.id === s.examId);
          if (exam) {
            return sum + ((s.score || 0) / exam.totalPoints) * 100;
          }
          return sum + 100;
        }, 0) / gradedSubmissions.length
      )
    : 0;

  // Helper to determine module color
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'indigo': return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', accent: 'bg-indigo-600' };
      case 'rose': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', accent: 'bg-rose-600' };
      case 'emerald': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-600' };
      case 'amber': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: 'bg-amber-600' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', accent: 'bg-slate-600' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="teacher-dashboard">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-700 to-violet-800 rounded-3xl text-white shadow-xl shadow-indigo-950/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative z-10 space-y-1.5">
          <p className="text-indigo-200 text-xs font-bold tracking-widest uppercase">TEACHER CONSOLE</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome, Dr. Jenkins!</h1>
          <p className="text-indigo-50/80 text-sm">
            Manage your courses, build complex custom exams, and grade submissions in real-time.
          </p>
              </div>
              
                  <div className="relative z-10 flex items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start md:self-auto space-x-2">
          <button 
            onClick={onCreateExamClick}
            id="quick-create-exam-btn"
            className="flex items-center space-x-1.5 px-4 py-2 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <PlusCircle size={14} />
            <span>Create New Exam</span>
          </button>
              </div>
          
      
          
        
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="teacher-stats-grid">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpenCheck size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide font-sans">Active Courses</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{modules.length}</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl relative">
            {pendingGradingCount > 0 && (
              <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
            <ClipboardCheck size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Needs Grading</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{pendingGradingCount}</h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide font-sans">Enrolled Students</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{totalStudents}</h3>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Class Average</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
              {gradedSubmissions.length > 0 ? `${averageGradePercent}%` : 'N/A'}
            </h3>
          </div>
        </div>
      </div>

      {/* Modules and Exams Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Managed Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-extrabold text-slate-800">My Managed Modules</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="managed-modules-grid">
            {modules.map((mod) => {
              const colors = getColorClasses(mod.color);
              const courseExams = exams.filter(e => e.moduleId === mod.id);

              return (
                <div key={mod.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${colors.accent}`} />

                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {mod.code}
                    </span>
                    <span className="text-3xs text-slate-400 font-bold flex items-center">
                      <Users size={11} className="mr-1 text-slate-300" />
                      {mod.studentCount || 0} Students
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800">{mod.name}</h3>
                  <p className="text-2xs text-slate-400 leading-relaxed mt-1 line-clamp-2">{mod.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-3xs font-semibold text-slate-500">
                    <span>Active Assessments:</span>
                    <span className="font-bold text-slate-700">{courseExams.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Actionable Alerts */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-800">Pending Actions</h2>

          <div className="space-y-3">
            {pendingGradingCount > 0 ? (
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl space-y-3">
                <div className="flex space-x-2.5">
                  <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                    <ClipboardCheck size={14} />
                  </div>
                  <div>
                    <h4 className="text-2xs font-bold text-amber-800 uppercase tracking-wide">Ungraded Submissions</h4>
                    <p className="text-xs text-amber-700/90 leading-relaxed mt-0.5">
                      You have <strong>{pendingGradingCount} students</strong> waiting for scores and evaluation feedback.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onGradeClick}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-3xs rounded-lg shadow-sm transition-colors"
                >
                  Go to Grading Console
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start space-x-2.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle size={14} />
                </div>
                <div>
                  <h4 className="text-2xs font-bold text-emerald-800 uppercase tracking-wide">All Caught Up!</h4>
                  <p className="text-xs text-emerald-700/90 leading-relaxed mt-0.5">
                    There are no submissions waiting for grading. Outstanding work keeping up with assessments!
                  </p>
                </div>
              </div>
            )}

            {/* Quick Create Guide */}
            <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl space-y-3">
              <h4 className="text-2xs font-bold text-slate-700 uppercase tracking-wide">Deploying Tests</h4>
              <p className="text-3xs text-slate-500 leading-relaxed">
                Need to deliver a quick test or a major assessment? Use our custom Exam Creator to specify points, time, and diverse question types.
              </p>
              <button 
                onClick={onCreateExamClick}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-3xs rounded-lg transition-colors shadow-sm"
              >
                Launch Exam Creator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
