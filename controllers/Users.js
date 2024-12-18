import bcrypt from "bcrypt";
import Users from "../models/TblUser.js";
import Role_user from "../models/TblRoleUser.js";
import { response, loginResponse } from "../config/response.js";
import jwt from "jsonwebtoken";

export const getAllUser = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['user_id', 'user_name', 'email', 'phone_number'],
            include: {
                model: Role_user,
                attributes: ['role_name']
            }
        });
        response(200, 200, "success", users, "get all user successfully", res);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { role_user, user_name, email, phone_number, password, confirmPassword } = req.body;

    if (!role_user || !user_name || !email || !phone_number || !password || !confirmPassword) return response(400, 400, "failed", null, "all fields are required", res);

    if (password !== confirmPassword) return response(400, 400, "failed", null, "passwrod not match", res);

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            role_user: role_user,
            user_name: user_name,
            email: email,
            phone_number: phone_number,
            password: hashedPassword
        });

        response(201, 201, "success", null, "created user successfully", res);

    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log("SQL Error:", error.errors[0].message);
            return response(400, 400, "failed", null, error.errors[0].message, res);
        } else if (error.name === 'SequelizeDatabaseError') {
            console.log("database error", error.message);
            return response(500, 500, "failed", null, error.message, res);
        } else {
            return response(500, 500, "failed", null, "Internal Server Error", res);
        }

    }

}

export const Login = async (req, res) => {
    const { email, password } = req.body;  // Ambil email dan password dari request body
    if (!email || !password) return response(400, 400, "failed", null, "all fields are required", res);

    try {
        const user = await Users.findAll({
            attributes: ['user_id', 'user_name', 'email', 'phone_number', 'password'],  // Tambahkan password ke attributes
            include: {
                model: Role_user,
                attributes: ['role_name']
            },
            where: {
                email: email  // Filter berdasarkan email
            },
        });

        if (user.length === 0) return response(404, 404, "failed", null, "email not found", res);  // Pastikan ada user yang ditemukan

        // Membandingkan password yang dimasukkan dengan password yang ada di database
        const match = await bcrypt.compare(password, user[0].password);
        if (!match) return response(400, 400, "failed", null, "invalid password", res);

        // Ambil data dari user yang ditemukan
        const user_id = user[0].user_id;
        const role_name = user[0].tbl_role_user.role_name;
        const user_name = user[0].user_name;
        const emailFromDb = user[0].email;  // Gunakan nama lain untuk email yang didapat dari database
        const phone_number = user[0].phone_number;

        const accessToken = jwt.sign({ user_id, role_name, user_name, email: emailFromDb, phone_number }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'  // Access token expired dalam 5 menit
        });

        const refreshToken = jwt.sign({ user_id, role_name, user_name, email: emailFromDb, phone_number }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '30d'  // Refresh token expired dalam 1 hari
        });

        // Menyimpan refresh token di database
        await Users.update({
            refresh_token: refreshToken
        }, {
            where: {
                user_id: user_id
            }
        });

        // Menyimpan refresh token di cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,  // Bisa diaktifkan untuk menggunakan HTTPS
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const getAllUser = await Users.findAll({
            attributes: ['user_id', 'user_name', 'email', 'phone_number'],
            include: {
                model: Role_user,
                attributes: ['role_name']
            },
            where: {
                user_id: user_id
            }
        });
        loginResponse(200, 200, "success", { access_token: accessToken, expires_in: 3600, token_type: 'Bearer' }, getAllUser[0], "login successfully", res);

    } catch (error) {
        console.log(error);
        response(404, 404, "failed", null, "email not found", res);
    }
}


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);
    const user_id = user[0].user_id;
    await Users.update({ refresh_token: null }, {

        where: {
            user_id: user_id
        }

    });

    res.clearCookie('refreshToken');
    return response(200, 200, "success", null, "logout successfully", res);
}
