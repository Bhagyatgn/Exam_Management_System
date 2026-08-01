const pool = require("../config/db");

class ModuleRepository {
  async getAll(){
      const result = await pool.query(
          "SELECT * FROM courses ORDER BY created_at DESC"
      );
      return result.rows;
  }
  
  async getById(id) {
      const result = await pool.query(
          "SELECT * FROM courses WHERE id = $1",
          [id]
      );
      return result.rows[0];
  }

  async create(moduleData){
      const result = await pool.query(
          `
          INSERT INTO courses
          (
              course_code,
              course_name,
              description,
              teacher_id
          )
          VALUES($1,$2,$3,$4)
          RETURNING *
          `,
          [
              moduleData.course_code,
              moduleData.course_name,
              moduleData.description,
              moduleData.teacher_id
          ]
      );
      return result.rows[0];
  }
  
  async update(id, moduleData) {
      const result = await pool.query(
          `
          UPDATE courses
          SET course_code = $1, course_name = $2, description = $3
          WHERE id = $4
          RETURNING *
          `,
          [
              moduleData.course_code,
              moduleData.course_name,
              moduleData.description,
              id
          ]
      );
      return result.rows[0];
  }
  
  async delete(id) {
      const result = await pool.query(
          "DELETE FROM courses WHERE id = $1 RETURNING *",
          [id]
      );
      return result.rows[0];
  }
}

module.exports = new ModuleRepository();
