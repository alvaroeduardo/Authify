import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { encryptPassword } from "../utils/crypto";
import { transporter } from "../utils/mail";


export async function users(app: FastifyInstance) {

}