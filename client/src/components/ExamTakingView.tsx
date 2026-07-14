import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, ArrowLeft, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { Exam, Module, SubmissionAnswer } from '../types';

interface ExamTakingViewProps {
  exam: Exam;
  module: Module;
  onSubmit: (answers: SubmissionAnswer[]) => void;
  onCancel: () => void;
}

export default function ExamTakingView({ exam, module, onSubmit, onCancel }: ExamTakingViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const handleAutoSubmit = () => {
    // Convert answers to SubmissionAnswer format
    const answersArray: SubmissionAnswer[] = exam.questions.map(q => ({
      questionId: q.id,
      answer: selectedAnswers[q.id] || '',
    }));
    onSubmit(answersArray);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  // Question progress calculation
  const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k] !== '').length;
  const progressPercent = Math.round((answeredCount / exam.questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col fixed inset-0 z-50 overflow-y-auto font-sans p-4 md:p-6" id="exam-taking-fullscreen">
      {/* Immersive Header */}
      <header className="max-w-4xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4 py-4 px-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/15 text-amber-400 p-2 rounded-xl border border-amber-500/20">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-3xs font-bold text-amber-400 tracking-wider uppercase">SECURE EXAM CONSOLE</span>
            <h1 className="text-sm font-extrabold tracking-tight mt-0.5 text-white">{exam.title}</h1>
            <p className="text-3xs text-slate-400 font-medium">{module.code} • {module.name}</p>
          </div>
        </div>

        {/* Floating Timer & Progress */}
        <div className="flex items-center space-x-4">
          {/* Progress Circle or Indicator */}
          <div className="text-right">
            <p className="text-3xs text-slate-400 font-semibold uppercase leading-none">PROGRESS</p>
            <p className="text-xs font-bold text-slate-200 mt-1">{answeredCount} of {exam.questions.length} Answered</p>
          </div>

          {/* Timer Card */}
          <div className={`
            flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold shadow-lg
            ${timeLeftSeconds < 120 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/35 animate-pulse' 
              : 'bg-slate-800 text-emerald-400 border-slate-700'
            }
          `}>
            <Clock size={16} />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </header>

      {/* Main Examination Content */}
      <main className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center py-8 md:py-12">
        <div className="bg-slate-800 border border-slate-750 rounded-3xl shadow-xl p-6 md:p-8 space-y-6 md:space-y-8 relative">
          
          {/* Question Meta Row */}
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-bold">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {currentQuestion.points} Points
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-bold text-white leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Answers Form Controls */}
          <div className="space-y-3.5">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-3" id="mc-options">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === idx.toString();
                  return (
                    <button
                      key={idx}
                      id={`option-${idx}`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, idx.toString())}
                      className={`
                        w-full text-left px-5 py-4 rounded-xl border text-sm font-medium flex items-center justify-between transition-all duration-150
                        ${isSelected 
                          ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-inner' 
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                          ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 text-slate-400 bg-slate-800'}
                        `}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && (
                        <div className="w-4.5 h-4.5 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Check size={11} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4" id="tf-options">
                {['true', 'false'].map((val) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === val;
                  return (
                    <button
                      key={val}
                      id={`option-${val}`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, val)}
                      className={`
                        py-5 rounded-xl border text-base font-bold capitalize transition-all duration-150 flex flex-col items-center justify-center space-y-2
                        ${isSelected 
                          ? val === 'true' 
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : 'bg-rose-500/15 border-rose-500 text-rose-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                        }
                      `}
                    >
                      <span className="text-sm font-bold tracking-wide uppercase">{val}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <div className="space-y-2" id="sa-input">
                <textarea
                  rows={3}
                  id="short-answer-textarea"
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <p className="text-3xs text-slate-500 font-semibold italic">Note: Text answer is case-insensitive for automatic grading keywords.</p>
              </div>
            )}
          </div>

          {/* Navigation & Progress Slider */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-750">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`
                px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all
                ${currentQuestionIndex === 0 
                  ? 'text-slate-600 cursor-not-allowed bg-transparent' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-850'
                }
              `}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            {/* Pagination Indicators */}
            <div className="hidden sm:flex items-center space-x-1.5">
              {exam.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-150
                    ${idx === currentQuestionIndex 
                      ? 'bg-indigo-500 scale-125' 
                      : selectedAnswers[exam.questions[idx].id] 
                        ? 'bg-emerald-500/80' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }
                  `}
                />
              ))}
            </div>

            {isLastQuestion ? (
              <button
                id="submit-exam-button"
                onClick={() => setShowSubmitConfirm(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-950/20 transition-all duration-150"
              >
                <span>Submit Exam</span>
                <Check size={14} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-950/20 transition-all duration-150"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-55">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 w-fit rounded-2xl border border-emerald-500/20 mx-auto">
              <Check size={26} className="stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-white">Submit Your Exam?</h3>
              <p className="text-xs text-slate-400">
                You have answered <strong>{answeredCount} of {exam.questions.length} questions</strong>. Once submitted, you cannot modify your responses.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button
                id="modal-cancel-button"
                onClick={() => setShowSubmitConfirm(false)}
                className="py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                Go Back
              </button>
              <button
                id="modal-submit-button"
                onClick={handleAutoSubmit}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow shadow-emerald-950/20 transition-all"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
