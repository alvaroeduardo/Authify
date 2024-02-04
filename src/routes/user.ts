import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { encryptPassword } from "../utils/crypto";
import { transporter } from "../utils/mail";


export async function users(app: FastifyInstance) {
    app.post('/register', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string()
        });

        const { name, email, password } = bodySchema.parse(req.body);

        const existingEmail = await prisma.user.findFirst({
            where: { email }
        });

        if (!!existingEmail) return res.code(400).send({
            message: "E-mail already registered. Try another one."
        });

        const registeredUser = await prisma.user.create({
            data: {
                name,
                email,
                password: await encryptPassword(password)
            }
        });

        transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Email confirmation - Authify',
            text: `
                Thank you for subscribing to our platform! We are excited to have you with us.

                Your account has been created successfully. To complete the registration process, please click on the confirmation link below: https://localhost:8000/confirm/${registeredUser.id}

                By confirming your account, you will have full access to our platform's features and functionalities. This is the first step to making the most of everything we offer.
            `,
        }, (err, data) => {
            if (err) return res.code(400).send({
                message: "Unable to send confirmation email. Contact the development team."
            });

            return res.code(201).send({
                message: "User registered successfully. Access your email and confirm it to be able to use the platform.",
            });
        });
    });

    app.get('/confirm/:userId', async (req, res) => {
        const paramsSchema = z.object({ userId: z.string() });

        const { userId } = paramsSchema.parse(req.params);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return res.code(400).send({
            message: "User not registered."
        });

        if (user.confirmedEmail === true) return res.code(400).send({
            message: "Email already confirmed."
        });

        await prisma.user.update({
            where: { id: userId },
            data: { confirmedEmail: true }
        });

        return res.code(200).send({
            message: "Email confirmed successfully."
        });
    });
}