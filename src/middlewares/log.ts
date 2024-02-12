import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../utils/prisma";

export const logsMiddleware = async (req: FastifyRequest, res: FastifyReply) => {
    const ip = req.ip;
    const action = req.url;

    await prisma.log.create({
        data: {
            ip,
            action
        }
    });

    return;
}