import { FastifyRequest, FastifyReply } from "fastify";
import { verifyJWT } from "../utils/jwt";

export const authMiddleware = async (req: FastifyRequest, res: FastifyReply) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if(!token) return res.code(401).send({
        message: "Nonexistent authentication token."
    });

    const decodedToken = verifyJWT(token);

    if (!decodedToken || !decodedToken.data || !decodedToken.data.id) return res.code(401).send({ 
        message: "Invalid authentication token"
    });

    (req as any).userId = decodedToken.data.id;

    return;
}