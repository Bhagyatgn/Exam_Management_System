import React from 'react';
import { ArrowLeft, Award, CheckCircle2, XCircle, AlertCircle, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Exam, Module, Submission } from '../types';

interface ExamResultsViewProps {
  submission: Submission;
  exam: Exam;
  module: Module;
  onBack: () => void;
}

export default function ExamResultsView({ submission, exam, module, onBack }: ExamResultsViewProps) {
  const scorePercentage = Math.round((submission.score || 0) / exam.totalPoints * 100);

  // Helper to determine score color
  const getScoreColorClass = (percent: number) => {
    if (percent >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (percent >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const scoreColor = getScoreColorClass(scorePercentage);

  return (
    <div className="space-y-6 animate-fade-in" id="exam-results-view">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="back-to-dashboard-btn"
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 border border-slate-200/80 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-3xs font-semibold text-slate-400">SUBMISSION ID: {submission.id}</span>
      </div>

      {/* Main Results Card */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 relative overflow-hidden">
        {/* Banner element */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${scorePercentage >= 80 ? 'bg-emerald-500' : scorePercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Column: Grade Ring / Visual */}
          <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100 space-y-3">
            <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${scorePercentage >= 80 ? 'border-emerald-500 bg-emerald-50/20' : scorePercentage >= 50 ? 'border-amber-500 bg-amber-50/20' : 'border-rose-500 bg-rose-50/20'}`}>
              <span className="text-2xl font-black text-slate-800">{submission.score}</span>
              <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">OUT OF {exam.totalPoints}</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700">Overall Grade</h4>
              <p className={`text-sm font-black mt-0.5 ${scorePercentage >= 80 ? 'text-emerald-600' : scorePercentage >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                {scorePercentage}% ({scorePercentage >= 90 ? 'A' : scorePercentage >= 80 ? 'B' : scorePercentage >= 70 ? 'C' : scorePercentage >= 50 ? 'D' : 'F'})
              </p>
            </div>
          </div>

          {/* Middle Column: Metadata */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded text-3xs font-bold text-slate-500">
                {module.code} • {module.name}
              </span>
              <h2 className="text-lg font-extrabold text-slate-800">{exam.title}</h2>
              <p className="text-3xs text-slate-400 font-semibold uppercase tracking-wider">Instructed by {module.teacherName}</p>
            </div>

            {/* Submission Time Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2.5 text-slate-600">
                <Calendar size={15} className="text-slate-400" />
                <div className="text-left">
                  <p className="text-4xs font-bold text-slate-400 uppercase">SUBMITTED ON</p>
                  <p className="text-2xs font-bold text-slate-700">
                    {new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 text-slate-600">
                <Clock size={15} className="text-slate-400" />
                <div className="text-left">
                  <p className="text-4xs font-bold text-slate-400 uppercase">TIME SUBMITTED</p>
                  <p className="text-2xs font-bold text-slate-700">
                    {new Date(submission.submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Feedback Section */}
            {submission.feedback && (
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start space-x-3">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                  <MessageSquare size={13} />
                </div>
                <div>
                  <h4 className="text-2xs font-bold text-indigo-800 uppercase tracking-wide">Instructor Feedback</h4>
                  <p className="text-xs text-indigo-750 mt-1 italic font-medium">
                    "{submission.feedback}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Section Heading */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800">Question-by-Question Breakdown</h3>

        {/* List of graded questions */}
        <div className="space-y-4.5" id="graded-questions-list">
          {exam.questions.map((q, idx) => {
            const answerDetail = submission.answers.find(ans => ans.questionId === q.id);
            const isCorrect = answerDetail?.isCorrect;
            const pointsEarned = answerDetail?.scoreEarned ?? 0;

            // Determine textual representation of answers
            let renderedUserAnswer = answerDetail?.answer || 'No answer submitted';
            let renderedCorrectAnswer = q.correctAnswer;

            if (q.type === 'multiple-choice' && q.options) {
              const uIdx = parseInt(answerDetail?.answer || '-1');
              renderedUserAnswer = uIdx >= 0 ? `${String.fromCharCode(65 + uIdx)}. ${q.options[uIdx]}` : 'No option chosen';
              const cIdx = parseInt(q.correctAnswer);
              renderedCorrectAnswer = `${String.fromCharCode(65 + cIdx)}. ${q.options[cIdx]}`;
            } else if (q.type === 'true-false') {
              renderedUserAnswer = renderedUserAnswer === 'true' ? 'True' : renderedUserAnswer === 'false' ? 'False' : 'No answer';
              renderedCorrectAnswer = renderedCorrectAnswer === 'true' ? 'True' : 'False';
            }

            return (
              <div 
                key={q.id}
                className={`
                  bg-white p-5 rounded-2xl border transition-all duration-150 relative overflow-hidden
                  ${isCorrect 
                    ? 'border-emerald-100/80 shadow-sm shadow-emerald-50/20' 
                    : 'border-rose-100/80 shadow-sm shadow-rose-50/20'
                  }
                `}
              >
                {/* Score badge top right */}
                <div className="absolute top-5 right-5 flex items-center space-x-1">
                  <span className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                    {pointsEarned} / {q.points} Pts
                  </span>
                </div>

                {/* Question title */}
                <div className="flex items-start space-x-3 pr-20">
                  <div className={`p-1 rounded-lg shrink-0 mt-0.5 ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  </div>
                  <div>
                    <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">QUESTION {idx + 1} ({q.type.replace('-', ' ')})</span>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug mt-0.5">{q.text}</h4>
                  </div>
                </div>

                {/* Answers Comparison Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4.5 border-t border-slate-50">
                  {/* Student Answer */}
                  <div className={`p-3.5 rounded-xl border ${isCorrect ? 'bg-emerald-50/20 border-emerald-50' : 'bg-rose-50/20 border-rose-50'}`}>
                    <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest">YOUR ANSWER</span>
                    <p className={`text-xs font-bold mt-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {renderedUserAnswer}
                    </p>
                  </div>

                  {/* Correct Answer (Only show if student made a mistake, as reference) */}
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest">CORRECT ANSWER</span>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {renderedCorrectAnswer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
