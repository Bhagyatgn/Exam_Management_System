const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRepository = require("../models/auth.repository");




// REGISTER SERVICE

exports.register = async (
    full_name,
    email,
    password
) => {

    const cleanEmail = email.trim().toLowerCase();
    const existingUser =
        await authRepository.findUserByEmail(cleanEmail);



    if (existingUser) {

        throw new Error("User already exists");

    }



    const hashedPassword =
        await bcrypt.hash(password, 10);



    const user =
        await authRepository.createUser(
            full_name,
            cleanEmail,
            hashedPassword,
            "STUDENT"
        );



    return user;

};





// LOGIN SERVICE

exports.login = async (
    email,
    password
) => {

    const cleanEmail = email.trim().toLowerCase();
    const user =
        await authRepository.findUserByEmail(cleanEmail);



    if (!user) {

        throw new Error("Invalid credentials");

    }




    const match =
        await bcrypt.compare(
            password,
            user.password
        );



    if (!match) {

        throw new Error("Invalid credentials");

    }




    const token =
        jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET || "secretkey",

            {
                expiresIn: "1d"
            }

        );



    return {
        token,
        user
    };


};