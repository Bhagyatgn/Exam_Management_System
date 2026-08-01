import { Module, Exam, Submission, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  },
  {
    id: 'teacher-1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
  },
];

export const INITIAL_MODULES: Module[] = [];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-cs101-mid',
    moduleId: 'mod-cs101',
    title: 'Midterm Assessment: Data Structures & OOP',
    description: 'This exam covers basic OOP principles, linear data structures (arrays, linked lists, stacks, queues), and asymptotic notation.',
    durationMinutes: 20,
    scheduledDate: '2026-07-14T09:00:00Z',
    totalPoints: 25,
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Which of the following is NOT a core principle of Object-Oriented Programming (OOP)?',
        options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
        correctAnswer: '2', // Compilation is not an OOP principle
        points: 5,
      },
      {
        id: 'q2',
        type: 'true-false',
        text: 'A Queue data structure follows the Last-In, First-Out (LIFO) order of operations.',
        correctAnswer: 'false', // Queue is FIFO, Stack is LIFO
        points: 5,
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        text: 'What is the worst-case time complexity of inserting a node into a singly linked list at the head position?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctAnswer: '0', // O(1)
        points: 5,
      },
      {
        id: 'q4',
        type: 'short-answer',
        text: 'What is the dynamic memory allocation function/operator used in C++ to allocate memory on the heap?',
        correctAnswer: 'new',
        points: 10,
      }
    ]
  },
  {
    id: 'exam-math202-quiz',
    moduleId: 'mod-math202',
    title: 'Quiz 3: Limits & Derivatives',
    description: 'Short quiz testing limits evaluation using L\'Hopital\'s rule and basic derivatives rules.',
    durationMinutes: 10,
    scheduledDate: '2026-07-13T10:00:00Z',
    totalPoints: 10,
    status: 'completed',
    questions: [
      {
        id: 'mq1',
        type: 'multiple-choice',
        text: 'What is the limit of (sin x) / x as x approaches 0?',
        options: ['0', '1', 'Undefined', 'Infinity'],
        correctAnswer: '1',
        points: 5,
      },
      {
        id: 'mq2',
        type: 'true-false',
        text: 'If a function is differentiable at x = a, then it must be continuous at x = a.',
        correctAnswer: 'true',
        points: 5,
      }
    ]
  },
  {
    id: 'exam-phys105-test',
    moduleId: 'mod-phys105',
    title: 'Unit Test 2: Rotational Dynamics',
    description: 'Calculations involving torque, angular momentum, moment of inertia, and rotational kinetic energy.',
    durationMinutes: 45,
    scheduledDate: '2026-07-16T14:30:00Z',
    totalPoints: 20,
    status: 'upcoming',
    questions: [
      {
        id: 'pq1',
        type: 'multiple-choice',
        text: 'What is the moment of inertia of a solid cylinder of mass M and radius R rotating about its central axis?',
        options: ['MR^2', '1/2 MR^2', '2/5 MR^2', '1/12 MR^2'],
        correctAnswer: '1',
        points: 10,
      },
      {
        id: 'pq2',
        type: 'true-false',
        text: 'Angular momentum is conserved in a system only when the net external torque is zero.',
        correctAnswer: 'true',
        points: 10,
      }
    ]
  },
  {
    id: 'exam-eng110-essay',
    moduleId: 'mod-eng110',
    title: 'Literary Critique Draft',
    description: 'A structured evaluation of symbolism in Mary Shelley\'s Frankenstein.',
    durationMinutes: 30,
    scheduledDate: '2026-07-14T12:00:00Z',
    totalPoints: 15,
    status: 'active',
    questions: [
      {
        id: 'eq1',
        type: 'multiple-choice',
        text: 'What major historical period serves as the philosophical context for Shelley\'s Frankenstein?',
        options: ['The Renaissance', 'The Enlightenment & Romanticism', 'The Victorian Era', 'The Post-Modern Era'],
        correctAnswer: '1',
        points: 5,
      },
      {
        id: 'eq2',
        type: 'short-answer',
        text: 'What natural element / resource represents both creation and destruction throughout the novel, symbolizing knowledge?',
        correctAnswer: 'fire',
        points: 10,
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    examId: 'exam-math202-quiz',
    studentId: 'student-1',
    submittedAt: '2026-07-13T10:08:15Z',
    score: 10,
    graded: true,
    feedback: 'Excellent work! You demonstrated perfect understanding of limits and differentiability properties.',
    answers: [
      {
        questionId: 'mq1',
        answer: '1',
        isCorrect: true,
        scoreEarned: 5,
      },
      {
        questionId: 'mq2',
        answer: 'true',
        isCorrect: true,
        scoreEarned: 5,
      }
    ]
  }
];

export function getStoredData() {
  if (typeof window === 'undefined') {
    return {
      users: INITIAL_USERS,
      modules: [],
      exams: INITIAL_EXAMS,
      submissions: INITIAL_SUBMISSIONS,
      currentUser: null,
    };
  }

  const users = localStorage.getItem('ems_users');
  const exams = localStorage.getItem('ems_exams');
  const submissions = localStorage.getItem('ems_submissions');
  const currentUser = localStorage.getItem('ems_current_user');

  return {
    users: users ? JSON.parse(users) : INITIAL_USERS,
    modules: [], // Always start empty, wait for backend
    exams: exams ? JSON.parse(exams) : INITIAL_EXAMS,
    submissions: submissions ? JSON.parse(submissions) : INITIAL_SUBMISSIONS,
    currentUser: currentUser ? JSON.parse(currentUser) : null,
  };
}

export function saveStoredData(data: {
  users?: User[];
  modules?: Module[];
  exams?: Exam[];
  submissions?: Submission[];
  currentUser?: User;
}) {
  if (typeof window === 'undefined') return;

  if (data.users) localStorage.setItem('ems_users', JSON.stringify(data.users));
  if (data.modules) localStorage.setItem('ems_modules', JSON.stringify(data.modules));
  if (data.exams) localStorage.setItem('ems_exams', JSON.stringify(data.exams));
  if (data.submissions) localStorage.setItem('ems_submissions', JSON.stringify(data.submissions));
  if (data.currentUser) localStorage.setItem('ems_current_user', JSON.stringify(data.currentUser));
}
