import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Save, AlertCircle, Sparkles, Check, HelpCircle } from 'lucide-react';
import { Module, Exam, Question, QuestionType } from '../types';

interface ExamCreationViewProps {
  modules: Module[];
  onPublish: (exam: Exam) => void;
  onCancel: () => void;
}

export default function ExamCreationView({ modules, onPublish, onCancel }: ExamCreationViewProps) {
  // Exam metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleId, setModuleId] = useState(modules[0]?.id || '');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [scheduledDate, setScheduledDate] = useState('2026-07-15T09:00');

  // Question builder state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<QuestionType>('multiple-choice');
  const [qPoints, setQPoints] = useState(5);
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrectAnswer, setQCorrectAnswer] = useState('0'); // Index, 'true'/'false', or text

  const [errorMsg, setErrorMsg] = useState('');

  const handleAddQuestion = () => {
    if (!qText.trim()) {
      setErrorMsg('Question text cannot be blank.');
      return;
    }

    let correctAnswer = qCorrectAnswer;
    let options: string[] | undefined = undefined;

    if (qType === 'multiple-choice') {
      const validOptions = qOptions.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        setErrorMsg('Multiple choice questions require at least 2 non-empty options.');
        return;
      }
      options = validOptions;
      // Validate correct answer index exists
      const correctIdx = parseInt(qCorrectAnswer);
      if (isNaN(correctIdx) || correctIdx >= validOptions.length) {
        correctAnswer = '0';
      }
    } else if (qType === 'true-false') {
      if (correctAnswer !== 'true' && correctAnswer !== 'false') {
        correctAnswer = 'true';
      }
    } else if (qType === 'short-answer') {
      if (!correctAnswer.trim()) {
        setErrorMsg('Please specify a keyword or answer for the short answer question.');
        return;
      }
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}-${questions.length}`,
      type: qType,
      text: qText.trim(),
      points: qPoints,
      options,
      correctAnswer: correctAnswer.trim().toLowerCase(),
    };

    setQuestions([...questions, newQuestion]);
    
    // Reset question builder state
    setQText('');
    setQPoints(5);
    setQOptions(['', '', '', '']);
    setQCorrectAnswer('0');
    setErrorMsg('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handlePublish = () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a title for the exam.');
      return;
    }
    if (questions.length === 0) {
      setErrorMsg('An exam must contain at least one question.');
      return;
    }

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      moduleId,
      title: title.trim(),
      description: description.trim(),
      durationMinutes,
      scheduledDate: new Date(scheduledDate).toISOString(),
      questions,
      totalPoints,
      status: 'active', // Make active immediately so students can take it
    };

    onPublish(newExam);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="exam-creation-view">
      {/* Header and Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 border border-slate-200/80 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Discard & Back</span>
        </button>
        <span className="text-3xs font-extrabold text-slate-400 uppercase">EXAM BUILDER ENGINE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Exam Details & Question Builder */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Exam Details */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <Sparkles size={16} className="text-indigo-600 mr-2" />
              1. Basic Exam Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Exam Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Unit 3 Quiz: Advanced Algorithmic Complexity"
                  value={title}
                  id="exam-title-input"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description / Syllabus Instructions</label>
                <textarea 
                  rows={2}
                  placeholder="Provide exam scope, references allowed, and rules..."
                  value={description}
                  id="exam-desc-input"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Associate with Module</label>
                <select 
                  value={moduleId}
                  id="exam-module-select"
                  onChange={(e) => setModuleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                >
                  {modules.map(mod => (
                    <option key={mod.id} value={mod.id}>{mod.code} - {mod.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Duration (mins)</label>
                  <input 
                    type="number"
                    min={1}
                    max={180}
                    value={durationMinutes}
                    id="exam-duration-input"
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Release Date</label>
                  <input 
                    type="datetime-local"
                    value={scheduledDate}
                    id="exam-date-input"
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Question Builder Form */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <HelpCircle size={16} className="text-indigo-600 mr-2" />
              2. Add Exam Question
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Question Format</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
                    {(['multiple-choice', 'true-false', 'short-answer'] as QuestionType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setQType(type);
                          // Default reasonable answer resets
                          if (type === 'true-false') setQCorrectAnswer('true');
                          else if (type === 'multiple-choice') setQCorrectAnswer('0');
                          else setQCorrectAnswer('');
                        }}
                        className={`
                          flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-150
                          ${qType === type 
                            ? 'bg-white text-indigo-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-850'
                          }
                        `}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Points Weight</label>
                  <input 
                    type="number"
                    min={1}
                    max={100}
                    value={qPoints}
                    onChange={(e) => setQPoints(parseInt(e.target.value) || 5)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Question Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Question Prompt / Stem</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Which keyword is used to establish inheritance in Java?"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Conditional answers panel */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wide block">Configure Correct Answers & Options</span>
                
                {/* 1. Multiple choice fields */}
                {qType === 'multiple-choice' && (
                  <div className="space-y-2.5">
                    {qOptions.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400 w-5">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <input 
                          type="text"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...qOptions];
                            updated[oIdx] = e.target.value;
                            setQOptions(updated);
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setQCorrectAnswer(oIdx.toString())}
                          className={`
                            px-3 py-1.5 rounded-lg text-3xs font-extrabold border transition-colors
                            ${qCorrectAnswer === oIdx.toString() 
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-150'
                            }
                          `}
                        >
                          {qCorrectAnswer === oIdx.toString() ? 'Correct' : 'Mark Correct'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. True False Selector */}
                {qType === 'true-false' && (
                  <div className="flex space-x-3">
                    {['true', 'false'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setQCorrectAnswer(val)}
                        className={`
                          flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all duration-150
                          ${qCorrectAnswer === val 
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }
                        `}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Short Answer Field */}
                {qType === 'short-answer' && (
                  <div className="space-y-1">
                    <label className="text-3xs font-extrabold text-slate-400 uppercase">Correct Response Word/Phrase</label>
                    <input 
                      type="text"
                      placeholder="e.g. extends"
                      value={qCorrectAnswer}
                      onChange={(e) => setQCorrectAnswer(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-4xs text-slate-400 font-medium italic mt-1">Automatic grading is triggered when student submission contains this keyword (case-insensitive).</p>
                  </div>
                )}
              </div>

              {/* Add button */}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
              >
                <Plus size={14} />
                <span>Add Question to List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Questions Preview & Save Exam */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Publish Assessment</h3>
            <p className="text-3xs text-slate-400 leading-relaxed">
              Upon publication, this exam is deployed and will instantly appear in the Active Exams tab of enrolled students.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-2xs font-bold">
              <div className="flex justify-between text-slate-600">
                <span>Total Questions:</span>
                <span className="text-slate-800">{questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Exam Points:</span>
                <span className="text-slate-850">
                  {questions.reduce((sum, q) => sum + q.points, 0)} pts
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-start space-x-2 text-3xs font-bold">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handlePublish}
              id="publish-exam-btn"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/10 transition-colors"
            >
              <Save size={14} />
              <span>Publish & Deploy Exam</span>
            </button>
          </div>

          {/* Questions preview */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Exam Blueprint ({questions.length})</h3>

            {questions.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400">
                <HelpCircle size={22} className="mb-1.5" />
                <p className="text-2xs font-bold">Blueprint empty</p>
                <p className="text-4xs mt-0.5 max-w-[160px]">Create questions to preview the blueprint.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="absolute top-2.5 right-2.5 p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-150 hover:border-rose-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={11} />
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-4xs font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 uppercase">
                        Q{idx + 1}
                      </span>
                      <span className="text-4xs text-slate-400 font-semibold uppercase">{q.type.replace('-', ' ')}</span>
                      <span className="text-4xs font-semibold text-slate-500">• {q.points} pts</span>
                    </div>

                    <p className="text-3xs font-bold text-slate-750 line-clamp-2 pr-6 leading-relaxed">{q.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
