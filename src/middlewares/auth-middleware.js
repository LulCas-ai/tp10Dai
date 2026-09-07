import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const extractBearerToken = (authorizationHeader) => {
    if (!authorizationHeader) {
        return null;
    }

    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
};

export const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const token = extractBearerToken(authorizationHeader);

    if (!authorizationHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Falta el header Authorization.'
        });
    }

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Formato de token inválido. Debe ser: Authorization: Bearer <token>'
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Token expirado.'
            });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Token inválido.'
        });
    }
};
