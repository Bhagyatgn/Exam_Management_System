const pool = require("../config/db");


class ModuleRepository {


async getAll(){

    const result = await pool.query(
        "SELECT * FROM courses ORDER BY created_at DESC"
    );

    return result.rows;

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


}


module.exports = new ModuleRepository();