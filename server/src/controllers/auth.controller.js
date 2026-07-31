const authService = require("../services/auth.service");



// REGISTER

exports.register = async (req, res) => {


    try {


        const {
            full_name,
            email,
            password
        } = req.body;

        const user =
            await authService.register(
                full_name,
                email,
                password
            );



        res.status(201).json({

            message: "User registered successfully",
            user

        });



    } catch (error) {

        console.log("FULL REGISTER ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });


    }


};







// LOGIN

exports.login = async (req, res) => {


    try {


        const {
            email,
            password
        } = req.body;




        const result =
            await authService.login(
                email,
                password
            );



        res.json({

            message: "Login successful",
            ...result

        });



    } catch (error) {


        res.status(400).json({

            message: error.message

        });


    }


};