import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Debe enviar username y password.'
        });
    }

    const validUsername = 'admin';
    const validPassword = 'admin123';

    if (username !== validUsername || password !== validPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Credenciales inválidas.'
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'JWT_SECRET no está configurado en el entorno.'
        });
    }

    const payload = {
        username,
        role: 'admin'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    return res.status(StatusCodes.OK).json({
        message: 'Login correcto.',
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        user: payload
    });
});

export default router;
