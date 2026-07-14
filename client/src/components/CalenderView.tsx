import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Award, 
  PlayCircle, 
  CheckCircle2, 
  Calendar, 
  PlusCircle, 
  BookOpen, 
  ArrowRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Module, Exam, Submission, UserRole } from '../types';

interface CalendarViewProps {
  role: UserRole;
  modules: Module[];
  exams: Exam[];
  submissions: Submission[];
  onTakeExam: (exam: Exam) => void;
  onViewResults: (submission: Submission) => void;
  setTab: (tab: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({
  role,
  modules,
  exams,
  submissions,
  onTakeExam,
  onViewResults,
  setTab
}: CalendarViewProps) {
  // Mock current date defaults to July 14, 2026 as per application timeline
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 6 is July (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(14);

  // Helper to find module info
  const getModuleInfo = (moduleId: string) => {
    return modules.find(m => m.id === moduleId) || {
      name: 'Unknown Module',
      code: 'UNK',
      color: 'slate',
      teacherName: 'Unknown Instructor'
    };
  };

  // Submissions map
  const submissionMap = new Map<string, Submission>();
  submissions.forEach(sub => {
    submissionMap.set(sub.examId, sub);
  });

  // Color classes mapping helper
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo': return { 
        bg: 'bg-indigo-50 hover:bg-indigo-100/70', 
        text: 'text-indigo-700', 
        border: 'border-indigo-100', 
        accent: 'bg-indigo-600', 
        badgeBg: 'bg-indigo-100' 
      };
      case 'rose': return { 
        bg: 'bg-rose-50 hover:bg-rose-100/70', 
        text: 'text-rose-700', 
        border: 'border-rose-100', 
        accent: 'bg-rose-600', 
        badgeBg: 'bg-rose-100' 
      };
      case 'emerald': return { 
        bg: 'bg-emerald-50 hover:bg-emerald-100/70', 
        text: 'text-emerald-700', 
        border: 'border-emerald-100', 
        accent: 'bg-emerald-600', 
        badgeBg: 'bg-emerald-100' 
      };
      case 'amber': return { 
        bg: 'bg-amber-50 hover:bg-amber-100/70', 
        text: 'text-amber-700', 
        border: 'border-amber-100', 
        accent: 'bg-amber-600', 
        badgeBg: 'bg-amber-100' 
      };
      default: return { 
        bg: 'bg-slate-50 hover:bg-slate-100/70', 
        text: 'text-slate-700', 
        border: 'border-slate-100', 
        accent: 'bg-slate-600', 
        badgeBg: 'bg-slate-100' 
      };
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Prev month padding days
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const prevPadding = Array.from({ length: firstDayIndex }, (_, i) => ({
    dayNum: prevMonthDays - firstDayIndex + i + 1,
    isCurrentMonth: false,
    monthOffset: -1
  }));

  // Current month days
  const currentMonthDaysList = Array.from({ length: daysInMonth }, (_, i) => ({
    dayNum: i + 1,
    isCurrentMonth: true,
    monthOffset: 0
  }));

  // Next month padding days
  const totalSlots = 42; // 6 rows * 7 days
  const nextPaddingCount = totalSlots - (prevPadding.length + currentMonthDaysList.length);
  const nextPadding = Array.from({ length: nextPaddingCount }, (_, i) => ({
    dayNum: i + 1,
    isCurrentMonth: false,
    monthOffset: 1
  }));

  const allDays = [...prevPadding, ...currentMonthDaysList, ...nextPadding];

  // Get exams for a specific day
  const getExamsForDay = (dayNum: number, monthOffset: number = 0) => {
    let targetMonth = currentMonth + monthOffset;
    let targetYear = currentYear;
    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }

    return exams.filter(exam => {
      const examDate = new Date(exam.scheduledDate);
      return (
        examDate.getFullYear() === targetYear &&
        examDate.getMonth() === targetMonth &&
        examDate.getDate() === dayNum
      );
    });
  };

  const selectedExams = selectedDay ? getExamsForDay(selectedDay) : [];

  return (
    <div className="space-y-6 animate-fade-in" id="academic-calendar-view">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 flex items-center space-x-2">
            <Calendar size={22} className="text-indigo-600 stroke-[2.2]" />
            <span>Academic Assessment Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Visualize exam schedules, view details, and manage upcoming tests.
          </p>
        </div>
        {role === 'teacher' && (
          <button 
            onClick={() => setTab('create-exam')}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-colors self-start sm:self-auto"
          >
            <PlusCircle size={14} />
            <span>Schedule Exam</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Calendar Month Grid */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-850">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              {currentMonth === 6 && currentYear === 2026 && (
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-4xs font-bold">
                  Current Academic Month
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={handlePrevMonth}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors" relative-id="prev-month-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => {
                  setCurrentMonth(6);
                  setCurrentYear(2026);
                  setSelectedDay(14);
                }}
                className="px-3 py-1 text-slate-600 hover:text-slate-900 text-3xs font-bold border border-slate-100 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors" relative-id="next-month-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day} className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5" id="calendar-days-grid">
            {allDays.map((dayObj, idx) => {
              const { dayNum, isCurrentMonth, monthOffset } = dayObj;
              const isSelected = isCurrentMonth && selectedDay === dayNum;
              const dayExams = getExamsForDay(dayNum, monthOffset);
              const isToday = isCurrentMonth && currentMonth === 6 && currentYear === 2026 && dayNum === 14;

              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (isCurrentMonth) {
                      setSelectedDay(dayNum);
                    }
                  }}
                  className={`
                    min-h-24 p-2 bg-white rounded-2xl border transition-all duration-150 flex flex-col justify-between cursor-pointer select-none relative group
                    ${isCurrentMonth 
                      ? isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/10 z-10'
                        : isToday 
                          ? 'border-emerald-200 bg-emerald-50/10'
                          : 'border-slate-50 hover:border-slate-200'
                      : 'border-transparent bg-slate-50/30 text-slate-350 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`
                      text-xs font-bold leading-none flex items-center justify-center w-6 h-6 rounded-full
                      ${isCurrentMonth 
                        ? isSelected
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                          : isToday
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                            : 'text-slate-700 group-hover:bg-slate-100'
                        : 'text-slate-350'
                      }
                    `}>
                      {dayNum}
                    </span>
                    {dayExams.length > 0 && isCurrentMonth && (
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    )}
                  </div>

                  {/* Compact Exam Badges */}
                  <div className="mt-1.5 space-y-1 overflow-hidden">
                    {isCurrentMonth && dayExams.slice(0, 2).map((exam) => {
                      const mod = getModuleInfo(exam.moduleId);
                      const colors = getColorClasses(mod.color);
                      return (
                        <div 
                          key={exam.id}
                          className={`
                            px-1.5 py-0.5 rounded text-4xs font-bold truncate border flex items-center space-x-1
                            ${colors.bg} ${colors.text} ${colors.border}
                          `}
                          title={`${mod.code}: ${exam.title}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${colors.accent}`} />
                          <span className="truncate">{mod.code}</span>
                        </div>
                      );
                    })}
                    {isCurrentMonth && dayExams.length > 2 && (
                      <div className="text-4xs font-bold text-slate-400 pl-1">
                        +{dayExams.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day details pane */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-100/50 p-4.5 rounded-2xl border border-slate-200/50 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Calendar size={18} className="text-slate-500" />
              <div>
                <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider">SELECTED DATE</p>
                <p className="text-xs font-black text-slate-700">
                  {selectedDay ? `${MONTH_NAMES[currentMonth]} ${selectedDay}, ${currentYear}` : 'Choose a date...'}
                </p>
              </div>
            </div>
            {selectedDay === 14 && currentMonth === 6 && currentYear === 2026 && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-4xs font-extrabold">
                TODAY
              </span>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800">
              Scheduled Assessments ({selectedExams.length})
            </h3>

            {selectedExams.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center py-10 space-y-3">
                <AlertCircle size={28} className="text-slate-300" />
                <div>
                  <p className="text-xs font-bold text-slate-700">No exams scheduled</p>
                  <p className="text-3xs text-slate-400 max-w-xs mt-1">
                    There are no exams or assignments configured for this date.
                  </p>
                </div>
                {role === 'teacher' && selectedDay && (
                  <button
                    onClick={() => setTab('create-exam')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-3xs font-bold transition-colors"
                  >
                    <PlusCircle size={11} />
                    <span>Create one now</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4" id="calendar-day-exams-list">
                {selectedExams.map((exam) => {
                  const mod = getModuleInfo(exam.moduleId);
                  const colors = getColorClasses(mod.color);
                  const submission = submissionMap.get(exam.id);

                  // Student state mapping
                  let state: 'takeable' | 'upcoming' | 'graded' | 'submitted' = 'upcoming';
                  if (submission) {
                    state = submission.graded ? 'graded' : 'submitted';
                  } else if (exam.status === 'active') {
                    state = 'takeable';
                  }

                  return (
                    <div 
                      key={exam.id}
                      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all duration-200 relative overflow-hidden"
                    >
                      {/* Left accent bar */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${colors.accent}`} />

                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded text-4xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {mod.code}
                          </span>
                          <p className="text-3xs font-semibold text-slate-400 mt-1">{mod.name}</p>
                        </div>

                        {/* Badging based on context */}
                        {role === 'student' ? (
                          <>
                            {state === 'takeable' && (
                              <span className="flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-4xs font-extrabold animate-pulse">
                                <span className="w-1 h-1 bg-amber-500 rounded-full" />
                                <span>Active Now</span>
                              </span>
                            )}
                            {state === 'upcoming' && (
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-4xs font-bold">
                                Upcoming
                              </span>
                            )}
                            {state === 'graded' && (
                              <span className="flex items-center space-x-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-4xs font-bold">
                                <CheckCircle2 size={9} className="text-emerald-500" />
                                <span>Graded: {Math.round(((submission?.score || 0) / exam.totalPoints) * 100)}%</span>
                              </span>
                            )}
                            {state === 'submitted' && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-4xs font-bold">
                                Submitted
                              </span>
                            )}
                          </>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-4xs font-bold border ${
                            exam.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                              : exam.status === 'upcoming'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-150'
                                : 'bg-slate-50 text-slate-500 border-slate-150'
                          }`}>
                            Status: {exam.status}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-slate-850 leading-snug">
                          {exam.title}
                        </h4>
                        <p className="text-3xs text-slate-450 leading-relaxed line-clamp-3">
                          {exam.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5 text-4xs font-semibold text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Clock size={11} className="text-slate-400" />
                            <span>{exam.durationMinutes} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award size={11} className="text-slate-400" />
                            <span>{exam.totalPoints} pts</span>
                          </div>
                        </div>

                        {/* Action buttons based on Role and state */}
                        {role === 'student' && state === 'takeable' && (
                          <button
                            onClick={() => onTakeExam(exam)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-3xs font-bold shadow-sm transition-colors"
                          >
                            <PlayCircle size={10} />
                            <span>Take Exam</span>
                          </button>
                        )}

                        {role === 'student' && state === 'graded' && submission && (
                          <button
                            onClick={() => onViewResults(submission)}
                            className="flex items-center space-x-0.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-3xs font-bold transition-colors"
                          >
                            <span>Review</span>
                            <ArrowRight size={10} />
                          </button>
                        )}

                        {role === 'student' && state === 'submitted' && (
                          <span className="text-4xs font-bold text-slate-400 italic">Awaiting evaluation</span>
                        )}

                        {role === 'student' && state === 'upcoming' && (
                          <span className="text-4xs font-bold text-slate-400">Scheduled {new Date(exam.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        )}

                        {role === 'teacher' && (
                          <button
                            onClick={() => setTab('submissions')}
                            className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-lg text-3xs font-bold transition-colors"
                          >
                            <span>Submissions</span>
                            <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
