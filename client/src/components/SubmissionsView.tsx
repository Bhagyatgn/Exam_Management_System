import React, { useState } from 'react';
import { ClipboardCheck, Check, AlertCircle, ArrowLeft, Award, HelpCircle, MessageSquare } from 'lucide-react';
import { Submission, Exam, Module, SubmissionAnswer } from '../types';

interface SubmissionsViewProps {
  submissions: Submission[];
  exams: Exam[];
  modules: Module[];
  onGradeSubmit: (submissionId: string, gradedAnswers: SubmissionAnswer[], score: number, feedback: string) => void;
}

export default function SubmissionsView({ submissions, exams, modules, onGradeSubmit }: SubmissionsViewProps) {
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  
  // Grading session details
  const [draftScores, setDraftScores] = useState<Record<string, number>>({});
  const [draftFeedback, setDraftFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Find associated objects
  const getExam = (examId: string) => exams.find(e => e.id === examId);
  const getModuleForExam = (examId: string) => {
    const exam = getExam(examId);
    return modules.find(m => m?.id === exam?.moduleId);
  };

  const handleStartGrading = (sub: Submission) => {
    const exam = getExam(sub.examId);
    if (!exam) return;

    // Prefill scores
    const initialScores: Record<string, number> = {};
    sub.answers.forEach(ans => {
      const q = exam.questions.find(quest => quest.id === ans.questionId);
      if (q) {
        if (q.type === 'multiple-choice' || q.type === 'true-false') {
          // Automatic evaluation
          const isCorrect = ans.answer.toLowerCase() === q.correctAnswer.toLowerCase();
          initialScores[ans.questionId] = isCorrect ? q.points : 0;
        } else {
          // Short answer auto keyword evaluation, can be adjusted
          const containsKeyword = ans.answer.toLowerCase().includes(q.correctAnswer.toLowerCase());
          initialScores[ans.questionId] = containsKeyword ? q.points : 0;
        }
      }
    });

    setGradingSubmission(sub);
    setDraftScores(initialScores);
    setDraftFeedback(sub.feedback || '');
    setErrorMsg('');
  };

  const handleScoreChange = (qId: string, maxPoints: number, val: string) => {
    const numeric = Math.max(0, Math.min(maxPoints, parseInt(val) || 0));
    setDraftScores(prev => ({
      ...prev,
      [qId]: numeric
    }));
  };

  const handleSaveGrade = () => {
    if (!gradingSubmission) return;
    const exam = getExam(gradingSubmission.examId);
    if (!exam) return;

    // Validate that all questions have scored values
    const gradedAnswers: SubmissionAnswer[] = gradingSubmission.answers.map(ans => {
      const score = draftScores[ans.questionId] ?? 0;
      const q = exam.questions.find(quest => quest.id === ans.questionId);
      const isCorrect = q ? score >= q.points / 2 : false; // Reasonable standard
      
      return {
        questionId: ans.questionId,
        answer: ans.answer,
        isCorrect,
        scoreEarned: score
      };
    });

    const totalScore = Object.keys(draftScores).reduce((sum, key) => sum + (draftScores[key] || 0), 0);

    onGradeSubmit(
      gradingSubmission.id,
      gradedAnswers,
      totalScore,
      draftFeedback.trim()
    );

    setGradingSubmission(null);
  };

  if (gradingSubmission) {
    const exam = getExam(gradingSubmission.examId);
    const mod = getModuleForExam(gradingSubmission.examId);

    if (!exam || !mod) return null;

    const totalDraftScore = Object.keys(draftScores).reduce((sum, key) => sum + (draftScores[key] || 0), 0);

    return (
      <div className="space-y-6 animate-fade-in" id="grading-panel">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setGradingSubmission(null)}
            className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 border border-slate-200/80 rounded-xl shadow-sm transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Cancel Grading</span>
          </button>
          <div className="text-right">
            <span className="text-4xs font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 border border-indigo-100 rounded-md">Draft Grade: {totalDraftScore} / {exam.totalPoints} Pts</span>
          </div>
        </div>

        {/* Paper Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-3xs font-bold">{mod.code} • {mod.name}</span>
            <h2 className="text-base font-extrabold text-slate-800 mt-1.5">{exam.title}</h2>
            <p className="text-3xs text-slate-400 mt-0.5">Submitted by Student: John Doe • {new Date(gradingSubmission.submittedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Question Scoring Form List */}
        <div className="space-y-4" id="grading-questions-list">
          {exam.questions.map((q, idx) => {
            const studentAns = gradingSubmission.answers.find(a => a.questionId === q.id);
            const userResponse = studentAns?.answer || 'No response';
            const draftScore = draftScores[q.id] ?? 0;

            return (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-4xs font-bold text-slate-400 uppercase">QUESTION {idx + 1} ({q.type.replace('-', ' ')})</span>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug mt-0.5">{q.text}</h4>
                  </div>

                  {/* Manual input adjustments */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <input 
                      type="number"
                      min={0}
                      max={q.points}
                      value={draftScore}
                      id={`grade-score-input-${q.id}`}
                      onChange={(e) => handleScoreChange(q.id, q.points, e.target.value)}
                      className="w-14 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <span className="text-2xs font-bold text-slate-400">/ {q.points} Pts</span>
                  </div>
                </div>

                {/* Response summary comparisons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-4xs font-bold text-slate-400 uppercase">STUDENT ANSWER</span>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {q.type === 'multiple-choice' && q.options 
                        ? `${String.fromCharCode(65 + parseInt(userResponse))}. ${q.options[parseInt(userResponse)]}`
                        : userResponse
                      }
                    </p>
                  </div>

                  <div className="p-3 bg-indigo-50/15 border border-indigo-100/50 rounded-xl">
                    <span className="text-4xs font-bold text-indigo-500 uppercase">CORRECT KEY/REFERENCE</span>
                    <p className="text-xs font-bold text-indigo-700 mt-1">
                      {q.type === 'multiple-choice' && q.options 
                        ? `${String.fromCharCode(65 + parseInt(q.correctAnswer))}. ${q.options[parseInt(q.correctAnswer)]}`
                        : q.correctAnswer
                      }
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Feedback section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center">
              <MessageSquare size={16} className="text-indigo-600 mr-2" />
              General Teacher Feedback
            </h3>
            <textarea 
              rows={3}
              value={draftFeedback}
              id="grading-feedback-textarea"
              onChange={(e) => setDraftFeedback(e.target.value)}
              placeholder="e.g. Splendid calculations! Well done with derivation steps. Pay closer attention to linear factors."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            onClick={handleSaveGrade}
            id="save-grade-btn"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/10 transition-colors"
          >
            <Check size={14} />
            <span>Release Grade & Post Feedback</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in" id="submissions-list-view">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-extrabold text-slate-800">Student Submissions</h2>
        <span className="text-3xs font-semibold text-slate-400">{submissions.length} Total Submissions</span>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
        {submissions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400">
            <ClipboardCheck size={36} className="mb-2" />
            <p className="text-xs font-bold text-slate-700">No submissions found</p>
            <p className="text-3xs text-slate-400 mt-0.5">When students submit assessments, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-3xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Assessment</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4">Score / Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-650" id="submissions-table-body">
                {submissions.map((sub) => {
                  const exam = getExam(sub.examId);
                  const mod = getModuleForExam(sub.examId);
                  if (!exam || !mod) return null;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">John Doe</td>
                      <td className="px-6 py-4 font-semibold text-slate-750">{exam.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-3xs font-bold">{mod.code}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {sub.graded ? (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-3xs font-bold">
                            Graded: {sub.score} / {exam.totalPoints}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-3xs font-bold animate-pulse">
                            Needs Grading
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleStartGrading(sub)}
                          id={`grade-sub-${sub.id}`}
                          className={`
                            px-3 py-1.5 rounded-lg text-3xs font-bold shadow-sm transition-all duration-150
                            ${sub.graded 
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/50' 
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }
                          `}
                        >
                          {sub.graded ? 'Review Grades' : 'Grade Paper'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
