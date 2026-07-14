import React, { useState, useEffect } from 'react';
import { 
  getStoredData, 
  saveStoredData, 
  INITIAL_USERS 
} from './data';
import { 
  User, 
  UserRole, 
  Module, 
  Exam, 
  Submission, 
  SubmissionAnswer 
} from './types';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ExamTakingView from './components/ExamTakingView';
import ExamResultsView from './components/ExamResultsView';
import ExamCreationView from './components/ExamCreationView';
import SubmissionsView from './components/SubmissionsView';
import CalendarView from './components/CalenderView';

import { 
  AlertCircle, 
  CheckCircle2, 
  X, 
  BookOpen, 
  FilePen, 
  GraduationCap, 
  ClipboardCheck, 
  Users 
} from 'lucide-react';

export default function App() {
  // Load data from localStorage or initial mock state
  const [appState, setAppState] = useState(() => getStoredData());

  // Navigation states
  const [role, setRole] = useState<UserRole>('student');
  const [studentTab, setStudentTab] = useState('dashboard');
  const [teacherTab, setTeacherTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active view overrides (e.g., Exam Fullscreens)
  const [takingExam, setTakingExam] = useState<Exam | null>(null);
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);

  // Elegant Notification Toast
  const [toast, setToast] = useState<{
    show: boolean,
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,
  }>({ show: false, type: 'success', title: '', message: '' });

  // Sync users with role change
  useEffect(() => {
    const matchedUser = appState.users.find(u => u.role === role) || appState.users[0];
    setAppState(prev => ({ ...prev, currentUser: matchedUser }));
    saveStoredData({ currentUser: matchedUser });
  }, [role]);

  // Save changes to local storage whenever exams, submissions, or modules update
  const updateExams = (newExams: Exam[]) => {
    setAppState(prev => {
      const updated = { ...prev, exams: newExams };
      saveStoredData({ exams: newExams });
      return updated;
    });
  };

  const updateSubmissions = (newSubmissions: Submission[]) => {
    setAppState(prev => {
      const updated = { ...prev, submissions: newSubmissions };
      saveStoredData({ submissions: newSubmissions });
      return updated;
    });
  };

  // Helper to trigger toast notifications
  const triggerToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ show: true, type, title, message });
  };

  // Automatically fade out toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Switch role between Student and Teacher
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setSidebarOpen(false);
    setReviewingSubmissionId(null);
    setTakingExam(null);
    triggerToast('info', 'Portal Switched', `Switched to ${newRole === 'teacher' ? 'Teacher Console' : 'Student Dashboard'}.`);
  };

  // Start taking an exam
  const handleStartExam = (exam: Exam) => {
    setTakingExam(exam);
  };

  // Submit completed student exam
  const handleExamSubmit = (answers: SubmissionAnswer[]) => {
    if (!takingExam) return;

    // Automatic preliminary grading for MC and TF questions
    let pointsAwarded = 0;
    const gradedAnswers = answers.map(ans => {
      const question = takingExam.questions.find(q => q.id === ans.questionId);
      if (!question) return ans;

      let isCorrect = false;
      let scoreEarned = 0;

      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        isCorrect = ans.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        scoreEarned = isCorrect ? question.points : 0;
      } else if (question.type === 'short-answer') {
        // Simple case-insensitive keyword match
        isCorrect = ans.answer.toLowerCase().trim().includes(question.correctAnswer.toLowerCase().trim());
        scoreEarned = isCorrect ? question.points : 0;
      }

      pointsAwarded += scoreEarned;

      return {
        ...ans,
        isCorrect,
        scoreEarned
      };
    });

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      examId: takingExam.id,
      studentId: appState.currentUser.id,
      submittedAt: new Date().toISOString(),
      score: pointsAwarded,
      graded: false, // Mark false so the teacher can grade and give feedback in their dashboard!
      answers: gradedAnswers,
    };

    const updatedSubmissions = [...appState.submissions, newSubmission];
    updateSubmissions(updatedSubmissions);
    
    setTakingExam(null);
    setStudentTab('dashboard');
    triggerToast(
      'success', 
      'Exam Submitted!', 
      `Your exam for ${takingExam.title} was submitted successfully. Waiting for teacher feedback.`
    );
  };

  // Publish new exam from Teacher View
  const handlePublishExam = (newExam: Exam) => {
    const updatedExams = [newExam, ...appState.exams];
    updateExams(updatedExams);
    setTeacherTab('dashboard');
    triggerToast(
      'success', 
      'Exam Published', 
      `Successfully created and deployed "${newExam.title}" to enrolled students.`
    );
  };

  // Post scores & feedback from Teacher View
  const handleGradeSubmit = (submissionId: string, gradedAnswers: SubmissionAnswer[], score: number, feedback: string) => {
    const updatedSubmissions = appState.submissions.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          answers: gradedAnswers,
          score,
          feedback,
          graded: true
        };
      }
      return sub;
    });

    updateSubmissions(updatedSubmissions);
    setTeacherTab('submissions');
    triggerToast('success', 'Grades Released', 'The student assessment has been graded and results published.');
  };

  // Helper selectors
  const getModuleForExam = (examId: string) => {
    const exam = appState.exams.find(e => e.id === examId);
    return appState.modules.find(m => m.id === exam?.moduleId) || appState.modules[0];
  };

  const getModuleInfo = (moduleId: string) => {
    return appState.modules.find(m => m.id === moduleId) || appState.modules[0];
  };

  // Dynamic Content Router
  const renderMainContent = () => {
    if (role === 'student') {
      if (reviewingSubmissionId) {
        const sub = appState.submissions.find(s => s.id === reviewingSubmissionId);
        if (sub) {
          const exam = appState.exams.find(e => e.id === sub.examId);
          const mod = appState.modules.find(m => m.id === exam?.moduleId);
          if (exam && mod) {
            return (
              <ExamResultsView 
                submission={sub}
                exam={exam}
                module={mod}
                onBack={() => setReviewingSubmissionId(null)}
              />
            );
          }
        }
      }

      switch (studentTab) {
        case 'dashboard':
          return (
            <StudentDashboard 
              modules={appState.modules}
              exams={appState.exams}
              submissions={appState.submissions}
              onTakeExam={handleStartExam}
              onViewResults={(sub) => setReviewingSubmissionId(sub.id)}
              setSelectedTab={setStudentTab}
            />
          );

        case 'modules':
          return (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-slate-800">My Enrolled Modules</h1>
                <p className="text-xs text-slate-400 font-semibold">List of course modules you are registered for this term.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="student-modules-full-grid">
                {appState.modules.map(mod => {
                  const moduleExams = appState.exams.filter(e => e.moduleId === mod.id);
                  const completedExams = moduleExams.filter(e => appState.submissions.some(s => s.examId === e.id)).length;
                  const progress = moduleExams.length > 0 ? Math.round((completedExams / moduleExams.length) * 100) : 0;

                  return (
                    <div key={mod.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-slate-50 border border-slate-150 rounded text-xs font-bold text-slate-600">{mod.code}</span>
                        <span className="text-3xs text-slate-400 font-semibold flex items-center">
                          <Users size={12} className="mr-1" />
                          {mod.studentCount} students
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-800">{mod.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Instructor: {mod.teacherName}</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{mod.description}</p>

                      <div className="space-y-1.5 pt-3 border-t border-slate-50">
                        <div className="flex justify-between text-3xs font-semibold text-slate-500">
                          <span>Exam Completions</span>
                          <span>{completedExams} / {moduleExams.length} ({progress}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case 'exams':
          return (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-slate-800">Available Exams</h1>
                <p className="text-xs text-slate-400 font-semibold">Active assessments that you can start taking immediately.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="student-exams-full-grid">
                {appState.exams.filter(e => e.status === 'active' && !appState.submissions.some(sub => sub.examId === e.id)).map(exam => {
                  const mod = getModuleInfo(exam.moduleId);
                  return (
                    <div key={exam.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all duration-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-amber-50 border border-amber-100 rounded text-xs font-bold text-amber-700">Active Now</span>
                          <span className="text-3xs font-bold text-slate-400 uppercase">{mod.code}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-850">{exam.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Duration: {exam.durationMinutes} minutes • Weight: {exam.totalPoints} points</p>
                        </div>
                        <p className="text-xs text-slate-550 leading-relaxed">{exam.description}</p>
                      </div>

                      <button
                        onClick={() => handleStartExam(exam)}
                        className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1"
                      >
                        <span>Take Exam</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case 'results':
          return (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-slate-800">Exam Results & Feedback</h1>
                <p className="text-xs text-slate-400 font-semibold">Review your scores, detailed responses, and individual teacher commentaries.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="student-results-full-grid">
                {appState.submissions.map(sub => {
                  const exam = appState.exams.find(e => e.id === sub.examId);
                  const mod = getModuleForExam(sub.examId);
                  if (!exam) return null;

                  return (
                    <div key={sub.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`px-2.5 py-0.5 rounded-full text-3xs font-bold border ${sub.graded ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                            {sub.graded ? 'Graded' : 'Awaiting Grade'}
                          </span>
                          <span className="text-3xs font-bold text-slate-400 uppercase">{mod.code}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-800">{exam.title}</h3>
                          <p className="text-xs text-slate-450 mt-0.5">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="text-left">
                          <p className="text-4xs font-bold text-slate-400 uppercase">SCORE EARNED</p>
                          <p className="text-base font-black text-slate-800">
                            {sub.graded ? `${sub.score} / ${exam.totalPoints}` : '-- / ' + exam.totalPoints}
                          </p>
                        </div>

                        {sub.graded ? (
                          <button
                            onClick={() => setReviewingSubmissionId(sub.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                          >
                            Review Details
                          </button>
                        ) : (
                          <span className="text-3xs text-slate-400 font-semibold italic">Grading in progress</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        case 'calendar':
          return (
            <CalendarView 
              role="student" 
              modules={appState.modules}
              exams={appState.exams}
              submissions={appState.submissions}
              onTakeExam={handleStartExam}
              onViewResults={(sub) => setReviewingSubmissionId(sub.id)}
              setTab={setStudentTab}
            />
          );

        default:
          return null;

        
      }
    } else {
      // Teacher Views
      switch (teacherTab) {
        case 'dashboard':
          return (
            <TeacherDashboard 
              modules={appState.modules}
              exams={appState.exams}
              submissions={appState.submissions}
              onCreateExamClick={() => setTeacherTab('create-exam')}
              onGradeClick={() => setTeacherTab('submissions')}
            />
          );

        case 'modules':
          return (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-slate-800">Course Administration</h1>
                <p className="text-xs text-slate-400 font-semibold">Deploy syllabus changes, view enrollments, and check class lists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="teacher-modules-full-grid">
                {appState.modules.map(mod => {
                  const moduleExams = appState.exams.filter(e => e.moduleId === mod.id);
                  return (
                    <div key={mod.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded text-xs font-bold text-indigo-700">{mod.code}</span>
                        <span className="text-3xs font-semibold text-slate-400 flex items-center">
                          <Users size={12} className="mr-1 text-slate-300" />
                          {mod.studentCount} Students
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-850">{mod.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Instructor: {mod.teacherName}</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>

                      <div className="pt-3 border-t border-slate-50 flex justify-between text-3xs font-semibold text-slate-500">
                        <span>Created Exams:</span>
                        <span className="font-bold text-slate-850">{moduleExams.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case 'create-exam':
          return (
            <ExamCreationView 
              modules={appState.modules}
              onPublish={handlePublishExam}
              onCancel={() => setTeacherTab('dashboard')}
            />
          );

        case 'submissions':
          return (
            <SubmissionsView 
              submissions={appState.submissions}
              exams={appState.exams}
              modules={appState.modules}
              onGradeSubmit={handleGradeSubmit}
            />
          );
        case 'calendar':
          return (
            <CalendarView 
              role="teacher"
              modules={appState.modules}
              exams={appState.exams}
              submissions={appState.submissions}
              onTakeExam={handleStartExam}
              onViewResults={(sub) => setReviewingSubmissionId(sub.id)}
              setTab={setTeacherTab}
            />
          );

        default:
          return null;
      }
    }
  };

  // If Student is actively taking an exam, show Fullscreen securely
  if (takingExam) {
    const activeModule = getModuleInfo(takingExam.moduleId);
    return (
      <ExamTakingView 
        exam={takingExam}
        module={activeModule}
        onSubmit={handleExamSubmit}
        onCancel={() => setTakingExam(null)}
      />
    );
  }

  const activeTab = role === 'student' ? studentTab : teacherTab;
  const setTab = role === 'student' ? setStudentTab : setTeacherTab;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-700 antialiased pt-16 lg:pl-64" id="app-viewport">
      {/* Dynamic Global Header */}
      <Header 
        currentUser={appState.currentUser}
        onRoleChange={handleRoleChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Responsive Global Sidebar */}
      <Sidebar 
        role={role}
        currentTab={activeTab}
        setTab={setTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-55 max-w-sm bg-white border border-slate-150 p-4 rounded-2xl shadow-xl flex items-start space-x-3 animate-slide-up" id="toast-notification">
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
            {toast.type === 'info' && <AlertCircle size={18} className="text-indigo-500" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-rose-500" />}
          </div>
          <div className="flex-1 text-left space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800 leading-none">{toast.title}</h4>
            <p className="text-3xs text-slate-500 leading-relaxed mt-1">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="px-4 py-8 md:px-6 lg:px-8 max-w-5xl mx-auto">
        {renderMainContent()}
      </main>
    </div>
  );
}
