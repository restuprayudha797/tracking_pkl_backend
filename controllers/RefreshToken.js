import Users from "../models/TblUser.js";
import Role_user from "../models/TblRoleUser.js";
import jwt from "jsonwebtoken";
import { refreshTokenResponse } from "../config/response.js";


export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            attributes: ['user_id', 'user_name', 'email', 'phone_number', 'password'],  // Tambahkan password ke attributes
            include: {
                model: Role_user,
                attributes: ['role_name']
            },
            where: {
                refresh_token: refreshToken
            },
        });
        if (!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const user_id = user[0].user_id;
            const role_name = user[0].tbl_role_user.role_name;
            const user_name = user[0].user_name;
            const email = user[0].email;
            const phone_number = user[0].phone_number;
            const accessToken = jwt.sign({ user_id, role_name, user_name, email, phone_number }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30d'
            });
            console.log(email);
            refreshTokenResponse(200, 200, 'success', { refresh_token: accessToken, expiresIn: 2592000, token_type: 'Bearer' }, 'successfully get refresh_token', res)
        });
    } catch (error) {
        console.log(error);

    }
}