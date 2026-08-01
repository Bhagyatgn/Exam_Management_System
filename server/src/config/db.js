const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.DB_HOST && process.env.DB_NAME) {
  try {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    });
  } catch (error) {
    console.error("Error creating pg pool:", error);
  }
} else {
  console.warn('DB credentials missing — using in-memory mock');
  
  // Basic mock storage
  const mockStorage = {
    courses: [
      { id: '1', course_code: 'CS101', course_name: 'Intro to CS', description: 'Basic CS concepts' },
      { id: '2', course_code: 'CS201', course_name: 'Data Structures', description: 'Lists, Trees, Graphs' }
    ],
    users: [
      { id: '1', full_name: 'Teacher User', email: 'teacher@test.com', password: '$2b$10$TcP1RAjkQeCnh9sp33D78OU071M2o7QwxJG.ZI8MNd9jDITGicVEq', role: 'teacher' }
    ]
  };

  pool = {
    query: async (queryText, params) => {
      console.log("[MOCK QUERY]", queryText, params);
      
      if (queryText.includes('SELECT * FROM courses ORDER BY created_at')) {
        return { rows: mockStorage.courses };
      }
      if (queryText.includes('INSERT INTO courses')) {
        const newCourse = {
          id: String(Date.now()),
          course_code: params[0],
          course_name: params[1],
          description: params[2],
          teacher_id: params[3]
        };
        mockStorage.courses.push(newCourse);
        return { rows: [newCourse] };
      }
      if (queryText.includes('UPDATE courses')) {
        const course = mockStorage.courses.find(c => c.id === params[3]);
        if (course) {
          course.course_code = params[0];
          course.course_name = params[1];
          course.description = params[2];
        }
        return { rows: [course].filter(Boolean) };
      }
      if (queryText.includes('DELETE FROM courses')) {
        const index = mockStorage.courses.findIndex(c => c.id === params[0]);
        let deleted = null;
        if (index > -1) {
          deleted = mockStorage.courses.splice(index, 1)[0];
        }
        return { rows: [deleted].filter(Boolean) };
      }
      if (queryText.includes('SELECT * FROM users WHERE email')) {
        const user = mockStorage.users.find(u => u.email === params[0]);
        return { rows: [user].filter(Boolean) };
      }
      if (queryText.includes('INSERT INTO users')) {
        const newUser = {
          id: String(Date.now()),
          full_name: params[0],
          email: params[1],
          password: params[2], // In real app, this should already be hashed
          role: params[3]
        };
        mockStorage.users.push(newUser);
        return { rows: [newUser] };
      }
      if (queryText.includes('NOW()')) {
        return { rows: [{ now: new Date().toISOString() }] };
      }
      return { rows: [] };
    },
    connect: async () => ({ query: async () => ({ rows: [] }), release: () => {} }),
    on: () => {}
  };
}

module.exports = pool;