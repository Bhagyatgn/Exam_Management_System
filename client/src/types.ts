export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Module {
  id: string;
  code: string;
  name: string;
  teacherName: string;
  description: string;
  color: string; // Tailwind class, e.g., 'blue', 'purple', 'emerald', 'amber'
  studentCount?: number;
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Index for MC, 'true'/'false' for TF, or correct keyword for short answer
  points: number;
}

export interface Exam {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  scheduledDate: string; // ISO string or simple date
  questions: Question[];
  totalPoints: number;
  status: 'upcoming' | 'active' | 'completed'; // From student perspective
}

export interface SubmissionAnswer {
  questionId: string;
  answer: string; // Chosen option index, 'true'/'false', or text
  isCorrect?: boolean;
  scoreEarned?: number;
}

export interface Submission {
  id: string;
  examId: string;
  studentId: string;
  answers: SubmissionAnswer[];
  submittedAt: string;
  score?: number; // Graded score
  graded: boolean;
  feedback?: string;
}
