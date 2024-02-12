import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth";
import { encryptPassword } from "../utils/crypto"
import { transporter } from "../utils/mail";
import { logsMiddleware } from "../middlewares/log";

export async function users(app: FastifyInstance) {
    app.addHook('preHandler', logsMiddleware);

    app.get('/perfil', { preHandler: authMiddleware }, async (req, res) => {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        return res.code(200).send({ user });
    });

    app.put('/perfil/update', { preHandler: authMiddleware }, async (req, res) => {
        const userId = (req as any).userId;

        const bodySchema = z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            password: z.string().optional()
        });

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        const { name, email, password } = bodySchema.parse(req.body);

        await prisma.user.update({
            where: { id: userId },
            data: {
                name: name ? name : user?.name,
                email: email ? email : user?.email,
                password: password ? await encryptPassword(password) : user?.password
            }
        });

        if (!!email) {
            await prisma.user.update({
                where: { id: userId },
                data: { confirmedEmail: false }
            });

            transporter.sendMail({
                from: process.env.MAIL_USERNAME,
                to: email,
                subject: 'Email confirmation - Authify',
                text: `
                    We would like to inform you that your email change request was successfully processed on our platform. Now, to complete the process and activate the new email address, please follow the instructions below:

                    Access your inbox from the new email address you found during the change process.

                    Look for a confirmation email from us Authify. Also check your spam or junk folder if you don't see the email in your main inbox.

                    Open the confirmation email and click on the activation link provided. This will ensure that your new email address is associated with your account. https://localhost:8000/confirm/${user?.id}

                    Please note that your new email address will not be fully activated until you complete this confirmation process.

                    If you do not request this email change, please contact us by responding immediately to this email. Our team will be happy to help you.

                    If you need additional assistance or have any questions, please don't hesitate to contact us by replying to this email.
                `,
            }, (err, data) => {
                if (err) return res.code(400).send({
                    message: "Unable to send confirmation email. Contact the development team."
                });

                return res.code(201).send({
                    message: "Email successfully sent. Activate it.",
                });
            });
        }

        return res.code(200).send({
            message: "Data updated successfully."
        });
    });
}